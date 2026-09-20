/**
 * Tiny JSON-file data store.
 *
 * Persists the whole DB to a JSON file on every mutation so the demo survives
 * restarts. In production this would be a real database (MongoDB/Postgres) —
 * only the persistence mechanism changes, not the API shape.
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
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } else {
    db = { events: [], attendees: [], users: [], admins: [], rfidLogs: [] };
  }
  return db;
}

export function save() {
  if (!db) return;
  ensureDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
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
