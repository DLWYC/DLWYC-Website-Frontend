/**
 * RC522 as a USB Keyboard (for Windows laptops)
 * ==============================================
 * Turns an RFID-RC522 + Arduino (Leonardo / Micro / Pro Micro / any
 * ATmega32U4 board) into a plug-and-play "keyboard-wedge" reader.
 *
 * When a card is tapped, the Arduino reads its UID and "types" it into the
 * computer followed by Enter. The DLWYC Registration Unit portal already has
 * an auto-focused "Scan Card" box that submits on Enter — so the flow is:
 *
 *     tap card  ->  UID typed automatically  ->  attendee checked in/out
 *
 * No typing, no extra software on the Windows laptop. Just open the portal,
 * click into the page, and tap cards all day.
 *
 * ------------------------------------------------------------
 * Boards that work (must be ATmega32U4 to act as a USB keyboard):
 *   - Arduino Leonardo
 *   - Arduino Micro
 *   - Arduino Pro Micro
 *   - SparkFun Pro Micro
 * (A plain Arduino Uno / Nano cannot emulate a keyboard over USB.)
 * ------------------------------------------------------------
 *
 * Wiring (RC522 -> Arduino):
 *   SDA  -> 10   (SS)
 *   SCK  -> 13   (ICSP SCK)
 *   MOSI -> 11
 *   MISO -> 12
 *   RST  -> 9
 *   IRQ  -> (unconnected)
 *   VCC  -> 3.3V
 *   GND  -> GND
 *
 * Required library (Arduino Library Manager):
 *   "MFRC522" by GithubCommunity (Miguel Balboa)
 *
 * Usage:
 *   1. Install the MFRC522 library.
 *   2. Select the correct board + COM port, upload this sketch.
 *   3. Plug into any Windows laptop. Tap cards in the web portal.
 *
 * The printed UID is uppercase hex with no colons, e.g. 1234ABCD — matching
 * how the frontend normalizes card UIDs.
 */

#include <SPI.h>
#include <MFRC522.h>
#include <Keyboard.h>

#define RST_PIN 9   // RC522 RST  -> Arduino D9
#define SS_PIN 10   // RC522 SDA  -> Arduino D10 (SS)

MFRC522 mfrc522(SS_PIN, RST_PIN);

// How long to ignore the reader after a scan, to avoid double triggers.
const unsigned long COOLDOWN_MS = 1200;

void setup() {
  SPI.begin();
  mfrc522.PCD_Init();
  Keyboard.begin();
  delay(100);
}

void loop() {
  if (!mfrc522.PICC_IsNewCardPresent()) {
    delay(50);
    return;
  }
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Build the UID as uppercase hex without colons.
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) {
      uid += "0";
    }
    uid += String(mfrc522.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();

  // "Type" the UID into the focused field and press Enter to submit.
  Keyboard.print(uid);
  Keyboard.write(KEY_RETURN);

  // Stop the tag from being re-read immediately.
  mfrc522.PICC_HaltA();
  delay(COOLDOWN_MS);
}
