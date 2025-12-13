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
import { Power } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";




const RegistrationUnitTopNav = () => {
     
          const queryClient = useQueryClient()

     const navigate = useNavigate();
       const logout = () => {
    localStorage.setItem('registrationUnitToken', '')
    queryClient.clear();
  }


       const handleLogOut = async () =>{
           try{
             await logout()
             toast.info("Logout Successfully")
             navigate({to: '/adminLogin'})
           }
           catch(err){
             toast.error("Error Logging Out")
           }
       }

     return (
          <div className="flex items-center justify-between border w-[100%] py-3 px-5 sticky bg-white top-0 z-[20] ">
          {/* Left Alignment */}
          <div className="left">
               <p className="font-rubik font-bold text-primary-main text-[20px]">Registration Unit</p>
          </div>
          {/* Left Alignment */}

         
          {/* Right Alignment */}
          <div className="flex font-inter">
           <p className="flex items-center gap-3 cursor-pointer" onClick={handleLogOut}>

        <Power className="text-red-500 size-[16px]"/>
          Log out
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </p>
        </div>
                   
               </div>

     )
}
export default RegistrationUnitTopNav;