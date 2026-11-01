import { AxiosError } from 'axios'

export interface ApiErrorResponse {
  message: string
  status?: number
}

export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500
    const message =
      error.response?.data?.message || error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
    const code = error.code

    // Map common HTTP status codes to Thai messages
    const statusMessages: Record<number, string> = {
      400: 'ข้อมูลที่ส่งมาไม่ถูกต้อง',
      401: 'ไม่มีสิทธิ์เข้าถึง กรุณาเข้าสู่ระบบใหม่',
      403: 'ไม่มีสิทธิ์ในการดำเนินการนี้',
      404: 'ไม่พบข้อมูลที่ต้องการ',
      409: 'ข้อมูลซ้ำซ้อนในระบบ',
      422: 'ข้อมูลไม่ถูกต้องตามรูปแบบที่กำหนด',
      500: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      503: 'ระบบไม่พร้อมใช้งานในขณะนี้',
    }

    // Use backend message if available, otherwise use status message or default
    const finalMessage = message !== error.message ? message : statusMessages[status] || message

    return new ApiError(finalMessage, status, code)
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500)
  }

  return new ApiError('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ', 500)
}

export const getErrorMessage = (error: unknown): string => {
  const apiError = handleApiError(error)
  return apiError.message
}

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response && (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED')
  }
  return false
}

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401
  }
  return false
}

export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 400 || error.response?.status === 422
  }
  return false
}

export const isNotFoundError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 404
  }
  return false
}
