import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Create the router instance with all configurations
export const router = createRouter({
  routeTree,
  context: undefined!,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}