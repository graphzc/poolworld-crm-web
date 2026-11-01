import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CustomerForm } from '@/components/customers/CustomerForm'
import { useCreateCustomer } from '@/hooks/useCustomers'
import type { CreateCustomerRequest } from '@/types'

export const Route = createFileRoute('/_authenticated/customers/new')({
  staticData: { breadcrumb: 'เพิ่มลูกค้าใหม่' },
  component: NewCustomerPage,
})

function NewCustomerPage() {
  const navigate = useNavigate()
  const createCustomer = useCreateCustomer()

  const handleSubmit = async (data: CreateCustomerRequest) => {
    const customer = await createCustomer.mutateAsync(data)
    if (data.services.includes('POOL_CARE')) {
      navigate({ to: '/poolcares/new', search: { customerId: customer.id } })
      return
    }
    navigate({ to: '/customers' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">เพิ่มลูกค้าใหม่</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">สร้างข้อมูลลูกค้าใหม่</p>
      </div>

      <CustomerForm
        onSubmit={handleSubmit}
        isLoading={createCustomer.isPending}
      />
    </div>
  )
}
