import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { cn } from "@/lib/utils";
import  AppSidebar  from  "@/components/AppSideBar/AppSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from 'react-toastify';
import SuperAdminTopNav from '@/components/AppTopNav/SuperAdminTopNav';





export const Route = createFileRoute('/superadmin')({
  component: SuperDashboard,
})


function SuperDashboard() {
  const navigate = useNavigate()
  

  return (
     <div className="">

     <SidebarProvider className="relative">
          <AppSidebar/>
       <main
          className={cn(
            "relative bg-[#f4f7fa] w-full px-2"
          )}
        >
        <SuperAdminTopNav />

          <Outlet />
        </main>
        </SidebarProvider>
     </div>
  )
}