/**
 * Tiny JSON-file data store.
 *
 * Persists the whole DB to a JSON file on every mutation so the demo survives
 * restarts. In production this would be a real database (MongoDB/Postgres) —
 * only the persistence mechanism changes, not the API shape.
 *
 * Hardened for 24/7 operation:
 *   - save() writes atomically (temp file + rename), so a power cut can never
 *     leave a half-written/corrupt db.json behind.
 *   - load() recovers from a corrupt db.json by moving it aside (kept as
 *     db.json.corrupt-<timestamp> for manual recovery) and starting fresh
 *     instead of crashing the server on boot.
 *   - load() repairs missing/invalid core collections on boot.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE =
  process.env.DB_FILE || path.join(__dirname, '..', 'data', 'db.json');

let db = null;

function ensureDir() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}

export function load() {
  if (db) return db;
  ensureDir();
  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (!db || typeof db !== 'object') throw new Error('db.json is not an object');
      // Make sure the core collections always exist, whatever the file contains.
      for (const key of ['events', 'attendees', 'users', 'admins', 'rfidLogs']) {
        if (!Array.isArray(db[key])) db[key] = [];
      }
    } catch {
      // Corrupt db.json (e.g. power loss mid-write): MOVE it aside (atomic —
      // both backs it up for manual recovery and clears the live path), then
      // start from a clean slate.
      const quarantine = `${DB_FILE}.corrupt-${Date.now()}`;
      try {
        fs.renameSync(DB_FILE, quarantine);
        console.error(`[store] db.json was corrupt — moved to: ${quarantine}`);
      } catch {
        console.error('[store] db.json was corrupt and could not be quarantined');
      }
      db = { events: [], attendees: [], users: [], admins: [], rfidLogs: [] };
    }
  } else {
    db = { events: [], attendees: [], users: [], admins: [], rfidLogs: [] };
  }
  return db;
}

export function save() {
  if (!db) return;
  ensureDir();
  // Atomic write: temp file + rename over the real file. renameSync is atomic
  // on Windows and POSIX, so db.json is always a complete state — never half
  // of each.
  const tmp = `${DB_FILE}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

/** Normalize an RFID UID to uppercase hex, no colons/spaces. */
export function normalizeUid(raw) {
  return (raw || '').toUpperCase().replace(/[^0-9A-F]/g, '');
}

/** Write an entry to the rfid scan log. */
export function logRfidScan(entry) {
  db.rfidLogs.unshift({ ...entry, at: new Date().toISOString() });
  if (db.rfidLogs.length > 500) db.rfidLogs.length = 500;
}

export { db, DB_FILE };
