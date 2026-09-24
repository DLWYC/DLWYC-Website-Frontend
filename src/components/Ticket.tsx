import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";

interface QrValue {
  eventId: string;
  fullName: string;
}

interface TicketComponentProps {
  eventTitle: string;
  eventDate: Date | string | number;
  onShare?: () => void;
  attendeeName: string;
  ticketId?: string | number | null;
  qrValue: QrValue;
  DrawerClose: React.ComponentType<any>;
}

export function TicketComponent({
  eventTitle,
  eventDate,
  onShare,
  attendeeName,
  ticketId,
  qrValue,
  DrawerClose,
}: TicketComponentProps) {
  const onDownload = () => {
    const ticketNode = document.getElementById("printable-ticket-card");
    if (!ticketNode) return;

    // Build a fresh, isolated document so ancestor transforms/drawer
    // positioning can't interfere with print layout.
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      return;
    }

    // Carry over the app's stylesheets so Tailwind utility classes
    // still resolve correctly inside the iframe.
    const headHTML = Array.from(
      document.querySelectorAll('link[rel="stylesheet"], style'),
    )
      .map((el) => el.outerHTML)
      .join("\n");

    iframeDoc.open();
    iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        ${headHTML}
        <style>
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }
        body {
          display: flex;
          justify-content: center;
          align-items: center;   /* vertical centering on the page */
          min-height: 100vh;
          background: #fff;
        }
        /* Keep colors, borders and shadows when printing */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #printable-ticket-card {
          margin: 0 auto;
          box-shadow: none !important;
          width: 100%;
          max-width: 600px;      /* was 448px — bigger card */
          transform: scale(1.15); /* extra size bump, scales text/QR/padding together */
          transform-origin: center;
        }
        @page {
          size: auto;
          margin: 0;
        }
      </style>
      </head>
      <body>
        ${ticketNode.outerHTML}
      </body>
    </html>
  `);
    iframeDoc.close();

    // Give the iframe a tick to load fonts/styles before printing.
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 500);
    };
  };
  return (
    <main className="flex flex-1 flex-col px-5 pb-6">
      {/* 2. Added the safe ID "printable-ticket-card" targeting the card boundary precisely */}
      <div
        id="printable-ticket-card"
        className="mx-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
      >
        {/* Event */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold leading-snug text-[#091e54]">
              {eventTitle}
            </h2>
            {eventDate && (
              <p className="mt-1 text-sm text-slate-400">
                {format(new Date(eventDate), "EEE, MMM dd")}
              </p>
            )}
          </div>
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              aria-label="Share registration"
              className="shrink-0 rounded-full p-1.5 text-[#091e54] transition hover:bg-[#091e54]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#091e54]/40"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          )}
        </div>

        <hr className="my-5 border-t border-dashed border-slate-200" />

        {/* Attendee + ticket id */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <dt className="text-xs text-slate-400">Attendee</dt>
            <dd className="mt-1 text-[15px] font-medium text-[#091e54]">
              {attendeeName}
            </dd>
          </div>
          {ticketId && (
            <div>
              <dt className="text-xs text-slate-400">Ticket ID</dt>
              <dd className="mt-1 text-[15px] font-medium text-[#091e54]">
                {ticketId}
              </dd>
            </div>
          )}
        </dl>

        <hr className="my-5 border-t border-dashed border-slate-200" />

        {/* QR */}
        <div className="mt-5 flex justify-center rounded-2xl border border-slate-200 p-6">
          {QRCodeSVG ? (
            <QRCodeSVG
              value={JSON.stringify(qrValue)}
              size={140}
              fgColor="#091e54"
              bgColor="#ffffff"
              level="M"
            />
          ) : (
            <div className="text-xs text-red-500">
              Error: QRCodeSVG component missing
            </div>
          )}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-slate-500">
          <span className="font-medium text-[#091e54]">Note:</span> Show this QR
          code at the entrance to check in.
        </p>
      </div>

      {/* Actions */}
      <div className="mx-auto mt-4 flex w-full max-w-md gap-3">
        {DrawerClose ? (
          <DrawerClose
            type="button"
            className="flex-1 rounded-xl cursor-pointer border border-slate-200 bg-white py-3.5 text-sm font-medium text-[#091e54] transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#091e54]/40"
          >
            Cancel
          </DrawerClose>
        ) : (
          <button
            type="button"
            className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-medium text-slate-400"
          >
            Cancel Unavailable
          </button>
        )}
        <button
          type="button"
          onClick={onDownload}
          className="flex-1 rounded-xl cursor-pointer bg-[#091e54] py-3.5 text-sm font-medium text-white transition hover:bg-[#0d2a72] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#091e54]/40"
        >
          Download
        </button>
      </div>
    </main>
  );
}
