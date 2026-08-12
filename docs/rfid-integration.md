# RFID (RFID-RC522) Check-in / Check-out Integration

This guide explains how to wire an **RFID-RC522** reader into the DLWYC app so
attendees can check in and out of events, food lines, etc. by tapping a card.

## Quick answer for Windows laptops

Your organization uses **Windows laptops**, so the recommended setup is a USB
reader that behaves like a keyboard: you open the portal, tap a card, and the
person is checked in/out automatically. See **[windows-setup.md](windows-setup.md)**.

Two ways to get that behavior:
- **RC522 + an Arduino (ATmega32U4) as a USB keyboard** — use the sketch in
  `rfid-reader/arduino/rc522_usb_keyboard/`. Tap card → UID typed into the
  browser → check-in/out. Fully automatic, uses your existing RC522.
- **An off-the-shelf USB keyboard-wedge reader** — plug-and-play, same result.

The **Raspberry Pi reader service** (`rfid-reader/`) below is optional — it's
for a Linux box or a shared server-side reader. You don't need it on Windows.

## Why a browser alone can't do this

This repository is the **frontend** (React + TanStack Router + Vite). The RC522
is **SPI hardware** that connects to a microcontroller (Raspberry Pi / ESP32 /
Arduino). Web browsers have no way to talk to SPI, so we bridge it:

```
[ RC522 ] --SPI--> [ Raspberry Pi reader service ] --HTTP--> [ Your backend ]
                                                                   |
                                              [ Frontend portal ]<---- picks up changes (polls every 30s)
```

On Windows the "reader" is a **USB device that types the UID into the browser**
(keyboard emulation), which is even simpler — no reader service at all:

```
[ RC522 ] --SPI--> [ Arduino as USB keyboard ] --USB--> [ Windows laptop + browser ]
                                                              |
                                              [ Frontend portal ]--picks up + toggles check-in
```

## What's already in this repo

### 1. USB reader for Windows — `rfid-reader/arduino/rc522_usb_keyboard/`
Arduino sketch that turns your **RC522 + an ATmega32U4 Arduino** into a USB
keyboard. Tap a card → it types the UID + Enter into the focused portal field
→ auto check-in/out. See **[windows-setup.md](windows-setup.md)**.

### 2. Raspberry Pi reader service — `rfid-reader/` (optional, Linux only)
A small Node.js service that runs on a Pi wired to the RC522. Two modes:

- **`toggle`** — reads a tag's UID and POSTs it to your backend
  (`POST /api/registrationUnit/rfid/scan`) so the backend looks up the
  attendee by that UID and flips their check-in/check-out.
- **`console`** — just prints the UID (`SCANNED 1234ABCD...`) so you can test
  the wiring and then type/paste it into the web portal.

See `rfid-reader/README.md` for wiring, install, and run steps.

### 3. Frontend — Registration Unit portal (`src/routes/registrationunit/index.jsx`)
Added an **RFID Card Scanner** box and per-attendee card features:

- **Scan Card box** — auto-focused and **auto-submits**: a full UID submits on
  its own (~250ms after typing stops) or on **Enter** / **Tab** (the suffix
  most USB readers send). Toggles **check-in / check-out**.
- **Kiosk mode** (default ON) keeps the scan box focused so you can tap card
  after card with no clicks.
- **Persists your selected event** across page loads and auto-selects the first
  event, so the portal is scan-ready immediately.
- Each attendee card **shows its assigned UID** (reads `cardUID` or `rfidTag`)
  and has a **"+ Assign card"** button to bind a UID to that attendee.

## Backend — now included in this repo

A working backend is provided in **`backend/`** (Express + JSON-file store,
auto-seeded). It implements the full Registration Unit + RFID flow and is wired
to the frontend via the Vite dev proxy, so you can run everything locally with:

```bash
npm run dev:full    # runs backend (:4000) + frontend (:3000) together
```

See **`backend/README.md`** for endpoints and the demo login
(`admin@dlwyc.org` / `admin123`). Seed data already includes attendees with
assigned card UIDs you can scan immediately.

### Endpoints the frontend/reader rely on

1. **`cardUID` field on attendee records.** `GET
   /api/registrationUnit/eventAttendees/:eventTitle` returns each attendee's
   `cardUID`. Both the reader service and the scan box look this up.

2. **`PATCH /api/registrationUnit/eventAttendees/:userId/rfid`**
   Body: `{ cardUID }`. Stores the UID (and rejects cards already bound to
   someone else). Used by the "Assign card" button.

3. **`POST /api/registrationUnit/rfid/scan`** (used by the Pi reader in
   `toggle` mode). Body: `{ cardUID, eventTitle }`. Resolves the UID and
   toggles check-in/check-out, returning `{ action: 'checkedIn'|'checkedOut' }`.

> **Going to production:** replace the JSON store in `backend/src/store.js` with
> a real database and add JWT + real payment verification — the API shape stays
> the same, so the frontend doesn't change.

If you'd rather not use the `/rfid/scan` endpoint, use the simpler
flow instead:

> **Simplest path (no new backend endpoint):**
> 1. In the portal, click **"+ Assign card"** on each attendee and tap their
>    card on the Arduino/USB reader (or paste the UID) to store the `cardUID`.
> 2. At the door, tap cards — the reader types the UID into the **Scan Card**
>    box, which auto-submits and toggles check-in/out. No backend endpoint
>    beyond storing `cardUID` is needed.

## For food stations / multiple checkpoints

The same pattern works anywhere you want attendance tracked (main gate, food,
sessions). Options:

- **Multiple portals** — one browser tab per station, each on the same event.
  The existing 30s auto-refresh keeps every station's list in sync.
- **Per-station event** — create separate "events" per station (e.g.
  "Day 1 Lunch") and run the scan box against each. Uses the exact same code.
- **Real-time** — if you want instant cross-tab updates, add a WebSocket that
  the reader service pushes scan events to; subscribe in the portal. (Not
  implemented here — covered under Path C in the overview.)

## Data model

Add a `cardUID` string to your attendee/registration model:

```js
// attendee
{
  userId: '...',
  fullName: '...',
  uniqueId: 'DLW/IK/2025/0001',
  cardUID: '1234ABCD',   // <-- RFID UID (normalized, uppercase, no colons)
  email: '...',
  eventDetails: { checkedInStatus: false, paymentStatus: 'success', ... }
}
```

UIDs are normalized everywhere to **uppercase hex, no colons/spaces**, e.g.
`12:34:ab:cd` → `1234ABCD`, so formatting differences don't cause misses.
