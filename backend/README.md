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
| `GET /api/registrationUnit/rfid/logs` | Recent scan history |

### Other (functional basics for the rest of the app)
- `GET /api/admin/events`
- `POST /api/userLogin`, `POST /api/userRegistration`, `GET /api/userDashboard`, `GET /api/userRegisteredEvents/:id`
- Payment: `verify-code`, `payment-history/:id`, `verify-payment`, `generate-code`, etc.

## Demo login

```
Registration Unit:  admin@dlwyc.org / admin123
```

## Seed data & cards

The DB is seeded with two events and 25 attendees. The first 8 attendees of the
camp event already have **card UIDs** assigned (e.g. `4500D62C8B`,
`B100AF3021`), so you can scan/toggle them immediately. Tap a card UID through
the portal's **Scan Card** box or call `/rfid/scan` to check someone in/out.

## Swapping in a real backend / database

Only the persistence layer (`src/store.js`) and the route handlers touch the
data. To go to production:
- Replace the JSON store with Mongo/Postgres in `store.js` (the API shape stays).
- Move secrets to env vars (`PORT`, `DB_FILE`, `JWT_SECRET`, Paystack keys).
- Add real auth (JWT) and Paystack/Flutterwave verification in `routes/`.
