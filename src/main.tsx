import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // 🟢 Add this line
import { routeTree } from "./routeTree.gen";
import "./index.css";

// 1. 🟢 Create and EXPORT the global query engine
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevents automatic background refetching when users change browser tabs
      refetchOnWindowFocus: false,
      // Retries failed requests only once before throwing an error, instead of 3 times
      retry: 1,
    },
  },
});

// 2. 🟢 Create and EXPORT the global routing engine
export const router = createRouter({
  routeTree,
  context: {
    queryClient, // Makes the query engine accessible inside your router context
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 3. 🟢 Wrap your application with the Query Provider */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ queryClient }} />
    </QueryClientProvider>
  </React.StrictMode>,
);
