import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '@/config/api'
import { toast } from 'react-toastify'

export function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      // 🍪 Axios automatically handles the cookie assignment returned here!
      const res = await api.post('/auth/login', credentials)
      return res.data
    },
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ['authUser'] })
      navigate({ to: '/dashboard' })
      toast.success(`${res.message}`)
      
    },
    onError: (error: any) => {
      toast.error(`Login Failed: ${error?.response?.data?.error}`)
    }
  })
}
