import { api } from '@/lib/api'
import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerQueryParams,
  PaginatedCustomersResponse,
} from '@/types'

export const customerService = {
  getAll: async (params?: CustomerQueryParams): Promise<PaginatedCustomersResponse> => {
    const response = await api.get<PaginatedCustomersResponse>('/customers', {
      params,
    })
    return response.data
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`)
    return response.data
  },

  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', data)
    return response.data
  },

  update: async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
    const response = await api.put<Customer>(`/customers/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`)
  },
}
