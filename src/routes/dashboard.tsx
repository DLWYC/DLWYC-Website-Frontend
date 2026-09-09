import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "@/config/api";

export const Route = createFileRoute("/dashboard")({
  loader: async ({ context }) => {
    // 1. Extract the incoming cookie header from your server runtime context
    // (Adjust the property match based on your exact TanStack Start context setup)
    const serverCookies = context.request?.headers.get("cookie") || context.ssrHeaders?.cookie;

    try {
      return await context.queryClient.ensureQueryData({
        queryKey: ["authUser"],
        queryFn: () => 
          api.get("/user/profile", {
            // 2. Explicitly inject the cookies for this isolated request context
            headers: {
              Cookie: serverCookies || "",
            },
          }).then((res) => res.data),
        staleTime: 5 * 60 * 1000, 
      });
    } catch (error) {
      throw redirect({ to: "/login" });
    }
  },
});
