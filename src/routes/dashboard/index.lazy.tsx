import { useMemo } from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { BedDouble, Users } from "lucide-react";

import NotFound from "@/assets/notfound.png";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { EventCard } from "@/components/Cards/EventCards";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useGetDashboardStats } from "@/features/dashboard/hooks/useGetDashhboardStats";

export const Route = createLazyFileRoute("/dashboard/")({
  component: RouteComponent,
});


const NOT_AVAILABLE = "Not available";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Returns the value, or a fallback label when empty. */
const orFallback = (v: unknown, fallback = NOT_AVAILABLE) =>
  v === null || v === undefined || String(v).trim() === "" ? fallback : String(v);


function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl  bg-white p-4 sm:p-5 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-header text-lg font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      <Separator className="mb-4" />
      {children}
    </section>
  );
}

function Field({ label, value, soon }: { label: string; value?: unknown; soon?: boolean }) {
  const empty = value === null || value === undefined || String(value).trim() === "";
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {empty ? (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            soon ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground"
          }`}
        >
          {soon ? "Coming soon" : NOT_AVAILABLE}
        </span>
      ) : (
        <span className="text-right font-medium">{String(value)}</span>
      )}
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="space-y-3 bg-primary rounded-lg p-2 sm:p-4">
      <Skeleton className="h-10 w-2/3 sm:h-12" />
      <Skeleton className="h-4 w-full max-w-md" />
    </div>
  );
}

function EventSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex h-30 overflow-hidden rounded-xl ">
          <Skeleton className="hidden h-full w-[32%] rounded-none sm:block" />
          <div className="flex-1 space-y-3 p-4">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  );
}

function EmptyEvents() {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center gap-4">
      <img src={NotFound} alt="" width={90} height={90} loading="lazy" className="w-22.5" />
      <p className="text-sm text-muted-foreground">No events right now. Check back soon.</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-xl  bg-card p-5">
      <p className="text-sm text-destructive">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md  px-3 py-1.5 text-xs hover:bg-muted"
        >
          Try again
        </button>
      )}
    </div>
  );
}


function FamilyCard({ family, loading }: { family?: any; loading: boolean }) {
  return (
    <Panel title="Your camp family">
      {loading ? (
        <InfoCardSkeleton />
      ) : (
        <>
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-primary p-4 text-white">
            <Users className="size-6 shrink-0" aria-hidden />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">
                {orFallback(family?.name, "Not assigned yet")}
              </p>
              <p className="text-xs text-white/70">
                {family?.name ? "You belong to this family" : "Family placement is coming soon"}
              </p>
            </div>
          </div>
          <Field label="Family leader" value={family?.leader} soon />
          <Field label="Members" value={family?.memberCount} soon />
        </>
      )}
    </Panel>
  );
}

function HostelCard({ hostel, loading }: { hostel?: any; loading: boolean }) {
  return (
    <Panel title="Your hostel">
      {loading ? (
        <InfoCardSkeleton />
      ) : (
        <>
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-amber-100 p-4 text-amber-950">
            <BedDouble className="size-6 shrink-0" aria-hidden />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">
                {orFallback(hostel?.name, "Not assigned yet")}
              </p>
              <p className="text-xs text-amber-900/70">
                {hostel?.room ? `Room ${hostel.room}` : "Room allocation is coming soon"}
              </p>
            </div>
          </div>
          <Field label="Room number" value={hostel?.room} soon />
          <Field label="Bed space" value={hostel?.bed} soon />
          <Field label="Block / floor" value={hostel?.block} soon />
        </>
      )}
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*  Route                                                                     */
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

  // Adjust these keys to whatever your stats endpoint returns.
  const family = stats?.family;
  const hostel = stats?.hostel;

  return (
    <div className="flex flex-col gap-4 font-header">
      {/* ------------------------------- Hero ------------------------------- */}
      {loadingUser ? (
        <HeroSkeleton />
      ) : !user ? (
        <ErrorState message="We couldn't load your profile. Refresh the page to try again." />
      ) : (
        <section className="rounded-2xl bg-primary p-5 text-white sm:p-8">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {greeting}, {firstName ?? "friend"}!
          </h1>
          <p className="mt-1 text-sm text-white/70">Here's everything you need for camp.</p>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-white/60">Unique ID</dt>
              <dd className="font-medium">{orFallback(user.uniqueID)}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-white/60">Email</dt>
              <dd className="break-all font-medium">{orFallback(user.email)}</dd>
            </div>
          </dl>
        </section>
      )}

      {/* ---------------------- Family + Hostel ---------------------- */}
      

      {/* ------------------------ Events + Calendar ------------------------ */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Latest events"
          className="lg:col-span-2"
          action={
            <Link
              to="/dashboard/events"
              className="rounded-md  px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted"
            >
              View all
            </Link>
          }
        >
          {loadingStats ? (
            <EventSkeleton />
          ) : statsError ? (
            <ErrorState message="We couldn't load events." onRetry={() => refetchStats()} />
          ) : latestEvents.length === 0 ? (
            <EmptyEvents />
          ) : (
            // The height MUST be set on ScrollArea (fixed or max) so the viewport can overflow.
              <div className="flex flex-col gap-3 pr-4">
                {latestEvents.map((event) => (
                  <Link to={'/dashboard/events'}>
                  <EventCard
                    events={event}
                    key={event._id ?? event.id ?? event.eventTitle}
                    />
                    </Link>
                ))}
              </div>
          )}
        </Panel>

       <div className="grid gap-4 md:grid-cols-1">
        <FamilyCard family={family} loading={loadingStats} />
        <HostelCard hostel={hostel} loading={loadingStats} />
      </div>

      </div>
    </div>
  );
}