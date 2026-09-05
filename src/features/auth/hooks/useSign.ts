import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '@/config/api'
import { toast } from 'react-toastify'

interface RegisterCredentials {
  fullName: string
  email: string
  password: string
  phoneNumber: string
  gender: string
  archdeaconry: string
  parish: string
  age: string
  profilePicture?: string
  membershipType: string
}

export function useRegister() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const res = await api.post('/auth/signup', credentials)
      return res.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success(res.message ?? 'Account created successfully!')
      navigate({ to: '/dashboard' })
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.error?.error ||
        error?.response?.data?.message ||
        'Registration failed. Please try again.'
      toast.error(msg)
    },
  })
}