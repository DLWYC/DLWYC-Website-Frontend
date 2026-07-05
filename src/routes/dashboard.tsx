import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "@/config/api";
import { queryClient } from "@/main";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData({
        queryKey: ["authUser"],
        queryFn: () => api.get("/user/profile").then((res) => res.data),
      });
    } catch {
      throw redirect({ to: "/login" });
    }
  },
});
