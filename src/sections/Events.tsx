import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { differenceInCalendarDays, format, startOfToday } from "date-fns";
import { FaArrowRight, FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";

import SectionTitle from "@/components/SectionTitle";
import { api } from "@/config/api";

interface EventItem {
  _id: string;
  eventTitle: string;
  eventDate: string; // ISO string
  eventTime: string;
  eventLocation: string;
  eventDescription: string;
  eventType: "Free" | "Paid" | string;
  eventImage?: string;
  featured?: boolean; // optional: only if your API sends it
}

const HOME_LIMIT = 3;

const isUpcoming = (e: EventItem) => new Date(e.eventDate) >= startOfToday();
const byDate = (a: EventItem, b: EventItem) =>
  new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();

function useUpcomingEvents(limit = HOME_LIMIT) {
  return useQuery({
    queryKey: ["homepageEvents"],
    queryFn: async () => {
      const res = await api.get("/events/all-events");
      return (res?.data?.events ?? []) as EventItem[];
    },
    staleTime: 5 * 60 * 1000,
    select: (events) => events.filter(isUpcoming).sort(byDate).slice(0, limit),
  });
}

/* ───────────── Small pieces ───────────── */

const ctaClass =
  "inline-flex items-center gap-2 font-grotesk font-semibold transition-all duration-300";

function countdown(date: Date) {
  const days = differenceInCalendarDays(date, startOfToday());
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  if (days < 30) return `In ${Math.round(days / 7)} wk`;
  return `In ${Math.round(days / 30)} mo`;
}

function Meta({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 font-grotesk text-xs text-slate-600">
      {icon}
      {children}
    </span>
  );
}

/** Half-circle cut-outs that make the card read as a ticket. */
const notch =
  "absolute z-10 h-6 w-6 rounded-full border border-blue-100 bg-white";

function EventRow({ event, index }: { event: EventItem; index: number }) {
  const reduce = useReducedMotion();
  const date = new Date(event.eventDate);
  const isFree = event.eventType === "Free";
  const when = countdown(date);
  const soon = when === "Today" || when === "Tomorrow";

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={reduce ? undefined : { y: -4 }}
      className={`group relative overflow-hidden rounded-3xl border bg-white font-rubik transition-all duration-300 ${
        event.featured
          ? "border-blue-500/40 shadow-xl shadow-blue-600/10"
          : "border-blue-100 shadow-md shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-600/10"
      }`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* ── Poster side ── */}
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 lg:aspect-auto lg:min-h-[13rem] lg:w-64">
          {/* Fallback: oversized day number when there is no image */}
          <span
            aria-hidden="true"
            className="absolute -bottom-6 -right-2 select-none font-geom text-[9rem] font-black leading-none text-white/10"
          >
            {format(date, "dd")}
          </span>

          {event.eventImage && (
            <img
              src={event.eventImage}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          )}

          {/* Legibility scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

          {/* Date tag */}
          <div className="absolute bottom-4 left-4 flex items-end gap-2 text-white">
            <span className="font-geom text-5xl font-black leading-none">
              {format(date, "dd")}
            </span>
            <span className="pb-1 font-grotesk text-sm font-semibold leading-tight">
              {format(date, "MMM")}
              <span className="block text-xs font-normal text-white/75">
                {format(date, "EEEE")}
              </span>
            </span>
          </div>

          {/* Countdown */}
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
        <div
          aria-hidden="true"
          className="relative h-0 border-t-2 border-dashed border-blue-200 lg:h-auto lg:w-0 lg:border-l-2 lg:border-t-0"
        >
          <span
            className={`${notch} left-0 top-0 -translate-x-1/2 -translate-y-1/2`}
          />
          <span
            className={`${notch} right-0 top-0 -translate-y-1/2 translate-x-1/2 lg:left-0 lg:right-auto lg:top-auto lg:bottom-0 lg:-translate-x-1/2 lg:translate-y-1/2`}
          />
        </div>

        {/* ── Details side ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:gap-8">
          <div className="min-w-0 flex-1 text-left">
            <span
              className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-grotesk text-xs font-semibold ${
                isFree
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isFree ? "bg-emerald-500" : "bg-blue-600"
                }`}
              />
              {isFree ? "Free entry" : "Paid event"}
            </span>

            <h3 className="mb-2 font-geom text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-700 sm:text-2xl">
              {event.eventTitle}
            </h3>
            <p className="mb-4 line-clamp-2 font-grotesk text-sm leading-relaxed text-slate-600">
              {event.eventDescription}
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-lg bg-slate-50 px-3 py-1.5">
                <Meta icon={<FaClock size={12} className="text-blue-600" />}>
                  {event.eventTime}
                </Meta>
              </span>
              <span className="rounded-lg bg-slate-50 px-3 py-1.5">
                <Meta
                  icon={<FaMapMarkerAlt size={12} className="text-blue-600" />}
                >
                  {event.eventLocation}
                </Meta>
              </span>
            </div>
          </div>

          <Link
            to="/events"
            aria-label={`Learn more about ${event.eventTitle}`}
            className={`${ctaClass} group/btn shrink-0 justify-center rounded-full bg-blue-600 px-6 py-3 text-sm text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
          >
            Learn more
            <FaArrowRight
              size={14}
              className="transition-transform group-hover/btn:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function EventsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading events" className="space-y-6">
      {Array.from({ length: HOME_LIMIT }, (_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col overflow-hidden rounded-3xl border border-blue-100 lg:flex-row"
        >
          <div className="aspect-[16/9] bg-blue-50 lg:aspect-auto lg:min-h-[13rem] lg:w-64" />
          <div className="flex-1 space-y-3 p-6">
            <div className="h-4 w-20 rounded-full bg-blue-50" />
            <div className="h-5 w-2/3 rounded bg-blue-50" />
            <div className="h-3 w-full rounded bg-blue-50" />
            <div className="h-3 w-1/2 rounded bg-blue-50" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StateBox({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className="rounded-3xl border border-dashed border-blue-200 px-6 py-14 text-center"
    >
      <p className="font-geom text-lg font-bold text-slate-900">{title}</p>
      <p className="mx-auto mt-1 max-w-sm font-grotesk text-sm text-slate-500">
        {text}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ───────────── Section ───────────── */

function Events() {
  const {
    data: events = [],
    isLoading,
    isError,
    refetch,
  } = useUpcomingEvents();

  return (
    <section id="events" className="overflow-x-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Coming Up"
          title="Upcoming Events"
          description="Join us at our upcoming events designed to inspire, equip, and bring our youth community together."
        />

        {isLoading ? (
          <EventsSkeleton />
        ) : isError ? (
          <StateBox
            title="Couldn’t load events"
            text="Check your connection and try again."
            action={
              <button
                type="button"
                onClick={() => refetch()}
                className={`${ctaClass} rounded-xl bg-blue-600 px-5 py-2.5 text-sm text-white hover:bg-blue-700`}
              >
                Try again
              </button>
            }
          />
        ) : events.length === 0 ? (
          <StateBox
            title="No upcoming events"
            text="We’re planning the next one. Check back soon, or see what we’ve done before."
          />
        ) : (
          <div className="space-y-6">
            {events.map((event, i) => (
              <EventRow key={event._id} event={event} index={i} />
            ))}
          </div>
        )}

        {events.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              to="/events"
              className={`${ctaClass} rounded-full bg-blue-50 px-8 py-3.5 text-blue-700 hover:bg-blue-100`}
            >
              View all events
              <FaArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Events;