import { format, isToday } from "date-fns";
import { Bookmark, Globe, Lock, Users } from "lucide-react";
import { useState, type KeyboardEvent, type MouseEvent } from "react";

/**
 * NOTE ON SHAPE: your page does `<EventCard events={event} />`, passing a
 * single event object under the prop name `events`. The original component
 * then did `events?.events`, which only works if the *caller* wraps it as
 * `{ events: event }` — it doesn't, so that line was silently reading
 * `undefined`. Fixed below by aliasing the prop on destructure instead.
 */
interface EventCardData {
  _id: string;
  eventTitle: string;
  eventDate: string | Date;
  eventTime: string;
  eventDescription: string;
  eventType: "Free" | "Paid" | string;
  eventCapacity: number;
  registeredCount: number;
  eventImage?: string;
}

interface EventCardProps {
  events: EventCardData;
}

export function EventCard({ events: event }: EventCardProps) {
  // Bookmarked state lives locally since the page doesn't lift it — swap
  // this for a mutation/query if you want saves to persist server-side.
  const [saved, setSaved] = useState(false);

  const eventDate = new Date(event.eventDate);
  const dateLabel = format(eventDate, "EEE, MMM dd");
  const today = isToday(eventDate);

  const isFree = event.eventType === "Free";
  const pct = event.eventCapacity
    ? Math.min(100, Math.round((event.registeredCount / event.eventCapacity) * 100))
    : 0;
  const nearlyFull = pct >= 90;
  const eventFull = pct == 100;

  // The card renders inside a <DrawerTrigger>, which is itself a button.
  // A nested <button> for the bookmark would be invalid HTML and would
  // also fire the drawer's onClick. Using a span with button semantics +
  // stopPropagation avoids both problems.
  const handleSaveClick = (e: MouseEvent) => {
    e.stopPropagation();
    setSaved((s) => !s);
  };
  const handleSaveKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      setSaved((s) => !s);
    }
  };

  return (
    <div className="group relative flex h-44 overflow-hidden rounded-[10px] border border-primary-main/10 bg-white transition-shadow hover:shadow-md">
      {/* Poster */}
      <div className="relative w-2/5 shrink-0 overflow-hidden bg-primary-main/5">
        {event.eventImage ? (
          <img
            src={event.eventImage}
            alt={event.eventTitle}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : null}

        {today && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-0.5 font-grotesk text-[11px] font-medium text-reddish">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-reddish" />
            Today
          </span>
        )}
      </div>

      {/*
        Perforated "ticket" seam — dashed divider between poster and details.
        A punch-hole version (small circles straddling the top/bottom edge)
        looks even more ticket-like, but only reads correctly if the circle
        color matches whatever sits BEHIND this card (your page/ScrollArea
        background). Uncomment and set that color once you know it:

        <span className="absolute -left-[9px] -top-[9px] h-[18px] w-[18px] rounded-full bg-white" />
        <span className="absolute -bottom-[9px] -left-[9px] h-[18px] w-[18px] rounded-full bg-white" />
      */}
      <div className="relative hidden w-0 shrink-0 sm:block" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 border-l border-dashed border-primary-main/15" />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between gap-2 p-3 font-grotesk">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[12px] tracking-wide text-primary-main/50">
              {dateLabel} · {event.eventTime}
            </p>
            <h2 className="mt-0.5 font-header text-[18px] leading-tight text-primary-main line-clamp-2">
              {event.eventTitle}
            </h2>
          </div>

          <span
            role="button"
            tabIndex={0}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved events" : "Save event"}
            onClick={handleSaveClick}
            onKeyDown={handleSaveKeyDown}
            className="shrink-0 cursor-pointer rounded-full p-1 transition-colors hover:bg-primary-main/5"
          >
            <Bookmark
              className={`h-4 w-4 ${saved ? "text-reddish" : "text-primary-main/40"}`}
              fill={saved ? "currentColor" : "none"}
            />
          </span>
        </div>

        {/*
          line-clamp-2 replaces the old `.slice(0, 50)` — that cut text mid
          word regardless of layout width. Clamping by line lets the CSS
          truncate cleanly at whatever width the card actually renders at.
        */}
        <p className="text-[13px] leading-snug text-primary-main/60 line-clamp-2">
          {event.eventDescription}
        </p>

        <div className="flex items-end justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-[11px] text-primary-main/50">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {event.registeredCount}/{event.eventCapacity}
              </span>
              <span>{eventFull ? "Sold Out" : nearlyFull ? "almost full" : `${pct}%`}</span>
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-primary-main/10">
              <div
                className={`h-full rounded-full transition-all ${
                  nearlyFull ? "bg-reddish" : "bg-primary-main"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 -rotate-3 items-center gap-1 whitespace-nowrap rounded-[4px] border border-dashed px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              isFree
                ? "border-emerald-600/60 text-emerald-600"
                : "border-amber-600/60 text-amber-600"
            }`}
          >
            {isFree ? <Globe className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
            {event.eventType}
          </span>
        </div>
      </div>
    </div>
  );
}