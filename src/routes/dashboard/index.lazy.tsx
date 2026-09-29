
import { memo, Suspense, type ReactNode, useMemo } from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays} from "lucide-react";

import Male from "@/assets/male.png";
import Female from "@/assets/female.png";
import NotFound from "@/assets/notfound.png";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { EventCard } from "@/components/Cards/EventCards";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useGetDashboardStats } from "@/features/dashboard/hooks/useGetDashhboardStats";
import { Calendar } from "@/components/ui/calendar";



export const Route = createLazyFileRoute("/dashboard/")({
  component: RouteComponent,
});

/* -------------------------------------------------------------------------- */
/*  Static data & helpers (module scope = created once)                       */
/* -------------------------------------------------------------------------- */

// TODO: replace with a real count from your stats endpoint.

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
  // index,
  // title,
  // meta,
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
      className={`relative flex min-h-[220px] min-w-[140px] flex-1 flex-col overflow-hidden rounded-xl p-4 text-black outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 lg:min-h-65 ${className}`}
    >
      <span className="font-grotesk text-xs"> <CalendarDays /> </span>
      {/* <span className="mt-2 font-header text-lg font-medium leading-tight">
        {title}
      </span>
      <span className="mt-1 font-grotesk text-xs ">{meta}</span> */}
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
          <Skeleton className="h-65 flex-1 bg-black/10" />
          <Skeleton className="h-65 flex-1 bg-black/10" />
          <Skeleton className="h-65 flex-1 bg-black/10" />
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
    <div className="flex min-h-65 flex-col items-center justify-center gap-4">
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
        <section className="rounded-2xl bg-[#fff] p-5 text-black sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-6">
            <div className="flex flex-col justify-between gap-8">
              <div className="space-y-4">
              
                {loadingStats ? (
                  <Skeleton className="h-14 w-4/5 bg-black/10" />
                ) : (
                  <h1 className=" font-header text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
                    {greeting}, {firstName}!
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
            
          </div>
        </section>
      )}

      {/* ------------------------- Events + Calendar ------------------------- */}
      
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-card p-4 lg:col-span-2">
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
             <Calendar
              mode="single"
              // selected={today}
              className="w-full rounded-xl bg-card"
              captionLayout="dropdown"
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
