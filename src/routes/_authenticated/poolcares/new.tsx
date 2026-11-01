import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCreatePoolCare } from '@/hooks/usePoolCares'
import { useCustomers } from '@/hooks/useCustomers'
import { PoolCareForm } from '@/components/poolcare/PoolCareForm'
import { Loader2 } from 'lucide-react'
import type { CreatePoolCareRequest } from '@/types'

interface NewPoolCareSearch {
  customerId?: string
}

export const Route = createFileRoute('/_authenticated/poolcares/new')({
  staticData: { breadcrumb: 'เพิ่มการดูแลสระว่ายน้ำ' },
  validateSearch: (search: Record<string, unknown>): NewPoolCareSearch => ({
    customerId: typeof search.customerId === 'string' ? search.customerId : undefined,
  }),
  component: NewPoolCarePage,
})

function NewPoolCarePage() {
  const navigate = useNavigate()
  const { customerId } = Route.useSearch()
  const { mutate: createPoolCare, isPending } = useCreatePoolCare()
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({
    page: 1,
    limit: 1000,
  })

  const handleSubmit = (data: CreatePoolCareRequest) => {
    createPoolCare(data, {
      onSuccess: () => {
        navigate({ to: '/poolcares' })
      },
    })
  }

  if (isLoadingCustomers) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">กำลังโหลดข้อมูล...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">เพิ่มการดูแลสระว่ายน้ำ</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">สร้างข้อมูลการดูแลสระว่ายน้ำใหม่</p>
      </div>

      <PoolCareForm
        customers={customersData?.data || []}
        defaultCustomerId={customerId}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </div>
  )
}
