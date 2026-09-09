import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { ToastContainer } from 'react-toastify'
import type { QueryClient } from '@tanstack/react-query' // 🟢 1. Import the type engine
import 'react-toastify/dist/ReactToastify.css'

// 🟢 2. Explicitly define what dependencies main.tsx passes into the router
interface MyRouterContext {
  queryClient: QueryClient
  request?: Request;
  ssrHeaders?: {cookie?: string}
}

// 🟢 3. Upgrade from 'createRootRoute' to 'createRootRouteWithContext'
export const Route = createRootRouteWithContext<MyRouterContext>()({
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
