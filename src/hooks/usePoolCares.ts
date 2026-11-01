import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { poolCareService } from '@/services/poolCareService'
import type { CreatePoolCareRequest, UpdatePoolCareRequest, PoolCareQueryParams } from '@/types'
import { toast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/errors'

const QUERY_KEY = 'poolcares'

export const usePoolCares = (params?: PoolCareQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => poolCareService.getAll(params),
    placeholderData: keepPreviousData,
  })
}

export const useAllPoolCares = () => {
  return useQuery({
    queryKey: [QUERY_KEY, 'all'],
    queryFn: () => poolCareService.getAllPages(),
  })
}

export const usePoolCare = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => poolCareService.getById(id),
    enabled: !!id,
  })
}

export const usePoolCaresByCustomer = (customerId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'customer', customerId],
    queryFn: () => poolCareService.getByCustomerId(customerId),
    enabled: !!customerId,
  })
}

export const useCreatePoolCare = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePoolCareRequest) => poolCareService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast({
        variant: 'success',
        title: 'สำเร็จ',
        description: 'เพิ่มข้อมูลการดูแลสระว่ายน้ำเรียบร้อยแล้ว',
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

export const useUpdatePoolCare = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePoolCareRequest }) =>
      poolCareService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast({
        variant: 'success',
        title: 'สำเร็จ',
        description: 'อัปเดตข้อมูลการดูแลสระว่ายน้ำเรียบร้อยแล้ว',
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

export const useDeletePoolCare = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => poolCareService.delete(id),
    onSuccess: () => {
      // Backend cascades the delete to the pool care's reports
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['poolcare-reports'] })
      toast({
        variant: 'success',
        title: 'สำเร็จ',
        description: 'ลบข้อมูลการดูแลสระว่ายน้ำเรียบร้อยแล้ว',
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
