/**
 * Integration tests for POST /api/registrationUnit/qr/scan.
 *
 * Boots the real router against an isolated JSON store (temp DB_FILE) and
 * exercises the QR check-in contract over HTTP:
 *   - current format  DLWYC-CHKIN|<fullName>|<eventId>  → resolved by name
 *     within the event (case/whitespace-insensitive); a name shared by two
 *     attendees in the event is rejected 409 `ambiguous`
 *   - legacy formats resolve by uniqueId (uniqueId wins over the name)
 *   - every scan log entry records the QR's name as `qrName`
 */
import { describe, it, expect, afterAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Point the store at an isolated temp file BEFORE importing any backend module.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dlwyc-qrscan-'));
process.env.DB_FILE = path.join(tmpDir, 'db.json');

const store = await import('../store.js');
const registrationUnitRoutes = (await import('./registrationUnit.js')).default;
const { default: express } = await import('express');

store.load(); // initialize the store (empty — no seeding in tests)
// The `db` binding is null until load() runs, so grab the object afterwards.
const db = store.db;

// Deterministic fixtures.
db.events = [
  { _id: 'evt-camp', eventTitle: '2025 YOUTH CAMP' },
  { _id: 'evt-harvest', eventTitle: 'YOUTH HARVEST' },
];
db.users = [];
db.admins = [];
db.rfidLogs = [];
const mk = (n, fullName, eventTitle, uniqueId) => ({
  userId: `U-${n}`,
  fullName,
  uniqueId,
  email: `p${n}@example.com`,
  eventDetails: { eventTitle, checkedInStatus: false },
});
db.attendees = [
  mk(1, 'Grace Osei', '2025 YOUTH CAMP', 'DLW/04/2026/0014'),
  mk(2, 'Timilehin Adebayo', '2025 YOUTH CAMP', 'DLW/04/2026/0001'),
  mk(3, 'Test Duplicate', '2025 YOUTH CAMP', 'DLW/13/2026/0003'),
  mk(4, 'Test Duplicate', '2025 YOUTH CAMP', 'DLW/17/2026/0004'),
  mk(5, 'Test Duplicate', 'YOUTH HARVEST', 'DLW/22/2026/0005'),
];

const app = express();
app.use(express.json());
app.use('/api/registrationUnit', registrationUnitRoutes);
const server = app.listen(0, '127.0.0.1');
await new Promise((resolve) => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}/api/registrationUnit`;

const post = (path, body) =>
  fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

afterAll(() => {
  server.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const checkedIn = (userId) =>
  db.attendees.find((a) => a.userId === userId).eventDetails.checkedInStatus;

describe('POST /qr/scan — current format DLWYC-CHKIN|<fullName>|<eventId>', () => {
  it('checks the attendee in and logs the scan with qrName', async () => {
    const res = await post('/qr/scan', {
      payload: 'DLWYC-CHKIN|Grace Osei|evt-camp',
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.action).toBe('checkedIn');
    expect(body.data.fullName).toBe('Grace Osei');
    expect(checkedIn('U-1')).toBe(true);

    const log = db.rfidLogs[0];
    expect(log.method).toBe('qr');
    expect(log.qrName).toBe('Grace Osei');
    expect(log.action).toBe('checkedIn');
    expect(log.fullName).toBe('Grace Osei');
  });

  it('toggles back to checked out on the next scan', async () => {
    const res = await post('/qr/scan', {
      payload: 'DLWYC-CHKIN|Grace Osei|evt-camp',
    });
    expect(res.status).toBe(200);
    expect((await res.json()).action).toBe('checkedOut');
    expect(checkedIn('U-1')).toBe(false);
  });

  it('matches case- and whitespace-insensitively', async () => {
    const res = await post('/qr/scan', {
      payload: 'DLWYC-CHKIN|  timilehin   ADEBAYO |evt-camp',
    });
    expect(res.status).toBe(200);
    expect((await res.json()).action).toBe('checkedIn');
    expect(checkedIn('U-2')).toBe(true);
  });

  it('scopes resolution to the QR event (same name in another event is not matched)', async () => {
    const res = await post('/qr/scan', {
      payload: 'DLWYC-CHKIN|Test Duplicate|evt-harvest',
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.uniqueId).toBe('DLW/22/2026/0005');
    expect(checkedIn('U-5')).toBe(true);
  });
});

describe('POST /qr/scan — ambiguous names are rejected (HTTP 409), never guessed', () => {
  it('rejects a name shared by two attendees in the same event', async () => {
    const before = db.attendees.map((a) => a.eventDetails.checkedInStatus);
    const res = await post('/qr/scan', {
      payload: 'DLWYC-CHKIN|Test Duplicate|evt-camp',
    });
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe('ambiguous');
    expect(body.action).toBe('ambiguous');
    expect(body.message).toContain('Test Duplicate');
    expect(body.matches.map((m) => m.uniqueId).sort()).toEqual([
      'DLW/13/2026/0003',
      'DLW/17/2026/0004',
    ]);
    // Nobody was checked in/out by the rejected scan.
    expect(db.attendees.map((a) => a.eventDetails.checkedInStatus)).toEqual(
      before,
    );

    const log = db.rfidLogs[0];
    expect(log.action).toBe('ambiguous');
    expect(log.method).toBe('qr');
    expect(log.qrName).toBe('Test Duplicate');
  });
});

describe('POST /qr/scan — backwards compatibility (uniqueId wins)', () => {
  it('legacy DLWYC-CHKIN|<eventId>|<uniqueId> resolves by uniqueId', async () => {
    const res = await post('/qr/scan', {
      payload: 'DLWYC-CHKIN|evt-camp|DLW/04/2026/0014',
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.userId).toBe('U-1');
    expect(db.rfidLogs[0].qrName).toBe(''); // no name in a legacy 3-part QR
  });

  it('legacy DLWYC-CHKIN|<fullName>|<eventId>|<uniqueId> resolves by uniqueId + records qrName', async () => {
    const res = await post('/qr/scan', {
      payload: 'DLWYC-CHKIN|Grace Osei|evt-camp|DLW/04/2026/0014',
    });
    expect(res.status).toBe(200);
    expect((await res.json()).data.userId).toBe('U-1');
    expect(db.rfidLogs[0].qrName).toBe('Grace Osei');
  });

  it('an ambiguous name with a valid uniqueId still resolves (uniqueId wins over name)', async () => {
    const res = await post('/qr/scan', {
      payload: 'DLWYC-CHKIN|Test Duplicate|evt-camp|DLW/17/2026/0004',
    });
    expect(res.status).toBe(200);
    expect((await res.json()).data.uniqueId).toBe('DLW/17/2026/0004');
    expect(checkedIn('U-4')).toBe(true);
    expect(checkedIn('U-3')).toBe(false); // the other duplicate untouched
  });

  it('legacy DLWYC-CHKIN|<uniqueId> resolves without an event', async () => {
    const res = await post('/qr/scan', {
      payload: 'DLWYC-CHKIN|DLW/04/2026/0001',
    });
    expect(res.status).toBe(200);
    expect((await res.json()).data.userId).toBe('U-2');
  });

  it('the legacy JSON form {"eventId","uniqueId"} still works', async () => {
    const res = await post('/qr/scan', {
      payload: '{"eventId":"evt-camp","uniqueId":"DLW/04/2026/0001"}',
    });
    expect(res.status).toBe(200);
    expect((await res.json()).data.userId).toBe('U-2');
  });

  it('a structured body { eventId, uniqueId } still works', async () => {
    const res = await post('/qr/scan', {
      eventId: 'evt-camp',
      uniqueId: 'DLW/04/2026/0001',
    });
    expect(res.status).toBe(200);
    expect((await res.json()).data.userId).toBe('U-2');
  });
});

describe('POST /qr/scan — rejections + guards', () => {
  it('404 for a name that is not registered in the QR event', async () => {
    const res = await post('/qr/scan', {
      payload: 'DLWYC-CHKIN|Nobody Here|evt-camp',
    });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.action).toBe('unknown');
    expect(body.message).toContain('Nobody Here');
    expect(db.rfidLogs[0].action).toBe('unknown');
    expect(db.rfidLogs[0].qrName).toBe('Nobody Here');
  });

  it('404 when the QR event does not exist', async () => {
    const res = await post('/qr/scan', {
      payload: 'DLWYC-CHKIN|Grace Osei|evt-nope',
    });
    expect(res.status).toBe(404);
    expect((await res.json()).action).toBe('unknown');
  });

  it('400 for a payload with no name or uniqueId', async () => {
    const res = await post('/qr/scan', { payload: 'random junk' });
    expect(res.status).toBe(400);
  });

  it('the station event guard still applies to name payloads (409 wrongEvent)', async () => {
    const res = await post('/qr/scan', {
      payload: 'DLWYC-CHKIN|Grace Osei|evt-camp',
      eventTitle: 'YOUTH HARVEST',
    });
    expect(res.status).toBe(409);
    expect((await res.json()).action).toBe('wrongEvent');
    expect(db.rfidLogs[0].qrName).toBe('Grace Osei');
  });
});
