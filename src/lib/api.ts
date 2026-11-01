import axios from 'axios'
import { config } from '@/config'
import { handleApiError, isAuthError, isNetworkError } from '@/lib/errors'

export const api = axios.create({
  baseURL: `${config.apiUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (isAuthError(error)) {
      localStorage.removeItem('token')
      globalThis.location.href = '/login'
    }

    // Handle network errors
    if (isNetworkError(error)) {
      console.error('Network error:', error)
    }

    // Transform error to ApiError
    const apiError = handleApiError(error)
    return Promise.reject(apiError)
  }
)
