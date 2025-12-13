
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import  AppSidebar  from  "@/components/AppSideBar/AppSideBar";
import { cn } from "@/lib/utils";
import UserDashboardTopNav from '@/components/AppTopNav/AppTopNav';
import { toast } from 'react-toastify';
import { useAuth } from '../lib/AuthContext';
import { useEffect } from 'react';



export const Route = createFileRoute('/userdashboard')({
  component: UserDashboard,
  beforeLoad: async()=>{
       const userToken = localStorage.getItem('token');
      if (!userToken) {
        toast.warn("Please Login To Access This Page")
        return redirect({ to: '/userlogin' });
    }
  }
  
})

function UserDashboard() {
  const {errorLoadingUserData} = useAuth()
  const navigate = useNavigate()
  
    useEffect(() => {
    if (errorLoadingUserData && errorLoadingUserData.message === 'INVALID_TOKEN' ) {
      toast.warning("Session Expired, Login Again");
      localStorage.removeItem("token")
      navigate({ to: '/userlogin' });
    }
  }, [errorLoadingUserData, navigate]);

  return (
     <div className="">

     <SidebarProvider className="relative">
          <AppSidebar/>
       <main
          className={cn(
            "relative bg-[#f4f7fa] w-full px-2"
          )}
        >
        <UserDashboardTopNav />
          <Outlet />
        </main>
        </SidebarProvider>
     </div>
  )
}
