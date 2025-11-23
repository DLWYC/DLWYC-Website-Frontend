import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import NavBar from '@/components/Nav_Bar/Nav_Bar'
import Footer from '@/components/Footer/Footer'

export const Route = createRootRoute({
  component: () => {
    const location = useLocation()
    return (
      <>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          {location.pathname.startsWith('/userdashboard') ||
          location.pathname.startsWith('/superadmin') ||
          location.pathname.startsWith('/registrationunit') ? null : (
            <NavBar />
          )}
          <Outlet />
          {location.pathname.startsWith('/userdashboard') ||
          location.pathname.startsWith('/superadmin') ||
          location.pathname.startsWith('/registrationunit') ? null : (
            <Footer />
          )}
        </GoogleOAuthProvider>
      </>
    )
  },
})
