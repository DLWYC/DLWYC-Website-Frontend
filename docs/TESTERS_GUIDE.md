# DLWYC — RFID + QR Check-in/Out: Tester's Guide

Use this guide to test the **event check-in / check-out** feature (RFID card
taps **and** QR code scans from a phone — mobile devices are the intended
setup), including food-station setup, the scan confirmation, and CSV exports.

> Target audience: the person reviewing/testing the app (your boss).
> The whole thing runs **locally on a Windows laptop** — no internet service,
> no hosted deployment needed. Demo data is generated automatically.

---

## 1. What you need

- **Node.js 18+** (https://nodejs.org) — includes `npm`.
- A **Windows laptop** (any other OS works too, commands are the same).
- The project folder (unzipped) somewhere on disk.

> You do **not** need a physical RFID reader to test the software. You can type
> or paste a card UID into the **Scan Card** box to simulate a tap. (Wiring the
> real reader is covered in `docs/windows-setup.md`.)

---

## 2. How to run it (one command)

Open a terminal (PowerShell or Command Prompt) in the project folder and run:

```bash
npm run setup      # installs dependencies (frontend + backend) — do this once
npm run dev:full   # starts the backend (:4000) + the website (:3000) together
```

Then open your browser to:

```
http://localhost:3000
```

You should see the DLWYC website. Leave the terminal running.

> **Tip:** `npm run dev:full` runs both servers with one command. If you only
> see one, scroll the terminal — they share the same window.

---

## 3. Log in

1. Go to **http://localhost:3000/adminLogin**
2. Use the demo account (also shown on the page):
   - Email: **`admin@dlwyc.org`**
   - Password: **`admin123`**
3. Click **Login**. You'll land on the **Registration Unit / Event Check-In**
   page.

---

## 4. What to test (the check-in flow)

The page auto-selects the **2025 YOUTH CAMP** event and shows a **Station**
badge and a **Scan Card** box.

**Simulate a card tap** — expand **"RFID card scan"** under the Check-In
Scanner, then type (or paste) one of these UIDs into the box and press
**Enter** (or wait ~1s — it auto-submits):

| Card UID | Attendee |
|----------|----------|
| `4500D62C8B` | Timilehin Adebayo |
| `B100AF3021` | Adaeze Okafor |
| `F12A9C4478` | Emeka Nwosu |
| `33AA1D90BC` | Chidinma Eze |

Expected:

- A big **green "You're checked in!"** overlay pops up with the attendee's name
  and card UID, then clears on its own (~3.5s).
- The attendee's card turns **green** and shows the check-in status.
- The **Checked In** stat and the **Recent Scans** feed update.

**Tap the same card again** → you get the **amber "You've been checked out"**
overlay, and the attendee toggles back out.

**Unknown card** — type `9999999999` → you get an error toast and it shows as
**UNKNOWN** in Recent Scans.

---

## 5. QR Code Check-In (phone camera)

The same check-in/out flow now works with **QR codes** — the QR is the
attendee's "digital card" and it stores two things:

1. the attendee's **full name** (e.g. `Grace Osei`)
2. the **event ID** (e.g. `evt-camp`)

At the desk the person is resolved **by name within that event**
(case- and whitespace-insensitive). If **two attendees in the same event have
the same name**, the scan is rejected with an **ambiguous** error (HTTP 409)
and an **ambiguous** entry in Recent Scans — the system never guesses; check
that person in with their RFID card or unique ID instead.

> Older QR passes that carry a **unique ID** (formats
> `DLWYC-CHKIN|<eventId>|<uniqueId>`,
> `DLWYC-CHKIN|<fullName>|<eventId>|<uniqueId>` and
> `DLWYC-CHKIN|<uniqueId>`) still work — the unique ID wins and resolves the
> right person even if their name is duplicated.

### 5a. Get an attendee's QR pass (two ways)

- **Registration Unit portal:** on any attendee card, click the small **QR**
  button (next to the card UID) → a modal shows that person's check-in QR.
  Use **Print pass** to print a physical pass.
- **User dashboard (the attendee's own side):** log in at
  **http://localhost:3000/userlogin** with the demo account (shown on the
  page): `attendee1@example.com` / `attendee123` → on the dashboard, open
  **Show Check-In QR** under the event you're registered for. That is the QR
  the attendee would present on their phone at the gate.

### 5b. Scan it

1. On the Registration Unit portal, click the big **Scan QR Code** button
   (the default action at the top of the Check-In Scanner).
2. The browser opens **this device's camera** right inside the page — allow
   the camera permission when the browser asks. (This is the intended setup:
   each operator just uses **their own phone**.)
3. Point it at the QR pass (from another phone/screen). As soon as it's
   read, the same **green "checked in!" / amber "checked out"** confirmation
   appears and **Recent Scans** updates (QR scans show a violet **QR** tag).
4. **Scan next** keeps the camera running for the next attendee.

> **Phone cameras need HTTPS.** On a phone, the page must be opened over an
> HTTPS connection for the camera to work (browsers block cameras on plain
> HTTP). For the actual event, host the portal on an HTTPS address (any
> hosting provider, or a local tunnel) and everyone's phones work as-is.
>
> Optional, only if you specifically want it: a separate camera device
> plugged into a computer also appears in the scanner's camera list — but
> the plan is to stick with mobile devices.

### 5c. Guards

- Scanning a QR **for a different event** than the one the person is
  registered for shows an error and a **WRONG** entry in Recent Scans.
- Scanning a random QR code shows "That QR code is not a DLWYC check-in
  code".

---

## 6. Food stations / multiple checkpoints

Open **http://localhost:3000/registrationunit/stations** (or click **Stations**
in the portal header). This is a launchpad of every event.

- Each event is a **station card** with an **"Open this station"** button.
- Clicking it opens the check-in portal in a new tab **pre-locked to that
  event** — the reader is "wired" to the station with zero clicks.
- The **Station** badge at the top confirms which event you're scanning.

To simulate several stations, open multiple browser tabs from this page.

---

## 7. CSV exports (for food billing / attendance)

On the check-in page:

- **Recent Scans → Export** — downloads the full card-tap audit trail as a CSV
  with a summary header (total / checked-in / checked-out / unknown).
- **Report** — downloads the selected event's attendee list with check-in
  status as a CSV, respecting the current archdeaconry + search filters, and
  appends a totals row.

Open the `.csv` files in Excel or Google Sheets.

---

## 8. Other useful things

- **Assign a card:** on an attendee card with no UID, click **+ Assign card**
  and paste a UID to link that person to a card.
- **Kiosk mode** (default ON) keeps the scan box focused so you can tap cards
  continuously without clicking.
- **Scan history** refreshes every 10s and updates the summary cards.
- To stop the servers: press `Ctrl + C` in the terminal.

---

## 9. What it all connects to (architecture, short version)

```
[ RFID reader ]  --types the card UID-->   [ Browser: Scan Card box ]
                                              |
[ Phone camera ]        --scans QR pass-->   [ Browser: Scan QR Code ]
                                              |
                                        resolves to the
                                        same check-in/out
                                              v
                                     [ Backend :4000  (/api/registrationUnit) ]
                                                 |
                                     stored + shown in the portal + exports
```

The backend runs locally on port **4000** with a JSON data file
(`backend/data/db.json`, auto-seeded on first run). The website runs on port
**3000** and proxies API calls to it — no extra configuration needed.

For the **physical hardware** (Arduino/USB reader, Raspberry Pi) and wiring,
see `docs/windows-setup.md` and `docs/rfid-integration.md`.

---

## Quick troubleshooting

| Problem | Fix |
|---------|-----|
| `npm` command not found | Install Node.js from https://nodejs.org, then reopen the terminal |
| Page won't load at :3000 | Make sure `npm run dev:full` is running and shows no red errors |
| Login says "Invalid credentials" | Use exactly `admin@dlwyc.org` / `admin123` |
| Nothing happens on scan | The event must be selected (Station badge visible) and the UID must be assigned to an attendee |
| QR scanner says camera is unavailable on a phone | Phone browsers only allow cameras over **HTTPS** — open the portal via an HTTPS link (a production host or a tunnel). On a computer, `localhost` works |
| QR scanner says "permission was blocked" | Click the camera/lock icon in the browser address bar and allow camera access, then press Start camera |
| Port already in use | Close other apps using ports 3000/4000, or restart your machine |
