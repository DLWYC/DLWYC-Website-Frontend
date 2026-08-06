import { createLazyFileRoute, Link, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
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
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useFreeEventRegistration } from "@/features/dashboard/hooks/useRegisterEvents";
import { queryClient } from "@/main";

export const Route = createLazyFileRoute("/dashboard/events/")({
  component: EventComponent,
});

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

  //
  useEffect(() => {
    const refreshApp = async () => {
      if (isSuccess) {
        await queryClient.invalidateQueries(["userRegisteredEvents"]);

        await router.invalidate();
      }
    };
    refreshApp();
  }, [isSuccess, queryClient, router]);

  return (
    <Drawer direction="right">
      <div className="space-y-1">
        <p className="font-header text-lg px-4 font-semibold tracking-tight">
          All Events
        </p>
        <ScrollArea className="h-[55vh]">
          <div className="grid lg:grid-cols-2 gap-2">
            {data?.events.map((event: any) => (
              <DrawerTrigger
                key={event.eventTitle}
                onClick={() => setSelectedEvent(event)}
                className="cursor-pointer"
              >
                <EventCard events={event} />
              </DrawerTrigger>
            ))}
          </div>
        </ScrollArea>
      </div>

      {selectedEvent ? (
        <DrawerContent className="border border-red-500 h-full rounded-0 lg:w-[35%] bg-white gap-3 py-2 px-2">
          <DrawerClose asChild>
            <CircleX className="cursor-pointer" width={30} height={30} />
          </DrawerClose>

          <div className="h-full no-scrollbar overflow-y-auto space-y-2">
            <div className="relative w-full shrink-0 border-none shimmer overflow-hidden h-2/5 rounded-lg bg-primary-main/5">
              {selectedEvent?.eventImage ? (
                <img
                  src={`https://dlwyc-website-frontend-updated.vercel.app/assets/YOUTHHARVEST-BBDTPX8d.png`}
                  alt={""}
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
              /* Case A: Already Registered (Paid or Free) */
              <Link
                key={matchingEvent?._id}
                // to={`/ticket/${matchingEvent?._id}`}
                className="bg-reddish text-white text-center rounded-[5px] font-header text-[16px] py-2"
              >
                Show Code
              </Link>
            ) : selectedEvent?.eventType === "Free" ? (
              /* Case B: Not Registered & Event is Free */
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
            ) : (
              /* Case C: Not Registered & Event is Paid (or default) */
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
