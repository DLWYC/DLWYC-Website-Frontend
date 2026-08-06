import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Power } from "lucide-react";
import { userDashboardTopMenu } from "@/data/navLinks";
import UserProfileImage from "./UserProfileImage";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import {handleLogout} from "@/config/api"

export function AppNavBar() {
  const {data: user} = useAuthUser()

  return (
    <div className="flex justify-between items-center sticky top-0 z-50 w-full bg-[#ffffff] px-1 py-2">
      <SidebarTrigger className="p-0" />

      {/*  */}
      <div className="flex items-center ">
        {" "}
        <div className="flex font-inter">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <UserProfileImage imageWidth={40} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white rounded-[5px] top-[10px] right-[30px] relative font-inter">
              <DropdownMenuLabel>Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <div className="flex items-center space-x-4">
                  <UserProfileImage imageWidth={40} />
                  <div>
                    <h2 className="text-[14px] font-normal text-[#30373eff]">
                      {user.fullName}
                    </h2>
                    <p className="text-[13px] font-normal text-primary-main">
                      {user.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {userDashboardTopMenu.map((item, idx) => (
                <DropdownMenuItem key={idx}>
                  <a className="cursor-pointer w-full py-2 gap-3 flex items-center text-[13px]">
                    {item.icon && <item.icon />}
                    {item.name}
                  </a>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <div className="text-red-500 gap-3 cursor-pointer px-2 py-1.5 text-[15px]">
                <p className="flex items-center gap-3" onClick={()=> handleLogout()}>
                  <Power className="text-red-500 size-4" />
                  Log out
                  {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/*  */}
    </div>
  );
}
