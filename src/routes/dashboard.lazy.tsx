import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSideBar";
import { AppNavBar } from "@/components/AppNavBar";
import { cn } from "@/lib/utils";

export const Route = createLazyFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="px-1 bg-[#f4f6f9]">
      <SidebarProvider className="relative">
        <AppSidebar />
        <main className={cn("w-full px-1 py-2 overflow-auto space-y-2")}>
          <AppNavBar />
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
