import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { poolCareReportService } from '@/services/poolCareReportService'
import type {
  CreatePoolCareReportRequest,
  BulkCreatePoolCareReportRequest,
  PoolCareReportQueryParams,
} from '@/types'
import { toast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/errors'

const QUERY_KEY = 'poolcare-reports'

export const usePoolCareReports = (params?: PoolCareReportQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => poolCareReportService.getAll(params),
    placeholderData: keepPreviousData,
  })
}

export const useAllPoolCareReports = (params: { year: number; month: number }) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'all', params],
    queryFn: () => poolCareReportService.getAllPages(params),
  })
}

export const usePoolCareReport = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => poolCareReportService.getById(id),
    enabled: !!id,
  })
}

export const useCreatePoolCareReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePoolCareReportRequest) => poolCareReportService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast({
        variant: 'success',
        title: 'สำเร็จ',
        description: 'สร้างรายงานการดูแลสระว่ายน้ำเรียบร้อยแล้ว',
      })
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: getErrorMessage(error),
      })
    },
  })
}

export const useBulkCreatePoolCareReports = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BulkCreatePoolCareReportRequest) => poolCareReportService.bulkCreate(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })

      if (data.failed > 0) {
        toast({
          variant: 'default',
          title: 'สร้างรายงานบางส่วนสำเร็จ',
          description: `สร้างสำเร็จ ${data.created} รายการ, ล้มเหลว ${data.failed} รายการ`,
        })
      } else {
        toast({
          variant: 'success',
          title: 'สำเร็จ',
          description: `สร้างรายงานสำเร็จทั้งหมด ${data.created} รายการ`,
        })
      }
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: getErrorMessage(error),
      })
    },
  })
}

export const useDeletePoolCareReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => poolCareReportService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast({
        variant: 'success',
        title: 'สำเร็จ',
        description: 'ลบรายงานการดูแลสระว่ายน้ำเรียบร้อยแล้ว',
      })
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: getErrorMessage(error),
      })
    },
  })
}
