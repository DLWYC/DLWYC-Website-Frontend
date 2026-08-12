# DLWYC — RFID Check-in/Out: Tester's Guide

Use this guide to test the **RFID event check-in / check-out** feature end to
end, including food-station setup, the scan confirmation, and CSV exports.

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

**Simulate a card tap** — type (or paste) one of these UIDs into the **Scan
Card** box and press **Enter** (or wait ~1s — it auto-submits):

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

## 5. Food stations / multiple checkpoints

Open **http://localhost:3000/registrationunit/stations** (or click **Stations**
in the portal header). This is a launchpad of every event.

- Each event is a **station card** with an **"Open this station"** button.
- Clicking it opens the check-in portal in a new tab **pre-locked to that
  event** — the reader is "wired" to the station with zero clicks.
- The **Station** badge at the top confirms which event you're scanning.

To simulate several stations, open multiple browser tabs from this page.

---

## 6. CSV exports (for food billing / attendance)

On the check-in page:

- **Recent Scans → Export** — downloads the full card-tap audit trail as a CSV
  with a summary header (total / checked-in / checked-out / unknown).
- **Report** — downloads the selected event's attendee list with check-in
  status as a CSV, respecting the current archdeaconry + search filters, and
  appends a totals row.

Open the `.csv` files in Excel or Google Sheets.

---

## 7. Other useful things

- **Assign a card:** on an attendee card with no UID, click **+ Assign card**
  and paste a UID to link that person to a card.
- **Kiosk mode** (default ON) keeps the scan box focused so you can tap cards
  continuously without clicking.
- **Scan history** refreshes every 10s and updates the summary cards.
- To stop the servers: press `Ctrl + C` in the terminal.

---

## 8. What it all connects to (architecture, short version)

```
[ RFID reader ]  --types the card UID-->  [ Browser: Scan Card box ]
                                                 |
                                              auto-submits
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
| Port already in use | Close other apps using ports 3000/4000, or restart your machine |
