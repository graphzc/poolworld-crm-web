import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { CustomerForm } from '@/components/customers/CustomerForm'
import { useCustomer, useUpdateCustomer } from '@/hooks/useCustomers'
import type { UpdateCustomerRequest } from '@/types'

export const Route = createFileRoute('/_authenticated/customers/$customerId/edit')({
  staticData: { breadcrumb: 'แก้ไข' },
  component: EditCustomerPage,
})

function EditCustomerPage() {
  const { customerId } = Route.useParams()
  const navigate = useNavigate()
  const { data: customer, isLoading } = useCustomer(customerId)
  const updateCustomer = useUpdateCustomer()

  const handleSubmit = async (data: UpdateCustomerRequest) => {
    await updateCustomer.mutateAsync({ id: customerId, data })
    navigate({ to: '/customers' })
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">กำลังโหลดข้อมูล...</span>
      </div>
    )
  }

  if (!customer) {
    return <div>ไม่พบข้อมูลลูกค้า</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">แก้ไขข้อมูลลูกค้า</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">อัปเดตข้อมูลลูกค้า</p>
      </div>

      <CustomerForm
        defaultValues={{
          name: customer.name,
          address: customer.address,
          tax_id: customer.tax_id,
          customer_type: customer.customer_type,
          services: customer.services,
        }}
        onSubmit={handleSubmit}
        isLoading={updateCustomer.isPending}
      />
    </div>
  )
}
