import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { cn } from "@/lib/utils";
import  AppSidebar  from  "@/components/AppSideBar/AppSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from 'react-toastify';


export const Route = createFileRoute('/registrationunit')({
  component: RegsitrationUnit,
  beforeLoad: async () =>{
    const registrationUnitToken = localStorage.getItem('registrationUnitToken');
      if (!registrationUnitToken) {
        toast.warn("Please Login To Access This Page")
        return redirect({ to: '/adminLogin' });
    }
  }
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

          <Outlet />
        </main>
        </SidebarProvider>
     </div>
  )
}  