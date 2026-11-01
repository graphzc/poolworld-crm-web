import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SimpleSelect } from '@/components/ui/simple-select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  Users,
  Plus,
  Edit,
  Trash2,
  Building2,
  User,
  Package,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useCustomers, useDeleteCustomer } from '@/hooks/useCustomers'
import type { CustomerQueryParams } from '@/types'
import { SERVICE_MAP } from '@/lib/constants'

export const Route = createFileRoute('/_authenticated/customers/')({
  staticData: { breadcrumb: 'จัดการลูกค้า' },
  component: CustomersPage,
})

function CustomersPage() {
  const navigate = useNavigate()
  const [params, setParams] = useState<CustomerQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    customerType: '',
  })

  const { data, isLoading } = useCustomers(params)
  const deleteCustomer = useDeleteCustomer()

  const customers = data?.data || []
  const total = data?.total || 0
  const totalPages = data?.totalPages || 0

  const handleSearch = (value: string) => {
    setParams({ ...params, search: value, page: 1 })
  }

  const handleFilterChange = (customerType: string) => {
    setParams({
      ...params,
      customerType: customerType as CustomerQueryParams['customerType'],
      page: 1,
    })
  }

  const handleSortChange = (sortBy: string) => {
    const newSortOrder = params.sortBy === sortBy && params.sortOrder === 'asc' ? 'desc' : 'asc'
    setParams({ ...params, sortBy, sortOrder: newSortOrder })
  }

  const handlePageChange = (newPage: number) => {
    setParams({ ...params, page: newPage })
  }

  const handleDelete = async (id: string) => {
    if (confirm('⚠️ คุณต้องการลบลูกค้ารายนี้หรือไม่? ข้อมูลการดูแลสระว่ายน้ำและรายงานทั้งหมดของลูกค้ารายนี้จะถูกลบด้วย การลบจะไม่สามารถย้อนกลับได้')) {
      await deleteCustomer.mutateAsync(id)
    }
  }

  if (isLoading && params.page === 1) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">กำลังโหลดข้อมูล...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการลูกค้า</h1>
          <p className="text-muted-foreground mt-1">รายการลูกค้าทั้งหมด {total} รายการ</p>
        </div>
        <Button
          onClick={() => navigate({ to: '/customers/new' })}
          size="default"
          className="font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มลูกค้าใหม่
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาชื่อ, ที่อยู่, หรือเลขภาษี..."
                  value={params.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <SimpleSelect
              value={params.customerType}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="">ประเภททั้งหมด</option>
              <option value="Tax">มีภาษี</option>
              <option value="Non-Tax">ไม่มีภาษี</option>
            </SimpleSelect>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="font-semibold cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSortChange('name')}
                >
                  ชื่อลูกค้า {params.sortBy === 'name' && (params.sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="font-semibold">ที่อยู่</TableHead>
                <TableHead className="font-semibold">ประเภท</TableHead>
                <TableHead className="font-semibold">บริการ</TableHead>
                <TableHead className="font-semibold w-[180px]">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!customers || customers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-16"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Users className="h-12 w-12 text-muted-foreground" />
                      <p className="text-lg font-semibold">ไม่พบข้อมูลลูกค้า</p>
                      <p className="text-sm text-muted-foreground">
                        {params.search || params.customerType
                          ? 'ลองเปลี่ยนตัวกรองหรือคำค้นหา'
                          : 'เริ่มต้นโดยการเพิ่มลูกค้าใหม่'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <Link
                          to="/customers/$customerId"
                          params={{ customerId: customer.id }}
                          className="font-semibold text-base hover:text-primary hover:underline"
                        >
                          {customer.name}
                        </Link>
                        {customer.tax_id && (
                          <span className="text-xs text-muted-foreground">
                            เลขภาษี: {customer.tax_id}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm line-clamp-2 max-w-xs">
                        {customer.address || (
                          <span className="text-muted-foreground italic">ไม่ระบุ</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={customer.customer_type === 'Tax' ? 'secondary' : 'outline'}
                        className="font-medium"
                      >
                        {customer.customer_type === 'Tax' ? (
                          <>
                            <Building2 className="mr-1 h-3 w-3" />
                            มีภาษี
                          </>
                        ) : (
                          <>
                            <User className="mr-1 h-3 w-3" />
                            ไม่มีภาษี
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {customer.services.map((service, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="font-normal"
                          >
                            <Package className="mr-1 h-3 w-3" />
                            {SERVICE_MAP[service] || service}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                        >
                          <Link
                            to="/customers/$customerId/edit"
                            params={{ customerId: customer.id }}
                          >
                            <Edit className="mr-1 h-3.5 w-3.5" />
                            แก้ไข
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(customer.id)}
                          disabled={deleteCustomer.isPending}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          ลบ
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            หน้า {params.page} จาก {totalPages} (รวม {total} รายการ)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(params.page! - 1)}
              disabled={params.page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              ก่อนหน้า
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(params.page! + 1)}
              disabled={params.page === totalPages || isLoading}
            >
              ถัดไป
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
