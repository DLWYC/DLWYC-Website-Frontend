# DLWYC Backend (local)

A self-contained Express backend that serves the **Registration Unit + RFID
check-in/check-out** flow (plus minimal user/admin/payment routes) so the whole
app runs locally with one command. Data persists to a JSON file
(`backend/data/db.json`, auto-seeded on first run, gitignored).

## Run it

```bash
# From the repo root — runs backend + frontend together:
npm run dev:full

# Or individually:
npm run dev:api    # backend only, http://localhost:4000
npm run dev        # frontend only, http://localhost:3000 (proxies /api to :4000)
```

The frontend calls `/api/*` same-origin and the Vite dev server proxies it to
the backend, so **no VITE_BACKEND_URL is needed** for local development.

## Endpoints

### Registration Unit + RFID
| Method & path | Purpose |
|---|---|
| `POST /api/registrationUnit/auth` | Login (`{ email, password }`) → `{ token }` |
| `GET /api/registrationUnit/allEvents` | `{ events: [...] }` |
| `GET /api/registrationUnit/eventAttendees/:eventTitle` | Attendees **including `cardUID`** |
| `PATCH /api/registrationUnit/eventAttendees/:userId/checkIn` | Check in (`{ eventTitle }`) |
| `PATCH /api/registrationUnit/eventAttendees/:userId/undoCheckIn` | Undo check-in |
| `PATCH /api/registrationUnit/eventAttendees/:userId/rfid` | Assign a card `{ cardUID }` (rejects already-bound cards) |
| `POST /api/registrationUnit/rfid/scan` | RFID toggle `{ cardUID, eventTitle }` → `{ action }` (used by the Raspberry Pi reader service) |
| `POST /api/registrationUnit/qr/scan` | QR toggle `{ payload }` (raw QR text) or `{ eventId, uniqueId }`; optional `{ eventTitle }` station guard → `{ action }`, logs with `method: 'qr'` |
| `GET /api/registrationUnit/rfid/logs` | Recent scan history (RFID + QR) |

> QR pass format (see `src/lib/qr.js`): `DLWYC-CHKIN|<fullName>|<eventId>` —
> resolved by full name **within that event** (case- and
> whitespace-insensitive). A name shared by two attendees in the same event is
> rejected as `ambiguous` (409) — never guessed. Legacy payloads
> `DLWYC-CHKIN|<eventId>|<uniqueId>`,
> `DLWYC-CHKIN|<fullName>|<eventId>|<uniqueId>` and `DLWYC-CHKIN|<uniqueId>`
> still resolve by uniqueId (a uniqueId in the payload wins over the name).
> `action` is one of `checkedIn`, `checkedOut`, `wrongEvent` (409),
> `ambiguous` (409) or `unknown` (404). Scan log entries record the name
> encoded in the QR as `qrName` (empty for uniqueId-only payloads).

### Other (functional basics for the rest of the app)
- `GET /api/admin/events`
- `POST /api/userLogin`, `POST /api/userRegistration`, `GET /api/userDashboard`
- `GET /api/userRegisteredEvents/:email/:uniqueId` (the dashboard's two-segment form) and `GET /api/userRegisteredEvents/:id` — returns the attendee enriched with `eventId` / `paymentStatus` / `registrationDate`
- Payment: `verify-code`, `payment-history/:id`, `verify-payment`, `generate-code`, etc.

## Demo logins

```
Registration Unit:  admin@dlwyc.org / admin123
User (attendee):    attendee1@example.com / attendee123
                    attendee2@example.com / attendee123
```

The user logins let you open the user dashboard and see a real check-in QR
pass.

## Seed data & cards

The DB is seeded with two events and 25 attendees. The first 8 attendees of the
camp event already have **card UIDs** assigned (e.g. `4500D62C8B`,
`B100AF3021`), so you can scan/toggle them immediately. Tap a card UID through
the portal's **RFID card scan** box or call `/rfid/scan` to check someone
in/out.

> **Existing databases:** if `db.json` was seeded before the QR feature, the
> app auto-migrates it on startup (adds `eventDate`/`eventTime` to events and
> creates the demo user accounts) — no manual steps needed.

## Swapping in a real backend / database

Only the persistence layer (`src/store.js`) and the route handlers touch the
data. To go to production:
- Replace the JSON store with Mongo/Postgres in `store.js` (the API shape stays).
- Move secrets to env vars (`PORT`, `DB_FILE`, `JWT_SECRET`, Paystack keys).
- Add real auth (JWT) and Paystack/Flutterwave verification in `routes/`.
