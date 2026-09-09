import { createLazyFileRoute, Link, useRouter } from "@tanstack/react-router";
import { format, isToday } from "date-fns";
import { EventCard } from "@/components/Cards/EventCards";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  useFetchAllEvents,
  useGetUserRegisteredEvents,
} from "@/features/dashboard/hooks/useFetchEvents";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CircleX, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useFreeEventRegistration } from "@/features/dashboard/hooks/useRegisterEvents";
import { queryClient } from "@/main";

export const Route = createLazyFileRoute("/dashboard/events/")({
  component: EventComponent,
});

/**
 * Shape of an item inside `data.events` from useFetchAllEvents — this is
 * what actually flows into <EventCard />, distinct from the slimmer
 * `Event` shape returned by useGetUserRegisteredEvents further down.
 */
interface AllEventItem {
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

const FILTERS = ["All", "Free", "Paid", "Today"] as const;
type FilterValue = (typeof FILTERS)[number];

function EventComponent() {
  interface SelectedEvent {
    _id: String;
    eventTitle: String;
    eventDate: Date;
    eventLocation: String;
    eventTime: String;
    eventDescription: String;
    eventType: String;
    eventCapacity: Number;
    eventImage?: String;
    registeredCount: Number;
  }
  interface Event {
    _id: string;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventDescription: string;
    eventImage?: string;
  }

  const { data } = useFetchAllEvents();
  const { data: userRegisteredEvents } = useGetUserRegisteredEvents();
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(
    null,
  );
  const {
    mutate: register,
    isPending,
    error,
    isSuccess,
  } = useFreeEventRegistration(selectedEvent?._id);

  const isAlreadyRegistered = userRegisteredEvents?.some(
    (event: Event) => selectedEvent?._id === event?.eventId,
  );
  const matchingEvent = userRegisteredEvents?.find(
    (event: Event) => selectedEvent?._id === event?.eventId,
  );
  const router = useRouter();

  useEffect(() => {
    const refreshApp = async () => {
      if (isSuccess) {
        await queryClient.invalidateQueries({ queryKey: ["userRegisteredEvents"] });
        await router.invalidate();
      }
    };
    refreshApp();
  }, [isSuccess, queryClient, router]);

  // --- search / filter layer -------------------------------------------
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("All");

  const allEvents: AllEventItem[] = data?.events ?? [];

  const counts = useMemo(
    () => ({
      All: allEvents.length,
      Free: allEvents.filter((e) => e.eventType === "Free").length,
      Paid: allEvents.filter((e) => e.eventType === "Paid").length,
      Today: allEvents.filter((e) => isToday(new Date(e.eventDate))).length,
    }),
    [allEvents],
  );

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Today"
            ? isToday(new Date(event.eventDate))
            : event.eventType === filter;
      const matchesQuery = event.eventTitle
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [allEvents, query, filter]);

  const resetFilters = () => {
    setQuery("");
    setFilter("All");
  };

  return (
    <Drawer direction="right">
      <div className="space-y-4 px-4">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-header text-lg font-semibold tracking-tight text-primary-main">
              All Events
            </p>
            <p className="mt-1 font-grotesk text-[13px] text-primary-main/50">
              {counts.All} event{counts.All === 1 ? "" : "s"} available right now
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-full border border-primary-main/10 bg-white px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-primary-main/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events"
            className="w-full bg-transparent font-grotesk text-[13px] text-primary-main outline-none placeholder:text-primary-main/40"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              <X className="h-4 w-4 text-primary-main/40" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-5 font-grotesk text-[13px] text-primary-main/50">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`relative pb-1 transition-colors ${
                filter === f
                  ? "font-medium text-primary-main after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[2px] after:rounded-full after:bg-reddish after:content-['']"
                  : ""
              }`}
            >
              {f} <span className="text-[11px]">{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* List */}
        <ScrollArea className="h-[55vh]">
          {filteredEvents.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-primary-main/15 px-6 py-12 text-center">
              <p className="font-header text-[15px] font-semibold text-primary-main">
                No events match "{query}"
              </p>
              <p className="mt-1 font-grotesk text-[13px] text-primary-main/50">
                Try a different search term, or clear the {filter !== "All" ? `"${filter}" ` : ""}
                filter.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 font-grotesk text-[12px] font-medium text-reddish"
              >
                Reset search
              </button>
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {filteredEvents.map((event) => (
                <DrawerTrigger
                  key={event._id}
                  onClick={() => setSelectedEvent(event as unknown as SelectedEvent)}
                  className="cursor-pointer text-left"
                >
                  <EventCard events={event} />
                </DrawerTrigger>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {selectedEvent ? (
        <DrawerContent className="border border-red-500 h-full rounded-0 lg:w-[35%] w-[70%] bg-white gap-3 py-2 px-2">
          <DrawerClose asChild>
            <CircleX className="cursor-pointer" width={30} height={30} />
          </DrawerClose>

          <div className="h-full no-scrollbar overflow-y-auto space-y-2">
            <div className="relative w-full shrink-0 border-none shimmer overflow-hidden h-2/5 rounded-lg bg-primary-main/5">
              {selectedEvent?.eventImage ? (
                <img
                  src={selectedEvent?.eventImage}
                  alt={"harvest"}
                  className="h-full w-full border-none object-cover"
                />
              ) : null}
            </div>

            <DrawerHeader className="py-2 px-0">
              <DrawerTitle className="font-header text-[25px] py-0">
                {selectedEvent.eventTitle}
              </DrawerTitle>

              <div className="flex gap-3">
                <div className="px-3 py-1 flex flex-col items-center justify-center rounded-[5px] bg-reddish text-white">
                  <h2 className="font-grotesk text-[14px]">
                    {format(new Date(selectedEvent.eventDate), "MMM")}
                  </h2>
                  <h1 className="font-header text-[20px] font-[500]">
                    {" "}
                    {format(new Date(selectedEvent.eventDate), "dd")}
                  </h1>
                </div>

                <div className="w-full flex flex-col justify-end">
                  <h2 className="font-header font-bold text-[16px] text-primary-main">
                    {format(new Date(selectedEvent.eventDate), "EEEE")}
                  </h2>
                  <p className="font-grotesk text-primary-main/50 text-[13px] ">
                    10:30pm - 14:10pm
                  </p>
                </div>
              </div>
            </DrawerHeader>

            <DrawerTitle className="text-[15px] font-header ">
              About This Event
            </DrawerTitle>
            <DrawerDescription className="space-y-2 text-primary-main/50 text-[13px] leading-[18px] font-grotesk font-[400]">
              {selectedEvent.eventDescription}
            </DrawerDescription>
          </div>

          <DrawerFooter className="p-0">
            {isAlreadyRegistered ? (
              <Link
                key={matchingEvent?._id}
                to={`/`}
                className="bg-reddish text-white text-center rounded-[5px] font-header text-[16px] py-2"
              >
                Show Code
              </Link>
            ) : selectedEvent?.eventType === "Free" ? (
              <Button
                onClick={() => register()}
                disabled={isPending}
                className={`text-white text-center rounded-[5px] font-header text-[16px] py-2 transition-colors
      ${isPending ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}
      ${error ? "border-2 border-red-500" : ""}
    `}
              >
                {isPending
                  ? "Registering..."
                  : error
                    ? "Try Again"
                    : "Register"}
              </Button>
            ) : selectedEvent?.registeredCount === selectedEvent?.eventCapacity ? (
              <Link
                // disabled
                to={`${selectedEvent?._id}`}
                className="bg-gray-400 text-white text-center rounded-[5px] font-header text-[16px] py-2 cursor-pointer"
              >
                Event Full - Enter Code If Available
              </Link>
            ) : (
              <Link
                to={`${selectedEvent?._id}`}
                className="bg-primary-main text-white text-center rounded-[5px] font-header text-[16px] py-2"
              >
                Register
              </Link>
            )}
          </DrawerFooter>
        </DrawerContent>
      ) : null}
    </Drawer>
  );
}