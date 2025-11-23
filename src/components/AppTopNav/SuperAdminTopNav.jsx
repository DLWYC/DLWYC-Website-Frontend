import {SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserProfileImage from '@/components/UserProfileImage/UserProfileImage'
import { useNavigate } from "@tanstack/react-router";
import {userDashboardTopMenu} from "@/data/Dashboard"
import { Power } from "lucide-react";
import {useAuth} from '@/lib/AuthContext'
import { toast } from "react-toastify";




const UserDashboardTopNav = () => {
     const {logout, userData} = useAuth()
     const navigate = useNavigate();

       const handleLogOut = async () =>{
           try{
             await logout()
             toast.info("Logout Successfully")
             navigate({to: '/userLogin'})
           }
           catch(err){
             toast.error("Error Logging Out")
           }
       }

     return (
          <div className="flex items-center justify-between border w-[100%] py-3 px-5 sticky bg-white top-0 z-[20] ">
          {/* Left Alignment */}
          <div className="left">
               <SidebarTrigger className="flex cursor-pointer" />
          </div>
          {/* Left Alignment */}

          {/* Right Alignment */}
               <div className="flex font-inter">
                    <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer">
                                        <UserProfileImage imageWidth={35} />

                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-white rounded-[5px] top-[10px] right-[20px] relative font-inter">
                    <DropdownMenuLabel>Profile</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                         <div className="flex items-center space-x-4">
                                             <UserProfileImage imageWidth={30} />
                              <div>
                                   <h2 className="text-[14px] font-[400] text-[#30373eff]">{userData?.fullName}</h2>
                                   <p className="text-[13px] font-[400] text-primary-main">{userData?.email}</p>
                              </div>
                         </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {userDashboardTopMenu.map((item, idx) => (
                         <DropdownMenuItem key={idx}> 
                              <a onClick={()=>navigate({to: item.url})} className="cursor-pointer w-full py-2 gap-3 flex items-center text-[13px]">
                              {item.icon && <item.icon />}
                              {item.name}</a>
                         </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />
        <div className="text-red-500 gap-3 cursor-pointer px-2 py-1.5 text-[15px]">
        <p className="flex items-center gap-3" onClick={handleLogOut}>

        <Power className="text-red-500 size-[16px]"/>
          Log out
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </p>
        </div>
                    </DropdownMenuContent>
                    </DropdownMenu>
               </div>
          {/* Right Alignment */}
          </div>
     )
}
export default UserDashboardTopNav;