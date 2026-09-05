import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "@/config/api";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData({
        queryKey: ["authUser"],
        queryFn: () => api.get("/user/profile").then((res) => res.data),
        staleTime: 5 * 60 * 1000, 
      });
    } catch {
      throw redirect({ to: "/login" });
    }
  },
});
