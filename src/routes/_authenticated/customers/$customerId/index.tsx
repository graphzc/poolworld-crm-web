import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Loader2,
  ArrowLeft,
  Edit,
  User,
  MapPin,
  FileText,
  Building2,
  Users as UsersIcon,
  Package,
  Calendar,
  Trash2,
} from 'lucide-react'
import { useCustomer, useDeleteCustomer } from '@/hooks/useCustomers'
import { SERVICE_MAP } from '@/lib/constants'

export const Route = createFileRoute('/_authenticated/customers/$customerId/')({
  staticData: { breadcrumb: CustomerBreadcrumb },
  component: CustomerDetailPage,
})

function CustomerBreadcrumb({ params }: { params: Record<string, string> }) {
  const { data: customer } = useCustomer(params.customerId)
  return customer?.name ?? 'รายละเอียดลูกค้า'
}

function CustomerDetailPage() {
  const { customerId } = Route.useParams()
  const navigate = useNavigate()
  const { data: customer, isLoading } = useCustomer(customerId)
  const deleteCustomer = useDeleteCustomer()

  const handleDelete = async () => {
    if (confirm('⚠️ คุณต้องการลบลูกค้ารายนี้หรือไม่? ข้อมูลการดูแลสระว่ายน้ำและรายงานทั้งหมดของลูกค้ารายนี้จะถูกลบด้วย การลบจะไม่สามารถย้อนกลับได้')) {
      await deleteCustomer.mutateAsync(customerId)
      navigate({ to: '/customers' })
    }
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
    return (
      <div className="flex h-96 items-center justify-center flex-col space-y-4">
        <User className="h-16 w-16 text-muted-foreground" />
        <p className="text-lg font-semibold">ไม่พบข้อมูลลูกค้า</p>
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/customers' })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปหน้ารายการ
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
          <p className="text-muted-foreground mt-1">รายละเอียดข้อมูลลูกค้า</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleteCustomer.isPending}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            ลบ
          </Button>
          <Button asChild>
            <Link
              to="/customers/$customerId/edit"
              params={{ customerId }}
            >
              <Edit className="mr-2 h-4 w-4" />
              แก้ไข
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ข้อมูลพื้นฐาน */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              ข้อมูลพื้นฐาน
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ชื่อ-นามสกุล / ชื่อบริษัท</label>
              <p className="text-base font-semibold mt-1">{customer.name}</p>
            </div>

            {customer.address && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  ที่อยู่
                </label>
                <p className="text-base mt-1">{customer.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ข้อมูลภาษีและประเภท */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              ข้อมูลภาษีและประเภท
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ประเภทลูกค้า</label>
              <div className="mt-2">
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
              </div>
            </div>

            {customer.tax_id && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  เลขประจำตัวผู้เสียภาษี
                </label>
                <p className="text-base font-mono mt-1">{customer.tax_id}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* บริการ */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-primary" />
              บริการที่ใช้
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {customer.services.map((service, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="font-normal text-base px-3 py-1"
                >
                  <Package className="mr-2 h-4 w-4" />
                  {SERVICE_MAP[service] || service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ข้อมูลระบบ */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              ข้อมูลระบบ
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">วันที่สร้าง</label>
              <p className="text-base mt-1">
                {new Date(customer.created_at).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">อัปเดตล่าสุด</label>
              <p className="text-base mt-1">
                {new Date(customer.updated_at).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
