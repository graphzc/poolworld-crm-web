import { api } from '@/lib/api'
import type { LoginRequest, LoginResponse } from '@/types'

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', data)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
  },

  getToken: (): string | null => {
    return localStorage.getItem('token')
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token)
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token')
  },
}
