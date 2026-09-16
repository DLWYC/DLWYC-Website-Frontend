# DLWYC Website Frontend

The web frontend for **Diocese of Lagos Worshiping Youth Convention (DLWYC)** —
the public website, user dashboard, and the **Registration Unit** portal with
event **check-in / check-out by RFID card and QR code** (phone camera).

## Quick start (one command)

```bash
npm run setup      # installs frontend + backend dependencies (do once)
npm run dev:full   # starts the backend (:4000) + the website (:3000) together
```

Then open **http://localhost:3000**.

Demo accounts (also shown on the login pages):

| Portal | Email | Password |
|---|---|---|
| Registration Unit (admin) | `admin@dlwyc.org` | `admin123` |
| User dashboard (attendee) | `attendee1@example.com` | `attendee123` |

> No database or external service is required: the backend auto-seeds a JSON
> data file (`backend/data/db.json`, gitignored) with 2 demo events and 25
> attendees on first start.

## What's inside

- **Public website** — homepage, about (chairmen/chaplains), events, gallery.
- **User dashboard** — event registration, payments, hostel allocation, and the
  attendee's **Check-In QR pass** (event ID + their unique ID) under each
  registered event.
- **Registration Unit portal** (`/registrationunit`, login required) —
  - **QR scanning (default)**: tap *Scan QR Code* and the browser opens the
    operator's **phone camera in-page**; each scan checks the attendee in or
    out with an on-screen confirmation.
  - **RFID card scanning**: collapsible *RFID card scan* box — works with a
    USB keyboard-wedge reader or a typed/pasted UID (and, later, the
    Raspberry Pi service in `rfid-reader/`).
  - Attendee list with filters, per-attendee **QR pass view/print**, card
    assignment, bulk check-in, and **Recent Scans** live feed.
  - **Stations** (`/registrationunit/stations`) — each event is a station that
    opens a scan portal pre-locked to that event (`?event=`).
  - **CSV exports** — scan audit trail (RFID + QR) and the event check-in
    report (food billing / attendance).

## QR check-in format

A check-in QR pass encodes the **event ID** and the attendee's **own unique
ID**:

```
DLWYC-CHKIN|<eventId>|<uniqueId>      e.g.  DLWYC-CHKIN|evt-camp|DLW/04/2026/0001
```

Generated and parsed by `src/lib/qr.js`; scanned by the in-page camera
scanner (`src/components/registrationunit/QrScannerModal.jsx`) and resolved by
`POST /api/registrationUnit/qr/scan`.

> Phone browsers only allow camera access over **HTTPS** (or `localhost`).
> For an event, serve the portal over HTTPS and phones work as-is.

## Repository layout

```
src/                  React + TanStack Router + Tailwind frontend
  routes/registrationunit/    Check-in portal, scanner modals, stations
  components/registrationunit/  QR scanner (camera) + QR pass modals
  lib/qr.js             QR payload build/parse
backend/              Express API + JSON-file store (auto-seeded)
rfid-reader/          Raspberry Pi reader service + Arduino USB-keyboard sketch
docs/                 Tester's guide, RFID/QR integration, Windows setup
```

## Configuration

| Variable | Where | Meaning |
|---|---|---|
| `VITE_BACKEND_URL` | frontend (`.env`) | Leave **empty** for local dev (Vite proxies `/api` to `:4000`). Set it to point at a hosted backend. |
| `VITE_BASE_URL` | frontend (`.env`) | Used by a few legacy calls (e.g. forgot-password). |
| `PORT`, `DB_FILE` | backend (env) | Backend port (default 4000) and data file location. |
| `CORS_ORIGINS` | backend (env) | Comma-separated allowed origins; open by default for local use. |

See `.env.example` for the frontend template and `backend/README.md` for all
API endpoints.

> **Production notes:** the Vite dev proxy only exists in development — for a
> production frontend you either set `VITE_BACKEND_URL` or proxy `/api` at the
> web server (a commented example is in `nginx.conf`). Payment provider keys
> are backend secrets — never `VITE_*` variables.

## Development

```bash
npm run build        # vite build + tsc
npm run lint         # eslint
npm run format       # prettier
npm run test         # vitest
```

## Documentation

- `docs/TESTERS_GUIDE.md` — step-by-step testing of the check-in flows
- `docs/rfid-integration.md` — RFID hardware options + QR integration details
- `docs/windows-setup.md` — getting the RFID reader working on a Windows laptop
- `backend/README.md` — API endpoints, seed data, demo logins
