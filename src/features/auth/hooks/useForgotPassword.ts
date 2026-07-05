import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '@/config/api'
import { toast } from 'react-toastify'

export function useForgotPassword() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      // 🍪 Axios automatically handles the cookie assignment returned here!
      const res = await api.post('/auth/forgotPassword', credentials)
      return res.data
    },
    onSuccess: (res) => {
      // 🧹 Wipe out any lingering cached queries from prior profiles
      queryClient.invalidateQueries({ queryKey: ['user'] })
      // toast.success(`${res.message}`)
      
      // 🚀 Instantly route into your dashboard area smoothly
     //  navigate({ to: '/login' })
    },
    onError: (error: any) => {
      toast.error(`Login Failed: ${error.errors.error} `)
    }
  })
}
