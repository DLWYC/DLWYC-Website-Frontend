import { memo, useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Date helpers (no external deps)                                           */
/* -------------------------------------------------------------------------- */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_DOTS = 2;

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const isSameDay = (a: Date, b: Date) => dayKey(a) === dayKey(b);

/** Always returns 42 cells (6 weeks) starting on the Sunday before the 1st. */
function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from(
    { length: 42 },
    (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

type EventCalendarProps = {
  /** Dates that have events. Each entry adds a dot under that day (max 2). */
  eventDates?: Array<Date | string | number | null | undefined>;
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
};

export const EventCalendar = memo(function EventCalendar({
  eventDates = [],
  selected,
  onSelect,
  className = "",
}: EventCalendarProps) {
  const [internalSelected, setInternalSelected] = useState<Date>(
    () => selected ?? new Date(),
  );
  const current = selected ?? internalSelected;

  // The month being viewed (independent of the selected day).
  const [view, setView] = useState(
    () => new Date(current.getFullYear(), current.getMonth(), 1),
  );

  const year = view.getFullYear();
  const month = view.getMonth();

  const days = useMemo(() => buildGrid(year, month), [year, month]);

  // dayKey -> number of events on that day
  const eventCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const raw of eventDates) {
      if (raw == null) continue;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) continue;
      const k = dayKey(d);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [eventDates]);

  const today = useMemo(() => new Date(), []);

  const goPrev = useCallback(
    () => setView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1)),
    [],
  );
  const goNext = useCallback(
    () => setView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1)),
    [],
  );

  const pick = (d: Date) => {
    setInternalSelected(d);
    onSelect?.(d);
    // Clicking a faded day from a neighbouring month jumps to that month.
    if (d.getMonth() !== month) {
      setView(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  };

  const title = view.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={`w-full rounded-xl border bg-card p-4 font-grotesk ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-header text-sm font-semibold text-[#1e2a3f] dark:text-foreground">
          {title}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous month"
            className="grid size-6 place-items-center rounded-md text-[#1e2a3f] outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-[#1e2a3f] dark:text-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next month"
            className="grid size-6 place-items-center rounded-md text-[#1e2a3f] outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-[#1e2a3f] dark:text-foreground"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1 text-[11px] text-muted-foreground/70">
            {w}
          </span>
        ))}
      </div>

      {/* Days */}
      <div role="grid" aria-label={title} className="grid grid-cols-7 gap-y-1">
        {days.map((d) => {
          const outside = d.getMonth() !== month;
          const isSelected = isSameDay(d, current);
          const isToday = isSameDay(d, today);
          const dots = Math.min(eventCounts.get(dayKey(d)) ?? 0, MAX_DOTS);

          return (
            <div key={d.toISOString()} className="flex justify-center">
              <button
                type="button"
                role="gridcell"
                aria-selected={isSelected}
                aria-current={isToday ? "date" : undefined}
                aria-label={d.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                onClick={() => pick(d)}
                className={[
                  "relative flex size-9 flex-col items-center justify-center rounded-lg text-[13px] outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-[#1e2a3f] focus-visible:ring-offset-1",
                  isSelected
                    ? "bg-[#1e2a3f] font-semibold text-white"
                    : outside
                      ? "text-muted-foreground/50 hover:bg-muted"
                      : "font-semibold text-[#1e2a3f] hover:bg-muted dark:text-foreground",
                  isToday && !isSelected ? "ring-1 ring-[#1e2a3f]/30" : "",
                ].join(" ")}
              >
                <span className="leading-none">{d.getDate()}</span>

                {dots > 0 && (
                  <span
                    aria-hidden
                    className="absolute bottom-1 flex gap-[2px]"
                  >
                    {Array.from({ length: dots }, (_, i) => (
                      <span
                        key={i}
                        className={`size-[3px] rounded-full ${
                          isSelected ? "bg-white" : "bg-[#1e2a3f]/60"
                        }`}
                      />
                    ))}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
});