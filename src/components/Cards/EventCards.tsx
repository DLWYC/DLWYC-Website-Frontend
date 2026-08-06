
import {
  Bookmark,
  Globe,
  Lock,
  Users,
} from "lucide-react";

export function EventCard(events) {
  const event = events?.events;
  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const isFree = event.eventType === "Free";
  return (
    <div
      // to={`/events/${event._id}`}
      className="flex h-44 gap-4 rounded-[10px] border border-primary-main/10 bg-white p-3 transition-shadow hover:shadow-md"
    >
      <div className="relative w-2/5 shrink-0 overflow-hidden rounded-lg bg-primary-main/5">
        {event.eventImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.eventImage}
            alt={event.eventTitle}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-evenly py-1 font-grotesk">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] text-primary-main/60">
            {formattedDate}, {event.eventTime}
          </p>
          <Bookmark className="h-4 w-4 shrink-0 text-primary-main/40" />
        </div>

        <h2 className="font-header text-[20px] leading-tight text-primary-main line-clamp-2">
          {event.eventTitle}
        </h2>

        <p className='text-[13px] text-primary-main/70'>{event.eventDescription.slice(0,50)}</p>

        <div className="flex items-center justify-between text-[13px]">
          <span className="flex items-center gap-1.5 text-primary-main/70">
            <Users className="h-3.5 w-3.5" />
            {event.registeredCount}+ registered
          </span>
          <span
            className={`flex items-center gap-1 font-medium ${
              isFree ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {isFree ? (
              <Globe className="h-3.5 w-3.5" />
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
            {event.eventType}
          </span>
        </div>
      </div>
    </div>
  );
}
