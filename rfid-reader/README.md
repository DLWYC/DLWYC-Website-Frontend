# DLWYC RFID Reader Service

Reads an **RFID-RC522** tag and drives event **check-in / check-out** against your
existing DLWYC backend API. It runs on a **Raspberry Pi** that has the RC522 wired
to its SPI pins.

> The browser can't talk to the RC522 directly — this service is the bridge.
> Once a tag is scanned here, your backend updates the attendee, and the
> **Registration Unit portal** in the frontend picks it up automatically (it
> already refreshes every 30s and shows live check-in status).

---

## 1. Hardware wiring (RC522 → Raspberry Pi)

| RC522 pin | Pi pin | GPIO |
|-----------|--------|------|
| `SDA`     | 24     | GPIO8  (CE0) |
| `SCK`     | 23     | GPIO11 |
| `MOSI`    | 19     | GPIO10 |
| `MISO`    | 21     | GPIO9  |
| `RST`     | 22     | GPIO25 |
| `IRQ`     | —      | unconnected |
| `VCC`     | 1 (3.3V) | — |
| `GND`     | 6      | — |

The pin numbers above are already set in `index.js` and `scan-only.js`.

## 2. Enable SPI + install dependencies (on the Pi)

```bash
sudo raspi-config   # -> Interface Options -> SPI -> Enable -> reboot
sudo apt update && sudo apt install -y python3-spidev libusb-1.0-0
cd rfid-reader
npm install
```

## 3. Configure

```bash
cp .env.example .env
# edit .env, then:
```

**`BACKEND_URL`** is the base URL of the DLWYC backend. The backend listens on
all interfaces and prints its **LAN IP** on startup (e.g.
`http://192.168.1.20:4000`). If this Pi and the laptop running the backend are
on the same Wi-Fi/network, use that LAN URL. CORS is open by default so the Pi
can POST scans from anywhere on the network.

Two modes:

- **`SCAN_MODE=toggle`** — each scan calls
  `POST {BACKEND_URL}/api/registrationUnit/rfid/scan` with
  `{ cardUID, eventTitle }`. Your backend resolves the UID to an attendee and
  toggles check-in/check-out (see the integration doc for the required
  backend endpoint).
- **`SCAN_MODE=console`** — just prints UIDs to the terminal so you can test
  the wiring and paste a UID into the web portal's **Scan Card** box.

## 4. Run

```bash
npm start       # full reader (toggle mode)
npm run scan    # console-only, for testing wiring
```

## Testing the wiring first

```bash
npm run scan
# place a tag on the reader — you should see:  SCANNED AB12CD34EF...
```

Once you see that, either set `SCAN_MODE=console` and use the web portal's
**Scan Card** input, or set `SCAN_MODE=toggle` once the backend endpoint is live.

## Running at boot (optional)

Create a systemd unit or add to `crontab`:

```cron
@reboot cd /home/pi/DLWYC-Website-Frontend/rfid-reader && npm start > /tmp/rfid.log 2>&1 &
```
