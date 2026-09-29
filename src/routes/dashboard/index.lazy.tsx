// import { createLazyFileRoute } from "@tanstack/react-router";
// import Male from "@/assets/male.png";
// import Female from "@/assets/female.png";
// import { BellIcon, CalendarDays, LibraryBig } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { ChevronRightIcon } from "lucide-react";
// import {
//   Item,
//   ItemActions,
//   ItemContent,
//   ItemDescription,
//   ItemTitle,
// } from "@/components/ui/item";
// import { Separator } from "@/components/ui/separator";
// import { Calendar } from "@/components/ui/calendar";
// import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
// import { useGetDashboardStats } from "@/features/dashboard/hooks/useGetDashhboardStats";
// import { EventCard } from "@/components/Cards/EventCards";
// import { Link } from "@tanstack/react-router";
// import { Loader } from "@/components/Loader";
// import NotFound from "@/assets/notfound.png";

// export const Route = createLazyFileRoute("/dashboard/")({
//   component: RouteComponent,
// });

// function RouteComponent() {
//   const { data: user } = useAuthUser();
//   const { data: stats, isLoading: loadingStats } = useGetDashboardStats();

//   // 🟢 2. SAFEGUARD: Fallback if the fetch fails completely or returns null
//   if (!user) {
//     return <p className="text-red-500">Failed to load user profile.</p>;
//   }

//   return (
//     <div className="flex flex-col space-y-5">
//       {/* TopSection */}
//       <div className="flex gap-6 lg:flex-row flex-col justify-between ">
//         {/* {loadingUserDetails } */}
//         <div className="flex lg:w-[70%] rounded-[10px] h-[40vh] bg-white px-6 items-center relative">
//           <div className="space-y-3 ">
//             <h2 className="text-[34px] font-header mb-5">
//               Good Day, {user.fullName}
//             </h2>

//             <div className="flex gap-4 items-center wrap-normal">
//               <p className="font-header lg:text-[14px] text-[14px] font-normal">
//                 UniqueID:{" "}
//                 <span className="text-primary-main font-normal">
//                   {user.uniqueID}
//                 </span>
//               </p>
//               <p className="font-header lg:text-[14px] text-[14px] font-normal">
//                 Email:{" "}
//                 <span className="text-primary-main font-normal">
//                   {user.email}
//                 </span>
//               </p>
//             </div>
//           </div>

//           <img
//             src={user.gender == "Male" ? Male : Female}
//             alt="male avatar"
//             className="w-[35%] absolute object-cover right-0 z-40 -bottom-25"
//           />
//         </div>

//         <div className=" bg-[white] h-[40vh] lg:flex flex-col hidden w-[30%] py-3 px-3 rounded-[10px] space-y-3 ">
//           <div className="flex">
//             <p className="gap-2 flex font-rubik items-center text-[16px]">
//               {" "}
//               <BellIcon width={20} /> Notifications{" "}
//             </p>
//           </div>

//           <ScrollArea className="h-[30vh] w-full">
//             {[1, 2, 3, 4, 5, 6].map((key) => (
//               <Item variant="outline" className="p-1 mt-1 mb-1" key={key}>
//                 <ItemContent className="p-0">
//                   <ItemTitle className="font-header text-[14px]">
//                     Basic Item
//                   </ItemTitle>
//                   <ItemDescription className="font-grotesk text-[12px]  leading-4.25 tracking-[0.3px] font-light">
//                     A simple item with title and description.
//                   </ItemDescription>
//                 </ItemContent>
//                 <ItemActions>
//                   <ChevronRightIcon className="size-4" />
//                 </ItemActions>
//               </Item>
//             ))}
//           </ScrollArea>
//         </div>
//       </div>
//       {/* TopSection */}

//       {/* Second Section */}
//       <div className="rounded-[10px]  px-2 py-3 grid lg:grid-cols-3 gap-3">
//         <div className="rounded-[10px] bg-[#c5c2f4] lg:h-[30vh] h-[30vh] flex flex-col px-5 py-3 justify-end text-[black] gap-4 pb-3">
//           <CalendarDays />

//           <h2 className="text-[40px] font-header font-bold">
//             {loadingStats ? <Loader /> : stats?.totalEvents}
//           </h2>
//           <p className="font-grotesk text-[17px] leading-[21px] tracking-[0.3px] font-[500]">
//             Upcoming Events.
//           </p>
//         </div>

//         <div className="rounded-[10px] bg-[#f0c7c2] lg:h-[30vh] h-[30vh] flex flex-col px-5 py-3 justify-end text-[black] gap-4 pb-3">
//           <LibraryBig />

//           <h2 className="text-[40px] font-header font-bold">43</h2>
//           <p className="font-grotesk text-[17px] leading-[21px] tracking-[0.3px] font-[500]">
//             Resources.
//           </p>
//         </div>

//         <div className="rounded-[10px] bg-[#A0C6AD] lg:h-[30vh] h-[30vh]"></div>
//       </div>
//       {/* Second Section */}

//       {/* Events */}
//       <div className="rounded-[10px] lg:flex gap-3">
//         <div className="rounded-xl lg:w-[66%] p-4 bg-card ">
//           <div className="flex items-center justify-between mb-3">
//             <p className="font-header text-lg font-semibold tracking-tight">
//               Latest Events
//             </p>
//             <Link
//               className="text-xs text-muted-foreground border  cursor-pointer py-2 px-4 font-grotesk font-[400]"
//               to={"/dashboard/events"}
//             >
//               View all
//             </Link>
//           </div>

//           <Separator className="mb-3" />

//           <div className="flex flex-col gap-2">
//             {stats?.latestEvent?.length == 0 ? (
//               <div className="flex flex-col justify-center items-center h-[410px] space-y-5">
//                 <img
//                   src={NotFound}
//                   alt="No events found"
//                   className="w-[90px]"
//                 />
//                 <p className="text-primary-main font-rubik">
//                   No Event Currently
//                 </p>
//               </div>
//             ) : (
//               stats?.latestEvent.map((event: any) => (
//                 <EventCard events={event} key={event?.eventTitle} />
//               ))
//             )}
//           </div>
//         </div>

//         {/* Calendar */}
//         <div className="lg:w-[34%] lg:flex hidden">
//           <Calendar
//             mode="single"
//             selected={new Date()}
//             // onSelect={setSelectedDate}
//             className="rounded-lg border bg-white border-muted w-full"
//             captionLayout="dropdown"
//           />
//         </div>
//         {/* Calendar */}
//       </div>
//       {/* Events */}
//     </div>
//   );
// }

import { lazy, memo, Suspense, type ReactNode, useMemo } from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BedDouble, LibraryBig } from "lucide-react";

import Male from "@/assets/male.png";
import Female from "@/assets/female.png";
import NotFound from "@/assets/notfound.png";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { EventCalendar } from "@/components/EventCalendar";
import { EventCard } from "@/components/Cards/EventCards";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useGetDashboardStats } from "@/features/dashboard/hooks/useGetDashhboardStats";



export const Route = createLazyFileRoute("/dashboard/")({
  component: RouteComponent,
});

/* -------------------------------------------------------------------------- */
/*  Static data & helpers (module scope = created once)                       */
/* -------------------------------------------------------------------------- */

// TODO: replace with a real count from your stats endpoint.
const RESOURCES_COUNT = 43;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/* -------------------------------------------------------------------------- */
/*  Hero pieces                                                               */
/* -------------------------------------------------------------------------- */

const QuickCard = memo(function QuickCard({
  to,
  index,
  title,
  meta,
  className,
  children,
}: {
  to: string;
  index: string;
  title: string;
  meta: ReactNode;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to as any}
      className={`relative flex min-h-[220px] min-w-[140px] flex-1 flex-col overflow-hidden rounded-xl p-4 text-black outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 lg:min-h-[260px] ${className}`}
    >
      <span className="font-grotesk text-xs">{index}</span>
      <span className="mt-2 font-header text-lg font-medium leading-tight">
        {title}
      </span>
      <span className="mt-1 font-grotesk text-xs">{meta}</span>
      {children}
    </Link>
  );
});

function HeroSkeleton() {
  return (
    <div className="rounded-2xl bg-[#ece6d3] p-5 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-4 w-40 bg-black/10" />
          <Skeleton className="h-14 w-4/5 bg-black/10" />
          <Skeleton className="h-10 w-36 bg-black/10" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-[260px] flex-1 bg-black/10" />
          <Skeleton className="h-[260px] flex-1 bg-black/10" />
          <Skeleton className="h-[260px] flex-1 bg-black/10" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Events section pieces                                                     */
/* -------------------------------------------------------------------------- */

function EventSkeleton() {
  return (
    <div className="flex h-[196px] overflow-hidden rounded-xl border">
      <Skeleton className="hidden h-full w-[38%] rounded-none sm:block" />
      <div className="flex-1 space-y-3 p-4">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

function EmptyEvents() {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-4">
      <img
        src={NotFound}
        alt=""
        width={90}
        height={90}
        loading="lazy"
        decoding="async"
        className="w-[90px]"
      />
      <p className="font-rubik text-sm text-muted-foreground">
        No events right now. Check back soon.
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-xl border bg-card p-5"
    >
      <p className="text-sm text-destructive">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border px-3 py-1.5 font-grotesk text-xs hover:bg-muted"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Route component                                                           */
/* -------------------------------------------------------------------------- */

function RouteComponent() {
  const { data: user, isLoading: loadingUser } = useAuthUser();
  const {
    data: stats,
    isLoading: loadingStats,
    isError: statsError,
    refetch: refetchStats,
  } = useGetDashboardStats();

  const greeting = useMemo(getGreeting, []);
  const firstName = user?.fullName?.split(" ")[0];

  const latestEvents: any[] = stats?.latestEvent ?? [];
  const totalEvents: number = stats?.totalEvents ?? 0;
  const eventDates = useMemo(
  () => latestEvents.map((e) => e.eventDate ?? e.startDate ?? e.date),
  [latestEvents],
);

  const headline =
    totalEvents === 0
      ? "No upcoming events right now"
      : `You have ${totalEvents} upcoming ${totalEvents === 1 ? "event" : "events"}`;

  return (
    <div className="flex flex-col gap-4">
      {/* -------------------------------- Hero -------------------------------- */}
      {loadingUser ? (
        <HeroSkeleton />
      ) : !user ? (
        <ErrorState message="We couldn't load your profile. Refresh the page to try again." />
      ) : (
        <section className="rounded-2xl bg-[#ece6d3] p-5 text-black sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-6">
            {/* Left: greeting, headline, action */}
            <div className="flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <p className="font-grotesk text-sm">
                  {greeting}, {firstName}!
                </p>

                {loadingStats ? (
                  <Skeleton className="h-14 w-4/5 bg-black/10" />
                ) : (
                  <h1 className="max-w-[14ch] font-header text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
                    {headline}
                  </h1>
                )}

                <p className="font-grotesk text-xs text-black/70">
                  ID <span className="text-black">{user.uniqueID}</span>
                  <span className="mx-2">|</span>
                  <span className="break-all text-black">{user.email}</span>
                </p>
              </div>

              <Link
                to="/dashboard/events"
                className="inline-flex w-fit items-center gap-3 rounded-md bg-neutral-900 px-4 py-2.5 font-grotesk text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                View events
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>

            {/* Right: quick access cards */}
            <div className="flex gap-3 overflow-x-auto lg:overflow-visible">
              <QuickCard
                to="/dashboard/events"
                index="01"
                title="Events"
                meta={loadingStats ? "Loading" : `${totalEvents} upcoming`}
                className="bg-[#f6f2e7]"
              >
                <img
                  src={user.gender === "Male" ? Male : Female}
                  alt=""
                  width={160}
                  height={160}
                  fetchPriority="high"
                  decoding="async"
                  className="pointer-events-none absolute bottom-0 left-1/2 h-[52%] w-auto -translate-x-1/2 object-contain object-bottom"
                />
              </QuickCard>

              <QuickCard
                to="/dashboard/resources"
                index="02"
                title="Resources"
                meta={`${RESOURCES_COUNT} available`}
                className="bg-[#f7b924]"
              >
                <LibraryBig
                  className="pointer-events-none absolute bottom-4 left-1/2 size-24 -translate-x-1/2"
                  strokeWidth={1.25}
                  aria-hidden
                />
              </QuickCard>

              <QuickCard
                to="/dashboard/accommodation"
                index="03"
                title="Accommodation"
                meta="Find a place to stay"
                className="bg-[#a58ad8]"
              >
                <BedDouble
                  className="pointer-events-none absolute bottom-4 left-1/2 size-24 -translate-x-1/2"
                  strokeWidth={1.25}
                  aria-hidden
                />
              </QuickCard>
            </div>
          </div>
        </section>
      )}

      {/* ------------------------- Events + Calendar ------------------------- */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-header text-lg font-semibold tracking-tight">
              Latest events
            </h2>
            <Link
              to="/dashboard/events"
              className="rounded-md border px-4 py-2 font-grotesk text-xs text-muted-foreground transition-colors hover:bg-muted"
            >
              View all
            </Link>
          </div>

          <Separator className="mb-3" />

          <div className="flex flex-col gap-2">
            {loadingStats ? (
              <>
                <EventSkeleton />
                <EventSkeleton />
              </>
            ) : statsError ? (
              <ErrorState
                message="We couldn't load events."
                onRetry={() => refetchStats()}
              />
            ) : latestEvents.length === 0 ? (
              <EmptyEvents />
            ) : (
              latestEvents.map((event) => (
                <EventCard
                  events={event}
                  key={event._id ?? event.id ?? event.eventTitle}
                />
              ))
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <Suspense
            fallback={<Skeleton className="h-[360px] w-full rounded-xl" />}
          >
            {/* <Calendar
              mode="single"
              selected={today}
              className="w-full rounded-xl border bg-card"
              captionLayout="dropdown"
            /> */}
            {/* <div className="hidden lg:block"> */}
              <EventCalendar eventDates={eventDates} />
            {/* </div> */}
          </Suspense>
        </div>
      </section>
    </div>
  );
}
