import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { NavItems } from "@/data/navLinks";
import Logo from "@/assets/main_logo.svg";

export function AppSidebar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <Sidebar className="bg-[white]  ">
      <SidebarHeader>
        <img src={Logo} alt="Logo" />
      </SidebarHeader>

      <Separator orientation="horizontal" className="mt-3 mb-2" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="font-inter">
              {NavItems.map((link) => (
                <Link to={link.url} key={link.title}>
                  <SidebarMenuButton
                    className="text-primary-main/80 hover:bg-primary-main/10 hover:text-primary-main focus:bg-primary-main/10 focus:text-primary-main "
                    key={link.title}
                    isActive={pathname.endsWith(link.url)}
                  >
                    <link.icon className="ml-1" />
                    <span>{link.title}</span>
                  </SidebarMenuButton>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
