import {
  ListTodo,
  User,
  UserRound,
  Settings as SettingsIcon,
  Home,
  History,
  CalendarClockIcon,
  LucideBell,
  MapPin as Pin,
  TimerIcon,
  FileText,
  UserCircle,
  Lock,
  Shield,
  Bell,
  Calendar as CalendarIcon,
  ChartArea as Chart,
  Building2,
} from "lucide-react";

const MenuItems = [
  { name: "Home", icon: Home, url: '/userdashboard' },
  { name: "Payment History", icon: User, url: '/userdashboard/payments' },
  { name: "Hostel Allocation", icon: Building2, url: '/userdashboard/hostelallocation' },
];

const SuperAdminMenuItems = [
  { name: "Dashboard", icon: Chart, url: '/superadmin' },
  { name: "Events", icon: CalendarIcon, url: '/superadmin/events' },
];

const userDashboardTopMenu = [
  { name: "My Account", icon: UserRound, url: '/userdashboard/profile' },
  { name: "Settings", icon: SettingsIcon, url: '/userdashboard/profile' },
]


const DashboardCards = [
  { text: "Upcoming", icon: CalendarClockIcon, number: 3, IconColor: "#2563EB" },
  { text: "Registered", icon: History, number: 5, IconColor: "#10B981" },
]

const SuperAdminDashboardCards = [
  { text: "Total Events", icon: CalendarClockIcon, number: 3, IconColor: "#2563EB" },
  { text: "Total Registrations", icon: History, number: 5, IconColor: "#10B981" },
  { text: "Revenue", icon: LucideBell, number: 10, IconColor: "#F59E0B" },
]

const Events = [
  { text: "2025 Diocesan Youth Harvest ", eventDateIcon: CalendarClockIcon, eventDate: "15/12/25", locationIcon: Pin, location: "City Of God, Iyana Ipaja", timeIcon: TimerIcon, time: "10:00am - 4:00pm", registrationStatus: "Registered", date: new Date(2025, 8, 2) },
  { text: "2025 Diocesan Youth Camp", eventDateIcon: CalendarClockIcon, eventDate: "15/12/25", locationIcon: Pin, location: "Camp Site, Epe", timeIcon: TimerIcon, time: "10:00am - 4:00pm", registrationStatus: "Not Registered", date: new Date(2025, 8, 5) },
  { text: "Notification", eventDateIcon: CalendarClockIcon, eventDate: "15/12/25", locationIcon: Pin, location: "Camp Site, Epe", timeIcon: TimerIcon, time: "10:00am - 4:00pm", registrationStatus: "Pending", date: new Date(2025, 8, 7) },
]


const documentTypes = [
  'Driver License',
  'Passport',
  'National ID',
  'Birth Certificate',
  'Utility Bill',
  'Bank Statement',
  'Other'
];

const sidebarItems = [
  { id: 'profile', label: 'Profile Overview', icon: UserCircle },
  { id: 'password', label: 'Change Password', icon: Lock },
  // { id: 'documents', label: 'Documents', icon: FileText },
  // { id: 'notifications', label: 'Email Settings', icon: Bell },
  // { id: 'security', label: 'Security Settings', icon: Shield },
];

export { userDashboardTopMenu, Events, DashboardCards, documentTypes, sidebarItems, SuperAdminMenuItems, SuperAdminDashboardCards }
export default MenuItems 
