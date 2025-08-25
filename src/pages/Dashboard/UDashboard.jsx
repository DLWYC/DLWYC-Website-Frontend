import { useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

export default function UDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 text-2xl font-bold text-blue-600 border-b">
          MyApp
        </div>
        <nav className="flex-1 p-4 space-y-3">
          <a
            href="#"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 text-gray-700"
          >
            <Home size={20} /> Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 text-gray-700"
          >
            <User size={20} /> Profile
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 text-gray-700"
          >
            <Settings size={20} /> Settings
          </a>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 m-4 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="border-none outline-none bg-transparent"
            />
          </div>
          <div className="flex items-center gap-6">
            <Bell size={22} className="text-gray-600 cursor-pointer" />
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="flex-1 p-6 grid grid-cols-3 gap-6">
          {/* Example Cards */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Stats</h3>
            <p className="text-gray-600 mt-2">Your overview goes here.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Activity</h3>
            <p className="text-gray-600 mt-2">Recent updates displayed here.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <p className="text-gray-600 mt-2">Alerts will appear here.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
