import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { buildQrPayload } from '@/lib/qr';

/**
 * Renders an attendee's DLWYC check-in QR pass (event ID + their unique ID).
 *
 * @param {object} props
 * @param {string} props.eventId    the event's _id (e.g. "evt-camp")
 * @param {string} props.eventTitle event title (shown as caption)
 * @param {string} props.uniqueId   the attendee's own unique ID
 * @param {string} [props.name]     attendee name (caption)
 * @param {number} [props.size]     QR image size in px (default 160)
 * @param {boolean}[props.showPayload] also show the raw payload text (for staff)
 */
export default function CheckInQr({
  eventId,
  eventTitle,
  uniqueId,
  name,
  size = 160,
  showPayload = false,
}) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    let active = true;
    if (!eventId || !uniqueId) {
      setDataUrl(null);
      return;
    }
    QRCode.toDataURL(buildQrPayload(eventId, uniqueId), {
      width: Math.max(size * 2, 320),
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#111827', light: '#ffffff' },
    })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch((err) => {
        console.error('Could not generate QR code:', err);
        if (active) setDataUrl(null);
      });
    return () => {
      active = false;
    };
  }, [eventId, uniqueId, size]);

  if (!dataUrl) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={dataUrl}
        alt={`Check-in QR for ${name || 'attendee'} — ${eventTitle || ''}`}
        width={size}
        height={size}
        className="rounded-lg border border-gray-200 bg-white"
      />
      {name && (
        <p className="text-sm font-semibold text-gray-800 text-center">{name}</p>
      )}
      {eventTitle && (
        <p className="text-xs text-gray-500 text-center">{eventTitle}</p>
      )}
      {showPayload && (
        <p className="text-[10px] font-mono text-gray-400 break-all text-center px-2">
          {buildQrPayload(eventId, uniqueId)}
        </p>
      )}
    </div>
  );
}
