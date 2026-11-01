import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import type { LoginRequest } from '@/types'

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      authService.setToken(response.token)
    },
  })
}

export const useLogout = () => {
  return () => {
    authService.logout()
    globalThis.location.href = '/login'
  }
}

export const useAuth = () => {
  const isAuthenticated = authService.isAuthenticated()

  return {
    isAuthenticated,
  }
}
