import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerService } from '@/services/customerService'
import type { CreateCustomerRequest, UpdateCustomerRequest, CustomerQueryParams } from '@/types'
import { toast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/errors'

const QUERY_KEY = 'customers'

export const useCustomers = (params?: CustomerQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => customerService.getAll(params),
  })
}

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  })
}

export const useCreateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => customerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast({
        variant: 'success',
        title: 'สำเร็จ',
        description: 'เพิ่มข้อมูลลูกค้าเรียบร้อยแล้ว',
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

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) =>
      customerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast({
        variant: 'success',
        title: 'สำเร็จ',
        description: 'แก้ไขข้อมูลลูกค้าเรียบร้อยแล้ว',
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

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => {
      // Backend cascades the delete to pool cares and their reports
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['poolcares'] })
      queryClient.invalidateQueries({ queryKey: ['poolcare-reports'] })
      toast({
        variant: 'success',
        title: 'สำเร็จ',
        description: 'ลบข้อมูลลูกค้าเรียบร้อยแล้ว',
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
