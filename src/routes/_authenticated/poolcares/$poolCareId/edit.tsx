import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { usePoolCare, useUpdatePoolCare } from '@/hooks/usePoolCares'
import { useCustomers } from '@/hooks/useCustomers'
import { PoolCareForm } from '@/components/poolcare/PoolCareForm'
import { Loader2 } from 'lucide-react'
import type { UpdatePoolCareRequest } from '@/types'

export const Route = createFileRoute('/_authenticated/poolcares/$poolCareId/edit')({
  staticData: { breadcrumb: 'แก้ไข' },
  component: EditPoolCarePage,
})

function EditPoolCarePage() {
  const { poolCareId } = Route.useParams()
  const navigate = useNavigate()
  const { data: poolCare, isLoading } = usePoolCare(poolCareId)
  const { mutate: updatePoolCare, isPending } = useUpdatePoolCare()
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({
    page: 1,
    limit: 1000,
  })

  const handleSubmit = (data: UpdatePoolCareRequest) => {
    updatePoolCare(
      { id: poolCareId, data },
      {
        onSuccess: () => {
          navigate({ to: '/poolcares/$poolCareId', params: { poolCareId } })
        },
      }
    )
  }

  if (isLoading || isLoadingCustomers) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">กำลังโหลดข้อมูล...</span>
      </div>
    )
  }

  if (!poolCare) {
    return <div>ไม่พบข้อมูล</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">แก้ไขการดูแลสระว่ายน้ำ</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">อัปเดตข้อมูลการดูแลสระว่ายน้ำ</p>
      </div>

      <PoolCareForm
        poolCare={poolCare}
        customers={customersData?.data || []}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </div>
  )
}
