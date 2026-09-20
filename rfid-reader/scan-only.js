/**
 * Console-only scan mode (no network).
 * Prints the UID of whatever tag is placed on the RC522 so you can test
 * the wiring and then type/paste the UID into the web portal.
 * Run: npm run scan
 */

import { Mfrc522 } from 'mfrc522-rpi';
import { RpiSoftSPI } from 'rpi-softspi';

const softSPI = new RpiSoftSPI({ clock: 23, mosi: 19, miso: 21, cs: 24 });
const mfrc522 = new Mfrc522(softSPI).setResetPin(22);

console.log('Console scan mode — place a tag on the reader (Ctrl+C to quit).');

let lastUid = '';
setInterval(() => {
  if (!mfrc522.scan()) return;
  const serial = mfrc522.getSerialNumber();
  if (!serial || serial.length === 0) return;
  const uid = serial
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join('');
  if (uid && uid !== lastUid) {
    lastUid = uid;
    console.log(`SCANNED ${uid}`);
  }
}, 300);
