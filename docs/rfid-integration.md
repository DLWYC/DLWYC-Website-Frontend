# RFID (RFID-RC522) Check-in / Check-out Integration

This guide explains how to wire an **RFID-RC522** reader into the DLWYC app so
attendees can check in and out of events, food lines, etc. by tapping a card.

## Why a browser alone can't do this

This repository is the **frontend** (React + TanStack Router + Vite). The RC522
is **SPI hardware** that connects to a microcontroller (Raspberry Pi / ESP32 /
Arduino). Web browsers have no way to talk to SPI, so we bridge it:

```
[ RC522 ] --SPI--> [ Raspberry Pi reader service ] --HTTP--> [ Your backend ]
                                                                   |
                                              [ Frontend portal ]<---- picks up changes (polls every 30s)
```

## What's already in this repo

### 1. Raspberry Pi reader service — `rfid-reader/`
A small Node.js service that runs on a Pi wired to the RC522. Two modes:

- **`toggle`** — reads a tag's UID and POSTs it to your backend
  (`POST /api/registrationUnit/rfid/scan`) so the backend looks up the
  attendee by that UID and flips their check-in/check-out.
- **`console`** — just prints the UID (`SCANNED 1234ABCD...`) so you can test
  the wiring and then type/paste it into the web portal.

See `rfid-reader/README.md` for wiring, install, and run steps.

### 2. Frontend — Registration Unit portal (`src/routes/registrationunit/index.jsx`)
Added an **RFID Card Scanner** box and per-attendee card features:

- **Scan Card box** — an auto-focused input. Works with:
  - a **USB keyboard-wedge reader** (types the UID + Enter automatically),
  - a manually **typed/pasted UID** printed by the Pi service in console mode.
- On submit it finds the attendee by their stored UID and toggles
  **check-in / check-out** using the same endpoints the existing buttons use
  (`.../checkIn` and `.../undoCheckIn`).
- Each attendee card now **shows its assigned UID** (reads `cardUID` or
  `rfidTag`) and has a **"+ Assign card"** button to bind a UID to that
  attendee.

## What the backend team needs to add

The frontend and reader service assume your backend provides:

1. **`cardUID` field on attendee records.** The attendee objects returned by
   `GET /api/registrationUnit/eventAttendees/:eventTitle` should include the
   attendee's card UID (e.g. `cardUID: "1234ABCD"`). Both the reader service
   and the scan box look this up.

2. **`PATCH /api/registrationUnit/eventAttendees/:userId/rfid`**
   Body: `{ cardUID }`. Stores the UID on the attendee. Used by the
   "Assign card" button. If your endpoint path differs, update it in
   `handleAssignRfid` in `registrationunit/index.jsx`.

3. **`POST /api/registrationUnit/rfid/scan`** (used by the Pi reader in
   `toggle` mode). Body: `{ cardUID, eventTitle }`. It should resolve the
   attendee by UID and toggle their check-in/check-out for the event,
   returning something like `{ action: 'checkedIn' | 'checkedOut', attendee }`.

If you'd rather not add `POST /rfid/scan` on the backend, use the simpler
flow instead:

> **Simplest path (no new backend endpoint):**
> 1. In the portal, click **"+ Assign card"** on each attendee and paste their
>    UID (from `npm run scan` on the Pi).
> 2. At the door, use a **USB keyboard-wedge reader** into the **Scan Card**
>    box — it auto-submits and toggles check-in/out. No backend endpoint
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
