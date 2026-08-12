# RFID Check-in on Windows Laptops (Fully Automatic)

Your organization runs Windows laptops, so the goal is: **open the portal, tap a
card, person is checked in/out automatically** — no typing, no clicking.

## The hardware options

| Option | What you need | Cost | Automation |
|--------|---------------|------|-----------|
| **A. RC522 + Arduino as USB keyboard** (recommended) | Your RC522 + an Arduino Leonardo/Micro/Pro Micro (ATmega32U4) | ~$8–12 | Fully automatic — tap card → typed into browser → check-in/out |
| **B. Off-the-shelf USB keyboard-wedge reader** | Buy a USB RFID reader | ~$20–50 | Fully automatic — same behavior, nothing to program |

Both work identically from the laptop's point of view: they appear as a USB
keyboard, "type" the card UID into the focused field, and press **Enter**.
The Registration Unit portal already has an auto-focused **Scan Card** box that
submits on Enter, so no browser work is needed for the basic flow.

> The Raspberry Pi reader service (`rfid-reader/index.js`) is **not** needed for
> the Windows flow. It's only for a Linux box / a shared server-side reader that
> posts directly to the backend.

---

## Option A — RC522 + Arduino as a USB keyboard (recommended, uses your RC522)

**1. Get a board that can be a USB keyboard.** The RC522 itself has no USB port.
You need an Arduino with an **ATmega32U4** chip (Leonardo, Micro, Pro Micro).
A plain Uno/Nano **cannot** do this.

**2. Wire the RC522 to the Arduino:**

| RC522 pin | Arduino pin |
|-----------|-------------|
| `SDA`     | D10 |
| `SCK`     | D13 |
| `MOSI`    | D11 |
| `MISO`    | D12 |
| `RST`     | D9  |
| `IRQ`     | — (unconnected) |
| `VCC`     | 3.3V |
| `GND`     | GND |

**3. Flash the sketch** in `rfid-reader/arduino/rc522_usb_keyboard/`:
- Install the **MFRC522** library (Arduino IDE → Library Manager).
- Select your board + COM port, upload.
- The sketch reads the UID and types it + Enter into whatever field is focused.

**4. On the Windows laptop**, open the Registration Unit portal
(`/registrationunit`), select the event (it remembers your last choice), and
make sure **Kiosk mode** is ON. Now just tap cards.

---

## Option B — Off-the-shelf USB keyboard-wedge reader

Buy a USB RFID reader that emulates a keyboard (most 125kHz EM4100 readers, or
a 13.56MHz reader for the same tags the RC522 uses). Plug it in; when a card is
tapped it types the UID + Enter into the focused field. Same browser flow as
Option A. If the reader types an extra suffix like a newline or tab, the portal
handles both **Enter** and **Tab** as submit.

---

## Portal behavior (already built in)

The Registration Unit portal (`src/routes/registrationunit/index.jsx`) now:

- **Persists your last-selected event** (`localStorage`), and auto-selects the
  first event if none is chosen — so it's ready to scan immediately on load.
- **Auto-submits** a full UID: as soon as a valid UID is present and stops
  changing (~250ms), or when Enter/Tab is received, it checks the person in/out.
- **Kiosk mode** (default ON) keeps the scan box focused so you can tap card
  after card without clicking. Click the checkbox to toggle it off when an
  operator needs to use the mouse.
- Shows each attendee's assigned card UID and lets you assign cards with the
  **+ Assign card** button (used once to link a person to their card).

---

## First-time setup on event day

1. **Assign cards to attendees** (do this once at check-in registration):
   - In the portal, find the attendee, click **+ Assign card**, tap their card
     on the reader, and paste/enter the UID shown.
   - This requires the backend `PATCH /eventAttendees/:userId/rfid` endpoint
     (see `docs/rfid-integration.md`).
2. **Select the event** (or let it auto-select).
3. **Turn on Kiosk mode**, focus the page, and tap cards to check people in.

For **food lines / multiple stations**, open one portal tab per station on the
same event — the 30s auto-refresh keeps them all in sync — or use separate
"events" per station if you want separate tallies.

---

## Quick troubleshooting

- **Cards not typing anything:** wrong Arduino board (must be ATmega32U4),
  wrong COM port, or RC522 wiring (check SDA/SCK/MOSI/MISO/RST/VCC/GND).
- **UID typed but nothing happens:** check the attendee has that UID assigned,
  and that the event is selected.
- **Double check-in:** lower the Arduino's `COOLDOWN_MS` — or raise it if a card
  only registers after holding it.
- **Focus lost:** re-enable **Kiosk mode** and click anywhere on the page.
