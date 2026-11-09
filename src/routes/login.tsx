import { createFileRoute, redirect } from '@tanstack/react-router'
import { queryClient } from '@/main' // Pull in your global QueryClient instance

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    // 🧠 Check if TanStack Query already has a successfully authenticated user profile cached
    const cachedUser = queryClient.getQueryData(['authUser'])
    // 👮 GATEKEEPER TRIGGER: If a valid profile exists, bypass login entirely!
    if (cachedUser) {
      throw redirect({ to: '/dashboard' })
    }
  },
})
