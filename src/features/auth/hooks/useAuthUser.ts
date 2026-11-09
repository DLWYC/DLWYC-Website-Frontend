import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/config/api";

export const fetchUserQueryOptions = () => {
  return queryOptions({
    queryKey: ["authUser"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      // console.log("TOKEIN: ", token)
      const user = await api.get("/user/profile", {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      // console.log("USER: ", user)
      return user.data;
    },
    staleTime: Infinity,
    retry: false,
  });
};

export function useAuthUser() {
  return useQuery(fetchUserQueryOptions());
}
