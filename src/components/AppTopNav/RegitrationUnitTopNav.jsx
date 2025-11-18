import {SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserProfileImage from '@/components/UserProfileImage/UserProfileImage'
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { Link } from "@tanstack/react-router";




const RegistrationUnitTopNav = () => {
     const navigate = useNavigate();

     return (
          <div className="flex items-center justify-between border w-[100%] py-3 px-5 sticky bg-white top-0 z-[20] ">
          {/* Left Alignment */}
          <div className="left">
               <p className="font-rubik font-bold text-primary-main text-[20px]">Registration Unit</p>
          </div>
          {/* Left Alignment */}



          {/* <div className="border border-orange-500">
               <Link to="/registrationunit">Check In</Link>
               <Link to='/registrationunit/ue'>View All</Link>
          </div> */}


         
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
                              <h2 className="text-[14px] font-[400] text-[#30373eff]">fullName</h2>
                              <p className="text-[13px] font-[400] text-primary-main">email</p>
                         </div>
                    </div>
               </DropdownMenuItem>
               <DropdownMenuSeparator />

                    {/* {userDashboardTopMenu.map((item, idx) => (
                         <DropdownMenuItem key={idx}> 
                              <a onClick={()=>navigate({to: item.url})} className="cursor-pointer w-full py-2 gap-3 flex items-center text-[13px]">
                              {item.icon && <item.icon />}
                              {item.name}</a>
                         </DropdownMenuItem>
                    ))} */}

                    <DropdownMenuSeparator />
        <div className="text-red-500 gap-3 cursor-pointer px-2 py-1.5 text-[15px]">
        <p className="flex items-center gap-3" 
     //    onClick={handleLogOut}
        >

        {/* <Power className="text-red-500 size-[16px]"/> */}
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
export default RegistrationUnitTopNav;