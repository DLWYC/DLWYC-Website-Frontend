import { useState } from "react";
import { Menu, X, Calendar as CalendarIcon, ListTodo, User, Clock } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function UDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const menuItems = [
    { name: "Calendar", icon: <CalendarIcon className="w-5 h-5" /> },
    { name: "Schedule", icon: <ListTodo className="w-5 h-5" /> },
    { name: "Profile", icon: <User className="w-5 h-5" /> },
  ];

  // Example schedule
  const activities = [
    { time: "08:00 AM", activity: "Morning Exercise", status: "Completed" },
    { time: "10:00 AM", activity: "Team Building", status: "Upcoming" },
    { time: "02:00 PM", activity: "Leadership Workshop", status: "Upcoming" },
    { time: "05:00 PM", activity: "Campfire Session", status: "Upcoming" },
  ];

  // Example chart data
  const attendanceData = [
    { day: "Mon", attendance: 20 },
    { day: "Tue", attendance: 25 },
    { day: "Wed", attendance: 22 },
    { day: "Thu", attendance: 27 },
    { day: "Fri", attendance: 30 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600">Camp Portal</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <a
                  href="#"
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-100"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white shadow-md p-4">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-gray-700">Welcome, Samuel 👋</h2>
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/40"
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
          
          {/* Calendar */}
          <div className="bg-white p-6 rounded-2xl shadow-md col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600" /> Calendar
            </h3>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="rounded-lg p-2"
            />
            <p className="mt-3 text-sm text-gray-500">
              Selected Date: <span className="font-medium">{selectedDate.toDateString()}</span>
            </p>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white p-6 rounded-2xl shadow-md col-span-1">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" /> Todays Schedule
            </h3>
            <ul className="space-y-3">
              {activities.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50"
                >
                  <span className="text-sm font-medium">{item.time}</span>
                  <span className="text-gray-700">{item.activity}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "Completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Attendance Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Weekly Attendance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <Bar dataKey="attendance" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Profile Info */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Profile Info</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Name:</span> Samuel Toluwani</p>
              <p><span className="font-medium">Camp Group:</span> Leadership Team</p>
              <p><span className="font-medium">Role:</span> Volunteer</p>
              <p><span className="font-medium">Joined:</span> Aug 2025</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
