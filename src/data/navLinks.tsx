import {
  CalendarDays,
  Wallet,
  BedDouble,
  House,
  BookOpen,
  UserRound,
  type LucideIcon,
} from "lucide-react";


export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: NavSubItem[];
}

// Single source of truth for the sidebar's primary navigation.
// Add / remove / reorder items here — the component just renders whatever
// this array contains, so nothing needs to change in app-sidebar.tsx.
export const NavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: House,
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: CalendarDays,
  },
  {
    title: "Wallets",
    url: "/wallets",
    icon: Wallet,
  },
  {
    title: "Accomodation",
    url: "/accomodation",
    icon: BedDouble,
  },
  {
    title: "Resources",
    url: "/resources",
    icon: BookOpen,
  },
];

export const userDashboardTopMenu = [
  { name: "My Account", icon: UserRound, url: '/userdashboard/profile' },
  // { name: "Settings", icon: SettingsIcon, url: '/userdashboard/profile' },
]