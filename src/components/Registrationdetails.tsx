import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { DrawerClose } from "@/components/ui/drawer";

interface QrValue {
  eventId: string;
  fullName: string;
}

export interface RegistrationDetailsProps {
  eventTitle: string;
  eventDate?: Date;
  attendeeName: string;
  qrValue: QrValue;
  ticketId?: string;
  onBack?: () => void;
  onShare?: () => void;
  onCancel?: () => void;
  onDownload?: () => void;
}

export function RegistrationDetails({
  eventTitle,
  eventDate,
  attendeeName,
  //   message,
  qrValue,
  ticketId,
  onShare,
  onDownload,
}: RegistrationDetailsProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7fa] font-rubik rounded-md">
      {/* Top bar */}
      <header className="relative flex items-center justify-center px-5 py-2">
        <h1 className="text-lg font-semibold text-[#091e54]">
          Registration Details
        </h1>
      </header>

      {/* Ticket card */}
      <main className="flex flex-1 flex-col px-5 pb-6">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          {/* Event */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold leading-snug text-[#091e54]">
                {eventTitle}
              </h2>
              {eventDate && (
                <p className="mt-1 text-sm text-slate-400">
                  {format(eventDate, "EEE, MMM dd")}
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

          {/* Congratulatory message */}
          {/* <p className="text-sm leading-relaxed text-slate-500">{message}</p> */}

          {/* QR */}
          <div className="mt-5 flex justify-center rounded-2xl border border-slate-200 p-6">
            <QRCodeSVG
              value={JSON.stringify(qrValue)}
              size={140}
              fgColor="#091e54"
              bgColor="#ffffff"
              level="M"
            />
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate-500">
            <span className="font-medium text-[#091e54]">Note:</span> Show this
            QR code at the entrance to check in.
          </p>
        </div>

        {/* Actions */}
        <div className="mx-auto mt-4 flex w-full max-w-md gap-3">
          <DrawerClose
            // asChild
            type="button"
            // onClick={onCancel}
            className="flex-1 rounded-xl cursor-pointer border border-slate-200 bg-white py-3.5 text-sm font-medium text-[#091e54] transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#091e54]/40"
          >
            Cancel
          </DrawerClose>
          <button
            type="button"
            onClick={onDownload}
            className="flex-1 rounded-xl cursor-pointer bg-[#091e54] py-3.5 text-sm font-medium text-white transition hover:bg-[#0d2a72] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#091e54]/40"
          >
            Download
          </button>
        </div>
      </main>
    </div>
  );
}
