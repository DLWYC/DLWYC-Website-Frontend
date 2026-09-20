import { X, Printer, Copy, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import CheckInQr from '@/components/CheckInQr';
import { buildQrPayload } from '@/lib/qr';

/**
 * Shows one attendee's check-in QR pass (attendee name + event ID).
 * Staff can present it on screen or print it as a physical pass.
 */
export default function QrPassModal({ attendee, eventId, eventTitle, onClose }) {
  if (!attendee) return null;
  const payload = buildQrPayload(attendee.fullName, eventId || eventTitle);

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      toast.success('QR code copied');
    } catch {
      toast.error('Could not copy — select the code text and copy manually');
    }
  };

  const printPass = () => {
    // Re-render the QR into a print window (simple, reliable, no print CSS needed).
    import('qrcode').then(({ default: QRCode }) => {
      QRCode.toDataURL(payload, { width: 600, margin: 2, errorCorrectionLevel: 'M' }).then(
        (url) => {
          const w = window.open('', '_blank', 'width=480,height=720');
          if (!w) {
            toast.error('Pop-up blocked — allow pop-ups to print the pass');
            return;
          }
          w.document.write(`<!doctype html>
<html>
<head>
  <title>DLWYC Check-In QR — ${attendee.fullName}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; text-align: center; padding: 32px; color: #111827; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    .event { font-size: 14px; color: #4b5563; margin: 0 0 20px; }
    img { width: 340px; height: 340px; margin: 0 auto; display: block; border: 1px solid #e5e7eb; border-radius: 8px; }
    .code { font-family: monospace; font-size: 11px; color: #6b7280; margin-top: 16px; word-break: break-all; }
    .note { font-size: 12px; color: #374151; margin-top: 24px; }
  </style>
</head>
<body>
  <h1>${attendee.fullName}</h1>
  <p class="event">${eventTitle || ''}</p>
  <img src="${url}" alt="Check-in QR" />
  <p class="code">${payload}</p>
  <p class="note">DLWYC Check-In QR — present this at the registration desk / gate.</p>
  <script>window.onload = function () { window.print(); }<\/script>
</body>
</html>`);
          w.document.close();
          w.focus();
        }
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 rounded-lg p-1.5">
              <QrCode className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Check-In QR Pass</h3>
              <p className="text-xs text-gray-500">Attendee name + event ID</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center gap-4">
          <CheckInQr
            eventId={eventId || eventTitle}
            eventTitle={eventTitle}
            name={attendee.fullName}
            size={220}
            showPayload
          />

          <p className="text-[11px] text-gray-400 text-center leading-relaxed">
            Show this on screen or print it. The scanner in the portal reads it with the
            operator's phone.
          </p>

          <div className="flex gap-2 w-full">
            <Button onClick={copyPayload} variant="outline" size="sm" className="flex-1">
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy code
            </Button>
            <Button onClick={printPass} size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print pass
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
