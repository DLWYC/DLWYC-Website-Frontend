import { createLazyFileRoute, Link, useRouter } from "@tanstack/react-router";
import { format, isToday } from "date-fns";
import { CalendarX, RefreshCw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EventCard } from "@/components/Cards/EventCards";
import { TicketComponent } from "@/components/Ticket";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import {
  useFetchAllEvents,
  useGetUserRegisteredEvents,
} from "@/features/dashboard/hooks/useFetchEvents";
import { useFreeEventRegistration } from "@/features/dashboard/hooks/useRegisterEvents";
import { queryClient } from "@/main";

export const Route = createLazyFileRoute("/dashboard/events/")({
  component: EventsPage,
});

/* ───────────────────────── 1. Types ───────────────────────── */

interface EventItem {
  _id: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventTime: string;
  eventDescription: string;
  eventType: "Free" | "Paid" | string;
  eventCapacity: number;
  eventImage?: string;
  registeredCount: number;
}

interface RegisteredEvent {
  _id: string;
  eventId: string;
  reference?: string;
  registrationCode?: string;
}

/* ───────────────────────── 2. Constants & helpers ───────────────────────── */

const FILTERS = ["All", "Free", "Paid", "Today"] as const;
type FilterValue = (typeof FILTERS)[number];

const isFull = (e: EventItem) => e.registeredCount >= e.eventCapacity;
const spotsLeft = (e: EventItem) =>
  Math.max(e.eventCapacity - e.registeredCount, 0);

const matchesFilter = (e: EventItem, f: FilterValue) =>
  f === "All"
    ? true
    : f === "Today"
      ? isToday(new Date(e.eventDate))
      : e.eventType === f;

/* ───────────────────────── 3. Hooks ───────────────────────── */

function useEventFilters(events: EventItem[]) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("All");

  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((f) => [f, events.filter((e) => matchesFilter(e, f)).length]),
      ) as Record<FilterValue, number>,
    [events],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter(
      (e) => matchesFilter(e, filter) && e.eventTitle.toLowerCase().includes(q),
    );
  }, [events, query, filter]);

  const reset = () => {
    setQuery("");
    setFilter("All");
  };

  return { query, setQuery, filter, setFilter, counts, filtered, reset };
}

/* ───────────────────────── 4. List UI ───────────────────────── */

function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded bg-primary-main/10 ${className}`} />;
}

/* Each section owns its own loading UI, so the page just passes `loading` down */
function PageHeader({ loading, count }: { loading: boolean; count: number }) {
  if (loading) {
    return (
      <header aria-busy="true" className="space-y-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3.5 w-52" />
      </header>
    );
  }
  return (
    <header>
      <h1 className="font-main text-lg font-semibold tracking-tight text-primary">All events</h1>
      {count > 0 && (
        <p className="mt-1 font-grotesk text-[13px] text-primary/50">
          {count} event{count === 1 ? "" : "s"} available right now
        </p>
      )}
    </header>
  );
}

function SearchBar({
  value,
  onChange,
  loading = false,
}: {
  value: string;
  onChange: (v: string) => void;
  loading?: boolean;
}) {
  if (loading) return <Skeleton className="h-10 w-full rounded-full" />;
  return (
    <div className="flex items-center gap-2 rounded-full border border-primary-main/10 bg-white px-3 py-2 focus-within:border-primary-main/40">
      <Search className="h-4 w-4 shrink-0 text-primary/40" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search events"
        aria-label="Search events"
        className="w-full bg-transparent font-grotesk text-[13px] text-primary outline-none placeholder:text-primary/40"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label="Clear search">
          <X className="h-4 w-4 text-primary/40" />
        </button>
      )}
    </div>
  );
}

function FilterTabs({
  active,
  counts,
  onChange,
  loading = false,
}: {
  active: FilterValue;
  counts: Record<FilterValue, number>;
  onChange: (f: FilterValue) => void;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex gap-5 pb-1.5">
        {FILTERS.map((f) => (
          <Skeleton key={f} className="h-4 w-12" />
        ))}
      </div>
    );
  }
  return (
    <div
      role="tablist"
      className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 font-grotesk text-[13px] text-primary/50"
    >
      {FILTERS.map((f) => (
        <button
          key={f}
          role="tab"
          aria-selected={active === f}
          type="button"
          onClick={() => onChange(f)}
          className={`relative shrink-0 pb-1.5 transition-colors ${
            active === f
              ? "font-medium text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-reddish after:content-['']"
              : "hover:text-primary/80"
          }`}
        >
          {f} <span className="text-[11px]">{counts[f]}</span>
        </button>
      ))}
    </div>
  );
}

function EmptyState({ query, filter, onReset }: { query: string; filter: FilterValue; onReset: () => void }) {
  return (
    <div className="rounded-[10px] border border-dashed border-primary-main/15 px-6 py-12 text-center">
      <p className="font-main text-[15px] font-semibold text-primary">
        {query ? `No events match “${query}”` : `No ${filter.toLowerCase()} events right now`}
      </p>
      <p className="mt-1 font-grotesk text-[13px] text-primary/50">
        Try a different search, or switch back to all events.
      </p>
      <button type="button" onClick={onReset} className="mt-3 font-grotesk text-[12px] font-medium text-reddish">
        Show all events
      </button>
    </div>
  );
}

/* The "null" state: the app has no events at all (different from "no search results") */
function NoEventsYet({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-[10px] border border-dashed border-primary-main/15 px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-main/5">
        <CalendarX className="h-6 w-6 text-primary/50" />
      </span>
      <p className="mt-3 font-main text-[15px] font-semibold text-primary">No events yet</p>
      <p className="mt-1 max-w-xs font-grotesk text-[13px] text-primary/50">
        New events will appear here as soon as they are published. Check back soon.
      </p>
      <button
        type="button"
        onClick={onRefresh}
        className="mt-4 inline-flex items-center gap-1.5 font-grotesk text-[12px] font-medium text-reddish"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Refresh
      </button>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-[10px] border border-dashed border-red-300 px-6 py-14 text-center">
      <p className="font-main text-[15px] font-semibold text-primary">Couldn’t load events</p>
      <p className="mt-1 font-grotesk text-[13px] text-primary/50">Check your connection and try again.</p>
      <Button type="button" onClick={onRetry} className="mt-4 h-10 rounded-lg bg-primary-main px-5 text-white">
        Try again
      </Button>
    </div>
  );
}

function EventsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading events" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-2">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-[10px] bg-primary-main/5" />
      ))}
    </div>
  );
}

function EventGrid({ events, onSelect }: { events: EventItem[]; onSelect: (e: EventItem) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-2">
      {events.map((event) => (
        <button
          key={event._id}
          type="button"
          onClick={() => onSelect(event)}
          className="cursor-pointer rounded-[10px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-main"
        >
          <EventCard events={event} />
        </button>
      ))}
    </div>
  );
}

/* ───────────────────────── 5. Drawer UI ───────────────────────── */

type FooterProps = {
  event: EventItem;
  registered: boolean;
  isPending: boolean;
  hasError: boolean;
  onRegister: () => void;
};

function EventFooter({ event, registered, isPending, hasError, onRegister }: FooterProps) {
  if (registered) return null;
  const base = "flex h-11 w-full items-center justify-center rounded-lg font-main text-[15px] font-medium text-white";

  return (
    <DrawerFooter className="shrink-0 gap-2 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
      {isFull(event) ? (
        <Link to={event._id} className={`${base} bg-gray-500`}>
          Event full – enter code if available
        </Link>
      ) : event.eventType === "Free" ? (
        <Button
          type="button"
          onClick={onRegister}
          disabled={isPending}
          aria-busy={isPending}
          className={`${base} ${isPending ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
        >
          {isPending ? "Registering…" : hasError ? "Try again" : "Register for free"}
        </Button>
      ) : (
        <div className="flex gap-3">
          <DrawerClose asChild>
            <Button type="button" variant="outline" className="h-11 flex-1 rounded-lg">
              Close
            </Button>
          </DrawerClose>
          <Link to={event._id} className={`${base} flex-[2] bg-primary-main`}>
            Register
          </Link>
        </div>
      )}
      {hasError && !isPending && (
        <p role="alert" className="text-center text-[12px] text-red-600">
          Registration failed. Check your connection and try again.
        </p>
      )}
    </DrawerFooter>
  );
}

function EventDetails({ event }: { event: EventItem }) {
  const lowSpots = event.eventType !== "Free" && !isFull(event) && spotsLeft(event) <= 20;
  return (
    <>
      <div className="relative aspect-[16/9] max-h-[38dvh] w-full shrink-0 overflow-hidden bg-primary-main/5">
        {event.eventImage ? (
          <img src={event.eventImage} alt={event.eventTitle} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="shimmer h-full w-full" />
        )}
        <DrawerClose asChild>
          <button
            type="button"
            aria-label="Close"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur"
          >
            <X className="h-4 w-4" />
          </button>
        </DrawerClose>
      </div>

      <div className="shrink-0 px-4 py-3">
        <p className="text-[12px] tracking-wide text-primary/60">
          {format(new Date(event.eventDate), "EEE, MMM dd")} · {event.eventTime}
        </p>
        <DrawerTitle className="mt-0.5 line-clamp-2 font-main text-[18px] font-bold leading-tight text-primary">
          {event.eventTitle}
        </DrawerTitle>
        {lowSpots && (
          <p className="mt-1 text-[12px] font-medium text-amber-600">Only {spotsLeft(event)} spots left</p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
        <h3 className="mb-1 font-main text-[14px] font-semibold">About this event</h3>
        <DrawerDescription className="whitespace-pre-line font-grotesk text-[13px] leading-[19px] text-primary/70">
          {event.eventDescription}
        </DrawerDescription>
      </div>
    </>
  );
}

/* ───────────────────────── 6. Page ───────────────────────── */

function EventsPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useFetchAllEvents();
  const { data: registeredEvents } = useGetUserRegisteredEvents();
  const { data: user } = useAuthUser();

  const [selected, setSelected] = useState<EventItem | null>(null);
  const [open, setOpen] = useState(false);

  const { mutate: register, isPending, error, isSuccess } = useFreeEventRegistration(selected?._id);

  const events: EventItem[] = useMemo(() => data?.events ?? [], [data]);
  const { query, setQuery, filter, setFilter, counts, filtered, reset } = useEventFilters(events);

  const hasEvents = events.length > 0;
  const matchingEvent = registeredEvents?.find((r: RegisteredEvent) => r.eventId === selected?._id);
  const registered = Boolean(matchingEvent);

  useEffect(() => {
    if (!isSuccess) return;
    (async () => {
      await queryClient.invalidateQueries({ queryKey: ["userRegisteredEvents"] });
      await router.invalidate();
    })();
  }, [isSuccess, router]);

  const openEvent = (event: EventItem) => {
    setSelected(event);
    setOpen(true);
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      {/* Page: header + search + filters stay put, only the grid scrolls */}
      <div className="mx-auto flex h-[calc(100dvh-5rem)] max-w-6xl flex-col gap-3 px-4">
        <PageHeader loading={isLoading} count={counts.All} />

        {/* Search + filters only make sense when there is something to search */}
        {(isLoading || hasEvents) && (
          <>
            <SearchBar loading={isLoading} value={query} onChange={setQuery} />
            <FilterTabs loading={isLoading} active={filter} counts={counts} onChange={setFilter} />
          </>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto pb-4">
          {isLoading ? (
            <EventsSkeleton />
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : !hasEvents ? (
            <NoEventsYet onRefresh={() => refetch()} />
          ) : filtered.length === 0 ? (
            <EmptyState query={query} filter={filter} onReset={reset} />
          ) : (
            <EventGrid events={filtered} onSelect={openEvent} />
          )}
        </div>
      </div>

      {selected && (
        <DrawerContent className="flex h-[100dvh] w-full flex-col rounded-none bg-white p-0 lg:w-[40%] lg:min-w-[420px]">
          <Tabs value={registered ? "ticket" : "details"} className="flex min-h-0 flex-1 flex-col">
            <TabsContent value="details" className="m-0 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden">
              <EventDetails event={selected} />
            </TabsContent>

            <TabsContent value="ticket" className="m-0 min-h-0 flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <TicketComponent
                eventTitle={selected.eventTitle}
                eventDate={selected.eventDate}
                attendeeName={user?.fullName}
                qrValue={{ eventId: matchingEvent?._id, fullName: user?.fullName }}
                ticketId={matchingEvent?.reference ?? matchingEvent?.registrationCode}
                DrawerClose={DrawerClose}
              />
            </TabsContent>
          </Tabs>

          <EventFooter
            event={selected}
            registered={registered}
            isPending={isPending}
            hasError={Boolean(error)}
            onRegister={() => register()}
          />
        </DrawerContent>
      )}
    </Drawer>
  );
}