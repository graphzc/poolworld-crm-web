import { api } from '@/lib/api'
import { fetchAllPages, MAX_PAGE_SIZE } from '@/lib/pagination'
import type {
  PoolCare,
  CreatePoolCareRequest,
  UpdatePoolCareRequest,
  PoolCareQueryParams,
  PaginatedPoolCaresResponse,
} from '@/types'

export const poolCareService = {
  getAll: async (params?: PoolCareQueryParams): Promise<PaginatedPoolCaresResponse> => {
    const response = await api.get<PaginatedPoolCaresResponse>('/poolcares', { params })
    return response.data
  },

  getAllPages: (params?: Omit<PoolCareQueryParams, 'page' | 'limit'>): Promise<PoolCare[]> => {
    return fetchAllPages((page) => poolCareService.getAll({ ...params, page, limit: MAX_PAGE_SIZE }))
  },

  getById: async (id: string): Promise<PoolCare> => {
    const response = await api.get<PoolCare>(`/poolcares/${id}`)
    return response.data
  },

  getByCustomerId: async (customerId: string): Promise<PoolCare[]> => {
    const response = await api.get<PoolCare[]>(`/poolcares/customer/${customerId}`)
    return response.data
  },

  create: async (data: CreatePoolCareRequest): Promise<PoolCare> => {
    const response = await api.post<PoolCare>('/poolcares', data)
    return response.data
  },

  update: async (id: string, data: UpdatePoolCareRequest): Promise<PoolCare> => {
    const response = await api.put<PoolCare>(`/poolcares/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/poolcares/${id}`)
  },
}
