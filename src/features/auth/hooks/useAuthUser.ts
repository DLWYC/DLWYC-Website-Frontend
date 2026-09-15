import { useQuery } from "@tanstack/react-query";
import { api } from "@/config/api";

export function useAuthUser() {
     return useQuery({
          queryKey: ["authUser"],
          queryFn: async()=>{
               const user = await api.get('/user/profile')
               return user.data
          },
          staleTime: Infinity,
          retry: false,
     })
}