import { describe, it, expect } from 'vitest';
import {
  normalizeName,
  parseCheckinPayload,
  resolveQrScan,
} from './qrCheckin.js';

/** Minimal in-memory store mirroring the shapes in store.js / seed.js. */
function makeDb() {
  const attendee = (n, fullName, eventTitle, uniqueId) => ({
    userId: `U-${n}`,
    fullName,
    uniqueId,
    email: `p${n}@example.com`,
    eventDetails: { eventTitle, checkedInStatus: false },
  });
  return {
    events: [
      { _id: 'evt-camp', eventTitle: '2025 YOUTH CAMP' },
      { _id: 'evt-harvest', eventTitle: 'YOUTH HARVEST' },
    ],
    attendees: [
      attendee(1, 'Grace Osei', '2025 YOUTH CAMP', 'DLW/04/2026/0014'),
      attendee(2, 'Timilehin Adebayo', '2025 YOUTH CAMP', 'DLW/04/2026/0001'),
      // Two attendees with the SAME name in the SAME event — must never be
      // guessed between.
      attendee(3, 'Test Duplicate', '2025 YOUTH CAMP', 'DLW/13/2026/0003'),
      attendee(4, 'Test Duplicate', '2025 YOUTH CAMP', 'DLW/17/2026/0004'),
      // Same name, but a different event — name resolution is scoped per event.
      attendee(5, 'Test Duplicate', 'YOUTH HARVEST', 'DLW/22/2026/0005'),
    ],
  };
}

describe('normalizeName', () => {
  it('is case- and whitespace-insensitive', () => {
    expect(normalizeName('  GRACE    Osei ')).toBe('grace osei');
    expect(normalizeName('grace osei')).toBe('grace osei');
    expect(normalizeName('Grace\tOsei')).toBe('grace osei');
  });
});

describe('parseCheckinPayload', () => {
  it('parses the current format as a pipe3 payload the resolver disambiguates', () => {
    // A 3-part payload is textually identical to the legacy `eventId|uniqueId`
    // shape, so parse alone cannot decide — the resolver does (name format
    // when the third field is not a known uniqueId).
    expect(
      parseCheckinPayload('DLWYC-CHKIN|Grace Osei|evt-camp'),
    ).toMatchObject({
      format: 'pipe3',
      a: 'Grace Osei',
      b: 'evt-camp',
    });
  });

  it('parses legacy DLWYC-CHKIN|<fullName>|<eventId>|<uniqueId> as uniqueId', () => {
    expect(
      parseCheckinPayload('DLWYC-CHKIN|Grace Osei|evt-camp|DLW/04/2026/0014'),
    ).toEqual({
      format: 'uniqueId',
      uniqueId: 'DLW/04/2026/0014',
      eventId: 'evt-camp',
      fullName: 'Grace Osei',
    });
  });

  it('parses legacy DLWYC-CHKIN|<uniqueId>', () => {
    expect(parseCheckinPayload('DLWYC-CHKIN|dlw/04/2026/0014')).toEqual({
      format: 'uniqueId',
      uniqueId: 'DLW/04/2026/0014',
      eventId: '',
      fullName: '',
    });
  });

  it('flags 3-part payloads as pipe3 for data-driven disambiguation', () => {
    // Same shape for legacy `eventId|uniqueId` and current `fullName|eventId`.
    expect(
      parseCheckinPayload('DLWYC-CHKIN|evt-camp|DLW/04/2026/0014'),
    ).toEqual({
      format: 'pipe3',
      a: 'evt-camp',
      b: 'DLW/04/2026/0014',
    });
  });

  it('parses JSON in both shapes', () => {
    expect(
      parseCheckinPayload('{"fullName":"Grace Osei","eventId":"evt-camp"}'),
    ).toMatchObject({
      format: 'name',
    });
    expect(
      parseCheckinPayload(
        '{"eventId":"evt-camp","uniqueId":"DLW/04/2026/0014"}',
      ),
    ).toMatchObject({ format: 'uniqueId' });
  });

  it('rejects non-DLWYC / malformed payloads', () => {
    expect(parseCheckinPayload('random text')).toBeNull();
    expect(parseCheckinPayload('DLWYC-CHKIN')).toBeNull();
    expect(parseCheckinPayload('DLWYC-CHKIN|')).toBeNull();
    expect(parseCheckinPayload('DLWYC-CHKIN|name|')).toBeNull();
    expect(parseCheckinPayload('DLWYC-CHKIN||')).toBeNull();
    expect(parseCheckinPayload('DLWYC-CHKIN|name|evt|')).toBeNull();
    expect(parseCheckinPayload('{bad json')).toBeNull();
  });

  it('accepts the lenient 2-part uniqueId form', () => {
    expect(parseCheckinPayload('DLWYC-CHKIN|DLW/04/2026/0014')).toMatchObject({
      format: 'uniqueId',
    });
  });
});

describe('resolveQrScan — current format (name within event)', () => {
  it('resolves the attendee by name within the QR event', () => {
    const db = makeDb();
    const r = resolveQrScan(db, { payload: 'DLWYC-CHKIN|Grace Osei|evt-camp' });
    expect(r.status).toBe('resolved');
    expect(r.attendee.uniqueId).toBe('DLW/04/2026/0014');
    expect(r.qrName).toBe('Grace Osei');
    expect(r.eventId).toBe('evt-camp');
  });

  it('matches case- and whitespace-insensitively', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      payload: 'DLWYC-CHKIN|  grace   OSEI |evt-camp',
    });
    expect(r.status).toBe('resolved');
    expect(r.attendee.userId).toBe('U-1');
  });

  it('scopes name resolution to the QR event (same name in another event is not matched)', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      payload: 'DLWYC-CHKIN|Test Duplicate|evt-harvest',
    });
    expect(r.status).toBe('resolved');
    expect(r.attendee.uniqueId).toBe('DLW/22/2026/0005');
  });

  it('rejects a name shared by two attendees in the same event as ambiguous', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      payload: 'DLWYC-CHKIN|Test Duplicate|evt-camp',
    });
    expect(r.status).toBe('ambiguous');
    expect(r.matches).toHaveLength(2);
    expect(r.qrName).toBe('Test Duplicate');
    expect(r.eventTitle).toBe('2025 YOUTH CAMP');
  });

  it('never mutates check-in state (the route decides what to do)', () => {
    const db = makeDb();
    resolveQrScan(db, { payload: 'DLWYC-CHKIN|Test Duplicate|evt-camp' });
    expect(
      db.attendees.every((a) => a.eventDetails.checkedInStatus === false),
    ).toBe(true);
  });

  it('returns notFound for an unknown name', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      payload: 'DLWYC-CHKIN|Nobody Here|evt-camp',
    });
    expect(r.status).toBe('notFound');
    expect(r.message).toContain('Nobody Here');
  });

  it('returns notFound when the QR event does not exist', () => {
    const db = makeDb();
    const r = resolveQrScan(db, { payload: 'DLWYC-CHKIN|Grace Osei|evt-nope' });
    expect(r.status).toBe('notFound');
    expect(r.message).toContain('No event');
  });

  it('resolves by event title as well as event id', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      payload: 'DLWYC-CHKIN|Grace Osei|2025 YOUTH CAMP',
    });
    expect(r.status).toBe('resolved');
  });
});

describe('resolveQrScan — backwards compatibility (uniqueId wins)', () => {
  it('legacy DLWYC-CHKIN|<eventId>|<uniqueId> resolves by uniqueId', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      payload: 'DLWYC-CHKIN|evt-camp|dlw/04/2026/0014',
    });
    expect(r.status).toBe('resolved');
    expect(r.attendee.userId).toBe('U-1');
    expect(r.qrName).toBe(''); // no name in a legacy 3-part QR
  });

  it('legacy DLWYC-CHKIN|<fullName>|<eventId>|<uniqueId> resolves by uniqueId', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      payload: 'DLWYC-CHKIN|Grace Osei|evt-camp|DLW/04/2026/0014',
    });
    expect(r.status).toBe('resolved');
    expect(r.attendee.userId).toBe('U-1');
    expect(r.qrName).toBe('Grace Osei');
  });

  it('legacy DLWYC-CHKIN|<uniqueId> resolves without an event', () => {
    const db = makeDb();
    const r = resolveQrScan(db, { payload: 'DLWYC-CHKIN|DLW/04/2026/0001' });
    expect(r.status).toBe('resolved');
    expect(r.attendee.userId).toBe('U-2');
  });

  it('uniqueId wins over the name: an ambiguous name + valid uniqueId still resolves', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      payload: 'DLWYC-CHKIN|Test Duplicate|evt-camp|DLW/17/2026/0004',
    });
    expect(r.status).toBe('resolved');
    expect(r.attendee.uniqueId).toBe('DLW/17/2026/0004');
  });

  it('uniqueId wins in a structured body too (eventId + uniqueId)', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      eventId: 'evt-camp',
      uniqueId: 'DLW/04/2026/0001',
    });
    expect(r.status).toBe('resolved');
    expect(r.attendee.userId).toBe('U-2');
  });

  it('a 3-part payload whose 3rd field is a known uniqueId is treated as legacy', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      payload: 'DLWYC-CHKIN|evt-camp|DLW/04/2026/0014',
    });
    expect(r.status).toBe('resolved');
    expect(r.attendee.userId).toBe('U-1');
  });

  it('the legacy JSON form {"eventId","uniqueId"} still works', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      payload: '{"eventId":"evt-camp","uniqueId":"DLW/04/2026/0001"}',
    });
    expect(r.status).toBe('resolved');
    expect(r.attendee.userId).toBe('U-2');
  });

  it('a structured body with uniqueId + a different name resolves by the uniqueId', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      eventId: 'evt-camp',
      fullName: 'Test Duplicate',
      uniqueId: 'DLW/04/2026/0014',
    });
    expect(r.status).toBe('resolved');
    expect(r.attendee.userId).toBe('U-1');
  });

  it('legacy uniqueId that matches nobody is notFound (even with a name present)', () => {
    const db = makeDb();
    const r = resolveQrScan(db, {
      payload: 'DLWYC-CHKIN|Grace Osei|evt-camp|DLW/99/2026/9999',
    });
    expect(r.status).toBe('notFound');
  });
});

describe('resolveQrScan — invalid input', () => {
  it('marks non-DLWYC payloads invalid', () => {
    expect(
      resolveQrScan(makeDb(), { payload: 'not a check-in code' }).status,
    ).toBe('invalid');
    expect(resolveQrScan(makeDb(), { payload: '' }).status).toBe('invalid');
    expect(resolveQrScan(makeDb(), {}).status).toBe('invalid');
  });
});
