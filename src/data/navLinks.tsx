import {
  CalendarDays,
  Wallet,
  BedDouble,
  House,
  BookOpen,
  UserRound,
  Ticket,
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
    title: "Manage Codes",
    url: "/dashboard/codes",
    icon: Ticket,
  },
  {
    title: "Wallets",
    url: "/dashboard/wallets",
    icon: Wallet,
  },
  {
    title: "Accomodation",
    url: "/dashboard/accomodation",
    icon: BedDouble,
  },
  {
    title: "Resources",
    url: "/dashboard/resources",
    icon: BookOpen,
  },
];

export const userDashboardTopMenu = [
  { name: "My Account", icon: UserRound, url: '/userdashboard/profile' },
  // { name: "Settings", icon: SettingsIcon, url: '/userdashboard/profile' },
]