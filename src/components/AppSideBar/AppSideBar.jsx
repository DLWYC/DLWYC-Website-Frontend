
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Link, redirect, useLocation, useNavigate } from "@tanstack/react-router";
import MenuItems from "@/data/Dashboard";
import {SuperAdminMenuItems} from "@/data/Dashboard";
import { useState } from "react";
import { useEffect } from "react";
import {useAuth} from "@/lib/AuthContext"
import { toast } from "react-toastify";

// This is sample data.

const AppSidebar = () => {
  const [sideBarLinks, setSideBarLinks] = useState(MenuItems);
  const { pathname } = useLocation();
  const { logout } = useAuth()
    const navigate = useNavigate();
  

  
  // Get the SideBar NAVLINKS
  useEffect(()=>{
    if(pathname.startsWith('/userdashboard')){
      setSideBarLinks(MenuItems) 
    }
    else if(pathname.startsWith('/superadmin')){
      setSideBarLinks(SuperAdminMenuItems) 
    }
  }, [pathname])
  



  return (
    <Sidebar className="bg-[white]  z-[600] font-rubik">
      <SidebarHeader className="bg-white" >
          <img src="/main_logo.svg" alt="" />
      </SidebarHeader>
      <SidebarContent className='bg-[white] lg:text-white text-black pt-5'>
        {sideBarLinks.map((item, idx) => (
          <Link to={item.url} key={idx}>
            <SidebarGroup
              className={`${
                (pathname == item.url)
                  ? "bg-primary-main font-bolder"
                  : "font-[200]"
              } flex `}
            >
              <SidebarGroupLabel className={`${(pathname == item.url) ? 'text-white': ''} lg:w-[190px] flex items-center gap-6 text-[15px] `}>
                {item.icon && <item.icon />}
                {item.name}
              </SidebarGroupLabel>
            </SidebarGroup>
          </Link>
        ))}


      </SidebarContent>
      <SidebarRail />

      {/* Footer */}
      <SidebarFooter className="bg-white">
        <p className="text-[13px]">Developed By DLWYC</p>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;