import { useQuery } from "@tanstack/react-query";
import { api } from "@/config/api";

export function useGetDashboardStats(){

     return useQuery({
          queryKey:  ['userDashboardStats'],
          queryFn: async () =>{
               const res = await api.get('/user/stats')
               return res.data
          }
     })
}