import { api } from '@/lib/api'
import { fetchAllPages, MAX_PAGE_SIZE } from '@/lib/pagination'
import type {
  PoolCareReport,
  CreatePoolCareReportRequest,
  BulkCreatePoolCareReportRequest,
  BulkCreatePoolCareReportResponse,
  PoolCareReportQueryParams,
  PaginatedPoolCareReportsResponse,
} from '@/types'

export const poolCareReportService = {
  getAll: async (params?: PoolCareReportQueryParams): Promise<PaginatedPoolCareReportsResponse> => {
    const response = await api.get<PaginatedPoolCareReportsResponse>('/poolcare-reports', {
      params,
    })
    return response.data
  },

  getAllPages: (
    params?: Omit<PoolCareReportQueryParams, 'page' | 'limit'>
  ): Promise<PoolCareReport[]> => {
    return fetchAllPages((page) =>
      poolCareReportService.getAll({ ...params, page, limit: MAX_PAGE_SIZE })
    )
  },

  getById: async (id: string): Promise<PoolCareReport> => {
    const response = await api.get<PoolCareReport>(`/poolcare-reports/${id}`)
    return response.data
  },

  create: async (data: CreatePoolCareReportRequest): Promise<PoolCareReport> => {
    const response = await api.post<PoolCareReport>('/poolcare-reports', data)
    return response.data
  },

  bulkCreate: async (
    data: BulkCreatePoolCareReportRequest
  ): Promise<BulkCreatePoolCareReportResponse> => {
    const response = await api.post<BulkCreatePoolCareReportResponse>(
      '/poolcare-reports/bulk',
      data
    )
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/poolcare-reports/${id}`)
  },
}
