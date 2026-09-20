/**
 * Seeds the JSON DB with realistic demo data so the Registration Unit + RFID
 * flow works out of the box. Idempotent — only seeds when the store is empty.
 */
import { load, save, db } from './store.js';

let seq = 0;
const uid = (p) => {
  seq += 1;
  const t = Date.now().toString(36).toUpperCase().slice(-6);
  const s = seq.toString(36).toUpperCase().padStart(4, '0');
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${p}${t}${s}${r}`;
};

function makeAttendee({ fullName, email, archCode, n, eventTitle, cardUID }) {
  const userId = uid('U');
  return {
    userId,
    fullName,
    email,
    phone: `+234801234${String(5000 + n).slice(0, 4)}`,
    gender: n % 2 === 0 ? 'male' : 'female',
    uniqueId: `DLW/${archCode}/${new Date().getFullYear()}/${String(n).padStart(4, '0')}`,
    cardUID: cardUID || '',
    rfidTag: cardUID || '',
    createdAt: new Date().toISOString(),
    eventDetails: {
      eventTitle,
      checkedInStatus: false,
      paymentStatus: n % 3 === 0 ? 'pending' : 'success',
      paymentTime: n % 3 === 0 ? null : new Date().toISOString(),
    },
  };
}

const SEED_EVENTS = [
  {
    _id: 'evt-camp',
    eventTitle: '2025 YOUTH CAMP',
    date: '2026-03-25',
    // eventDate/eventTime in ISO form — the user dashboard calendar + event
    // cards read these fields.
    eventDate: '2026-03-25T08:00:00.000Z',
    eventTime: '08:00',
    location: 'DLW Camp Ground',
  },
  {
    _id: 'evt-harvest',
    eventTitle: 'YOUTH HARVEST',
    date: '2026-06-14',
    eventDate: '2026-06-14T09:00:00.000Z',
    eventTime: '09:00',
    location: 'Cathedral Hall',
  },
];

const ARCH_CODES = ['04', '13', '17', '22', '24', '30'];

// Realistic RC522 tag UIDs (10 hex chars, as read from common 125kHz tags).
const SAMPLE_TAG_UIDS = [
  '4500D62C8B', 'B100AF3021', 'F12A9C4478', '33AA1D90BC', '8901E45F22',
  'AABBCCDD01', '1A2B3C4D5E', '6F78A9B0C1',
];

/** Demo user accounts (first two attendees) so the user dashboard can be
 *  tested: log in with attendee1@example.com / attendee123 and you'll see
 *  your own check-in QR pass. */
function makeDemoUsers(attendees) {
  return [0, 1]
    .filter((i) => attendees[i])
    .map((i) => ({
      userId: attendees[i].userId,
      fullName: attendees[i].fullName,
      email: attendees[i].email,
      password: 'attendee123',
      phone: attendees[i].phone,
      gender: attendees[i].gender,
      uniqueId: attendees[i].uniqueId,
      archdeaconry: (attendees[i].uniqueId || '').split('/')[1] || '04',
    }));
}

/**
 * Light migration for databases seeded before the QR feature existed:
 * adds eventDate/eventTime to events and creates the demo user accounts.
 */
function migrate(current) {
  let changed = false;
  for (const e of current.events) {
    if (!e.eventDate && e.date) {
      e.eventDate = `${e.date}T08:00:00.000Z`;
      e.eventTime = e.eventTime || '08:00';
      changed = true;
    }
  }
  if (!Array.isArray(current.users)) current.users = [];
  if (current.users.length === 0 && current.attendees.length > 0) {
    current.users.push(...makeDemoUsers(current.attendees));
    changed = true;
  }
  if (changed) save();
  return changed;
}

export function seedIfEmpty() {
  const current = load();
  if (current.events.length > 0 && current.attendees.length > 0) {
    const migrated = migrate(current);
    return { seeded: false, migrated };
  }

  const events = SEED_EVENTS.map((e) => ({ ...e }));
  const attendees = [];

  let n = 1;
  // 20 attendees for the camp event (some with assigned cards).
  for (let i = 0; i < 20; i++) {
    const arch = ARCH_CODES[i % ARCH_CODES.length];
    const cardUID = i < SAMPLE_TAG_UIDS.length ? SAMPLE_TAG_UIDS[i] : '';
    attendees.push(
      makeAttendee({
        fullName: ['Timilehin Adebayo', 'Adaeze Okafor', 'Emeka Nwosu', 'Chidinma Eze',
          'Oluwaseun Lawal', 'Fatima Bello', 'Ibrahim Musa', 'Aisha Usman',
          'Tunde Bakare', 'Ngozi Onyeka', 'Kwame Mensah', 'Blessing Adeyemi',
          'Samuel Johnson', 'Grace Osei', 'David Okon', 'Esther Nnenna',
          'Peter Ogunleye', 'Joy Aniekwe', 'Michael Adebisi', 'Ruth Chukwu'][i],
        email: `attendee${i + 1}@example.com`,
        archCode: arch,
        n,
        eventTitle: '2025 YOUTH CAMP',
        cardUID,
      })
    );
    n++;
  }
  // A few attendees for the harvest event (no cards yet).
  for (let i = 0; i < 5; i++) {
    attendees.push(
      makeAttendee({
        fullName: ['Halima Sadiq', 'Chinedu Ibe', 'Yemi Adewale', 'Linda Okafor', 'Tobi Ajayi'][i],
        email: `harvest${i + 1}@example.com`,
        archCode: ARCH_CODES[i % ARCH_CODES.length],
        n,
        eventTitle: 'YOUTH HARVEST',
        cardUID: '',
      })
    );
    n++;
  }

  const admins = [
    {
      _id: uid('A'),
      email: 'admin@dlwyc.org',
      password: 'admin123',
      name: 'Registration Unit Admin',
      role: 'registrationunit',
    },
  ];

  const users = makeDemoUsers(attendees);

  db.events = events;
  db.attendees = attendees;
  db.admins = admins;
  db.users = users;
  db.rfidLogs = [];
  save();
  return { seeded: true, events: events.length, attendees: attendees.length, users: users.length };
}
