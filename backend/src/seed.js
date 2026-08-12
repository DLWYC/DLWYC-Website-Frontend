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
  { _id: 'evt-camp', eventTitle: '2025 YOUTH CAMP', date: '2026-03-25', location: 'DLW Camp Ground' },
  { _id: 'evt-harvest', eventTitle: 'YOUTH HARVEST', date: '2026-06-14', location: 'Cathedral Hall' },
];

const ARCH_CODES = ['04', '13', '17', '22', '24', '30'];

// Realistic RC522 tag UIDs (10 hex chars, as read from common 125kHz tags).
const SAMPLE_TAG_UIDS = [
  '4500D62C8B', 'B100AF3021', 'F12A9C4478', '33AA1D90BC', '8901E45F22',
  'AABBCCDD01', '1A2B3C4D5E', '6F78A9B0C1',
];

export function seedIfEmpty() {
  const current = load();
  if (current.events.length > 0 && current.attendees.length > 0) {
    return { seeded: false };
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

  db.events = events;
  db.attendees = attendees;
  db.admins = admins;
  db.rfidLogs = [];
  save();
  return { seeded: true, events: events.length, attendees: attendees.length };
}
