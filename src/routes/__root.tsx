import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20">
      {/* Viewport for current active route matching */}
      <Outlet />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  )
}
