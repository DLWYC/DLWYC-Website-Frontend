import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchUserQueryOptions } from "@/features/auth/hooks/useAuthUser";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context, location }) => {
    try {
      const user = await context.queryClient.ensureQueryData(
        fetchUserQueryOptions(),
      );
      console.log(`User Data: ${JSON.stringify(user)}`);
      console.log(`Context: ${JSON.stringify(context)}`); 

      if (!user) {
        throw redirect({
          to: "/login",
          search: { redirect: location.href },
        });
      }
    } catch (error) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(fetchUserQueryOptions());
  },
});
