import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import type { MyRouterContext } from "@/main";
import Footer from "@/components/Footer";

// 🟢 3. Upgrade from 'createRootRoute' to 'createRootRouteWithContext'
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20">
      {!location.pathname.includes("dashboard") &&
        location.pathname !== "/signup" &&
        location.pathname !== "/login" && <Navbar />}
      <Outlet />
      {!location.pathname.includes("dashboard") &&
        location.pathname !== "/signup" &&
        location.pathname !== "/login" && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}
