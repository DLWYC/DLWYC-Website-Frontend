/**
 * DLWYC RFID Reader Service (Raspberry Pi + RFID-RC522)
 * -------------------------------------------------------
 * Reads an RFID tag's UID from the RC522 (via SPI) and:
 *   - MODE  "toggle": POSTs the UID to your backend so it can look the
 *     attendee up by `cardUID` and toggle their check-in/check-out.
 *   - MODE  "console": just prints the UID so a desk operator can type or
 *     paste it into the web portal's "Scan Card" box (Path B integration).
 *
 * Wiring (RC522 -> Pi) — use SPI pins:
 *   SDA  -> Pin 24 (GPIO8,  CE0)
 *   SCK  -> Pin 23 (GPIO11)
 *   MOSI -> Pin 19 (GPIO10)
 *   MISO -> Pin 21 (GPIO9)
 *   RST  -> Pin 22 (GPIO25)
 *   IRQ  -> unconnected
 *   VCC  -> 3.3V
 *   GND  -> GND
 *
 * Prereqs on the Pi:
 *   sudo apt install -y python3-spidev libusb-1.0-0   # SPI + USB deps
 *   sudo raspi-config  -> Interface Options -> SPI -> enable  (then reboot)
 *   npm install        (in this folder)
 *
 * Environment (see .env.example):
 *   SCAN_MODE=toggle | console
 *   BACKEND_URL=https://your-api.example.com
 *   EVENT_TITLE=2025 YOUTH CAMP
 *   SCAN_COOLDOWN_MS=1200
 */

import 'dotenv/config';
import { Mfrc522 } from 'mfrc522-rpi';
import { RpiSoftSPI } from 'rpi-softspi';
import axios from 'axios';

const SCAN_MODE = process.env.SCAN_MODE || 'toggle';
const BACKEND_URL = (process.env.BACKEND_URL || '').replace(/\/+$/, '');
const EVENT_TITLE = process.env.EVENT_TITLE || '';
const SCAN_COOLDOWN_MS = parseInt(process.env.SCAN_COOLDOWN_MS || '1200', 10);
const LOOKUP_ENDPOINT =
  process.env.LOOKUP_ENDPOINT || '/api/registrationUnit/rfid/scan';

// Map RC522 sector/block to the library's constructor.
const softSPI = new RpiSoftSPI({
  clock: 23, // SCK
  mosi: 19, // MOSI
  miso: 21, // MISO
  cs: 24, // SDA
});

const mfrc522 = new Mfrc522(softSPI).setResetPin(22); // RST

/** Normalize a raw tag string to an uppercase, colon-free UID. */
function normalizeUid(raw) {
  return (raw || '').toUpperCase().replace(/[^0-9A-F]/g, '');
}

/** Debounce so holding a tag near the reader only triggers once. */
let lastScanAt = 0;
function canScan() {
  const now = Date.now();
  if (now - lastScanAt < SCAN_COOLDOWN_MS) return false;
  lastScanAt = now;
  return true;
}

async function sendToBackend(uid) {
  if (!BACKEND_URL) {
    console.warn(`[toggle] No BACKEND_URL set — printing UID instead: ${uid}`);
    printConsole(uid);
    return;
  }
  try {
    const { data } = await axios.post(`${BACKEND_URL}${LOOKUP_ENDPOINT}`, {
      cardUID: uid,
      eventTitle: EVENT_TITLE,
    });
    const action = data?.action || data?.message || JSON.stringify(data);
    console.log(`✔ [toggle] UID ${uid} -> ${action}`);
  } catch (err) {
    const status = err?.response?.status;
    const detail = err?.response?.data;
    if (status === 404) {
      console.log(`✘ [toggle] UID ${uid} — no attendee found for this card.`);
    } else {
      console.error(`✘ [toggle] Backend error (${status}):`, detail || err.message);
    }
  }
}

function printConsole(uid) {
  console.log(`SCANNED ${uid}`); // watch with: npm run scan
}

// Keep reading forever.
setInterval(() => {
  if (!mfrc522.scan()) return; // no tag present
  const serial = mfrc522.getSerialNumber();
  if (!serial || serial.length === 0) return;
  const uid = normalizeUid(
    serial.map((b) => b.toString(16).padStart(2, '0')).join('')
  );
  if (!uid || !canScan()) return;

  console.log(`[reader] Tag detected — UID ${uid}`);

  if (SCAN_MODE === 'toggle') {
    sendToBackend(uid);
  } else {
    printConsole(uid);
  }
}, 300);

console.log(`RFID reader started  (mode=${SCAN_MODE}, backend=${BACKEND_URL || 'none'})`);
console.log('Place a tag on the reader...');
