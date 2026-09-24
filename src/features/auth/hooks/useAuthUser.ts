import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/config/api";

export const fetchUserQueryOptions = () => {
  return queryOptions({
    queryKey: ["authUser"],
    queryFn: async () => {
      const user = await api.get("/user/profile");
      return user.data;
    },
    staleTime: Infinity,
    retry: false,
  });
};

export function useAuthUser() {
  return useQuery(fetchUserQueryOptions());
}
