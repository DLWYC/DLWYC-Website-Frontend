import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: LandingView,
});

function LandingView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Optimized Application Core
      </h1>
      <p className="text-muted-foreground max-w-md">
        Structured with pnpm, Oxlint, Tailwind v4, and file-based route
        splitting.
      </p>
      <Button asChild size="lg">
        <Link to="/dashboard">Enter Performance Panel</Link>
      </Button>
    </div>
  );
}
