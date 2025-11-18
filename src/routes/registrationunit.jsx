import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { cn } from "@/lib/utils";
import  AppSidebar  from  "@/components/AppSideBar/AppSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from 'react-toastify';
import RegistrationUnitTopNav from '@/components/AppTopNav/RegitrationUnitTopNav';





export const Route = createFileRoute('/registrationunit')({
  component: RegsitrationUnit,
})


function RegsitrationUnit() {
  const navigate = useNavigate()
  

  return (
     <div className="">

     <SidebarProvider className="relative">
       <main
          className={cn(
            "relative bg-[#f4f7fa] w-full px-2"
          )}
        >
        <RegistrationUnitTopNav />

          <Outlet />
        </main>
        </SidebarProvider>
     </div>
  )
}  