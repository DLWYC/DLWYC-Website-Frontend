import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { differenceInCalendarDays, format, startOfToday } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaClock, FaMapMarkerAlt, FaStar, FaTimes } from "react-icons/fa";

import { api } from "@/config/api";

export const Route = createFileRoute("/events")({
  component: EventsPage,
});

/* ───────────── 1. Types & data ───────────── */

interface EventItem {
  _id: string;
  eventTitle: string;
  eventDate: string; // ISO
  eventTime: string;
  eventLocation: string;
  eventDescription: string;
  eventType: "Free" | "Paid" | string;
  eventCapacity: number;
  registeredCount: number;
  eventImage?: string;
  featured?: boolean; // optional: only if your API sends it
}

const isUpcoming = (e: EventItem) => new Date(e.eventDate) >= startOfToday();
const byDate = (a: EventItem, b: EventItem) =>
  new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
const isFull = (e: EventItem) => e.registeredCount >= e.eventCapacity;

function countdown(date: Date) {
  const days = differenceInCalendarDays(date, startOfToday());
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  if (days < 30) return `In ${Math.round(days / 7)} wk`;
  return `In ${Math.round(days / 30)} mo`;
}

/* Same endpoint as the home section. Move to a shared file (e.g. hooks/usePublicEvents.ts)
   and pass a `limit` there if you want one hook for both pages. */
function usePublicEvents() {
  return useQuery({
    queryKey: ["homepageEvents"],
    queryFn: async () => (await api.get("/events/all-events"))?.data?.events as EventItem[] ?? [],
    staleTime: 5 * 60 * 1000,
    select: (events) => events.filter(isUpcoming).sort(byDate),
  });
}

/* ───────────── 2. Small pieces ───────────── */

function Meta({ icon, children, size = "text-xs" }: { icon: React.ReactNode; children: React.ReactNode; size?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-grotesk text-slate-500 ${size}`}>
      {icon}
      {children}
    </span>
  );
}

function Cover({ event, className = "" }: { event: EventItem; className?: string }) {
  return (
    <div className={`overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 ${className}`}>
      {event.eventImage && (
        <img
          src={event.eventImage}
          alt={event.eventTitle}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
        />
      )}
    </div>
  );
}

/** Half-circle cut-outs that make the card read as a ticket. */
const notch = "absolute z-10 h-6 w-6 rounded-full border border-blue-100 bg-white";

function EventCard({ event, index, onOpen }: { event: EventItem; index: number; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const date = new Date(event.eventDate);
  const isFree = event.eventType === "Free";
  const full = isFull(event);
  const when = countdown(date);
  const soon = when === "Today" || when === "Tomorrow";

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 4) * 0.08 }}
      whileHover={reduce ? undefined : { y: -4 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white transition-shadow duration-300 ${
        event.featured
          ? "border-blue-500/40 shadow-xl shadow-blue-600/10"
          : "border-blue-100 shadow-md shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-600/10"
      }`}
    >
      {/* ── Poster ── */}
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
        <Cover event={event} className="absolute inset-0" />
        <span
          aria-hidden="true"
          className="absolute -bottom-6 -right-2 select-none font-geom text-[9rem] font-black leading-none text-white/10"
        >
          {format(date, "dd")}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

        <div className="absolute bottom-4 left-4 flex items-end gap-2 text-white">
          <span className="font-geom text-5xl font-black leading-none">{format(date, "dd")}</span>
          <span className="pb-1 font-grotesk text-sm font-semibold leading-tight">
            {format(date, "MMM")}
            <span className="block text-xs font-normal text-white/75">{format(date, "EEEE")}</span>
          </span>
        </div>

        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 font-grotesk text-xs font-semibold backdrop-blur ${
            soon ? "bg-amber-400 text-slate-900" : "bg-white/90 text-blue-800"
          }`}
        >
          {when}
        </span>

        {event.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 font-grotesk text-xs font-bold text-white">
            <FaStar size={10} />
            Featured
          </span>
        )}
      </div>

      {/* ── Perforated tear line ── */}
      <div aria-hidden="true" className="relative h-0 border-t-2 border-dashed border-blue-200">
        <span className={`${notch} left-0 top-0 -translate-x-1/2 -translate-y-1/2`} />
        <span className={`${notch} right-0 top-0 -translate-y-1/2 translate-x-1/2`} />
      </div>

      {/* ── Details ── */}
      <div className="flex flex-1 flex-col gap-4 p-5 text-left sm:p-7">
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-grotesk text-xs font-semibold ${
              isFree ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isFree ? "bg-emerald-500" : "bg-blue-600"}`} />
            {isFree ? "Free entry" : "Paid event"}
          </span>
          {full && (
            <span className="rounded-full bg-slate-100 px-3 py-1 font-grotesk text-xs font-semibold text-slate-600">
              Event full
            </span>
          )}
        </div>

        <div>
          <h3 className="mb-2 font-geom text-[19px] font-bold text-slate-900 transition-colors group-hover:text-blue-700 sm:text-[19px]">
            {event.eventTitle}
          </h3>
          <p className="line-clamp-3 font-grotesk text-[14px] leading-relaxed text-slate-600">{event.eventDescription}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg bg-slate-50 px-3 py-1.5">
            <Meta icon={<FaClock size={12} className="text-blue-600" />}>{event.eventTime}</Meta>
          </span>
          <span className="rounded-lg bg-slate-50 px-3 py-1.5">
            <Meta icon={<FaMapMarkerAlt size={12} className="text-blue-600" />}>{event.eventLocation}</Meta>
          </span>
        </div>

        <button
          type="button"
          onClick={onOpen}
          aria-label={`Learn more about ${event.eventTitle}`}
          className="group/btn mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-grotesk text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto sm:self-start"
        >
          Learn more
          <FaArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </motion.article>
  );
}

/* ───────────── 3. Modal: header + scrolling body + footer that never leaves the screen ───────────── */

function EventModal({ event, onClose }: { event: EventItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const full = isFull(event);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="relative shrink-0">
          <Cover event={event} className="relative aspect-[16/9] max-h-56 w-full" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-blue-600"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5 sm:p-8">
          <div>
            <span className="mb-2 inline-block rounded-full bg-blue-600 px-3 py-1 font-grotesk text-xs font-bold uppercase tracking-wider text-white">
              {format(new Date(event.eventDate), "EEE, MMM dd, yyyy")}
            </span>
            <h2 id="event-modal-title" className="font-geom text-2xl font-bold text-slate-900 sm:text-3xl">
              {event.eventTitle}
            </h2>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Meta size="text-sm" icon={<FaClock size={14} className="text-blue-500" />}>{event.eventTime}</Meta>
            <Meta size="text-sm" icon={<FaMapMarkerAlt size={14} className="text-blue-500" />}>{event.eventLocation}</Meta>
            <Meta size="text-sm" icon={null}>{event.eventType === "Free" ? "Free entry" : "Paid event"}</Meta>
          </div>

          <div>
            <h3 className="mb-2 font-grotesk text-sm font-semibold uppercase tracking-wider text-blue-700">About this event</h3>
            <p className="whitespace-pre-line font-grotesk leading-relaxed text-slate-600">{event.eventDescription}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:px-8">
          {full ? (
            <p className="flex-1 rounded-xl bg-slate-100 px-6 py-3 text-center font-grotesk text-sm font-semibold text-slate-500">
              This event is full
            </p>
          ) : (
            <Link
              to="/login"
              className="flex-1 rounded-xl bg-blue-600 px-6 py-3 text-center font-grotesk font-bold text-white transition-colors hover:bg-blue-500"
            >
              Register now
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 px-6 py-3 font-grotesk font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────────── 4. States ───────────── */

function EventsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading events" className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-3xl border border-blue-100">
          <div className="aspect-[16/9] bg-blue-50" />
          <div className="space-y-3 p-6">
            <div className="h-5 w-2/3 rounded bg-blue-50" />
            <div className="h-3 w-full rounded bg-blue-50" />
            <div className="h-3 w-1/2 rounded bg-blue-50" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StateBox({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div role="status" className="rounded-2xl border border-dashed border-blue-200 px-6 py-16 text-center">
      <p className="font-geom text-lg font-bold text-slate-900">{title}</p>
      <p className="mx-auto mt-1 max-w-sm font-grotesk text-sm text-slate-500">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ───────────── 5. Page ───────────── */

function EventsPage() {
  const { data: events = [], isLoading, isError, refetch } = usePublicEvents();
  const [selected, setSelected] = useState<EventItem | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section className="min-h-screen overflow-x-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link to="/" className="mb-10 inline-flex items-center gap-2 font-grotesk text-sm text-slate-500 transition-colors hover:text-blue-700">
          <FaArrowLeft size={12} /> Back to home
        </Link>

        <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
          <span className="mb-4 inline-block font-grotesk text-sm font-semibold uppercase tracking-widest text-blue-700">Coming up</span>
          <h1 className="mb-5 font-geom text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">Upcoming events</h1>
          <p className="font-grotesk text-base leading-relaxed text-slate-600 sm:text-lg">
            Join us at our upcoming events designed to inspire, equip, and bring our youth community together.
          </p>
        </header>

        {isLoading ? (
          <EventsSkeleton />
        ) : isError ? (
          <StateBox
            title="Couldn’t load events"
            text="Check your connection and try again."
            action={
              <button type="button" onClick={() => refetch()} className="rounded-xl bg-blue-600 px-5 py-2.5 font-grotesk text-sm font-semibold text-white hover:bg-blue-700">
                Try again
              </button>
            }
          />
        ) : events.length === 0 ? (
          <StateBox title="No upcoming events" text="We’re planning the next one. Check back soon." />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {events.map((event, i) => (
              <EventCard key={event._id} event={event} index={i} onOpen={() => setSelected(event)} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>{selected && <EventModal key={selected._id} event={selected} onClose={close} />}</AnimatePresence>
    </section>
  );
}