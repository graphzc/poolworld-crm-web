import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { usePoolCare, useDeletePoolCare } from '@/hooks/usePoolCares'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Pencil, Trash2 } from 'lucide-react'
import { POOL_SYSTEM_MAP } from '@/lib/constants'
import { useState } from 'react'
import { CreateReportButton } from '@/components/poolcare/CreateReportButton'
import { DayBadgeList } from '@/components/poolcare/DayBadge'

export const Route = createFileRoute('/_authenticated/poolcares/$poolCareId/')({
  staticData: { breadcrumb: PoolCareBreadcrumb },
  component: PoolCareDetailPage,
})

function PoolCareBreadcrumb({ params }: { params: Record<string, string> }) {
  const { data: poolCare } = usePoolCare(params.poolCareId)
  return poolCare?.name ?? 'รายละเอียด'
}

function PoolCareDetailPage() {
  const { poolCareId } = Route.useParams()
  const navigate = useNavigate()
  const { data: poolCare, isLoading } = usePoolCare(poolCareId)
  const { mutate: deletePoolCare } = useDeletePoolCare()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDelete = () => {
    deletePoolCare(poolCareId, {
      onSuccess: () => {
        navigate({ to: '/poolcares' })
      },
    })
  }

  if (isLoading) {
    return <div>กำลังโหลด...</div>
  }

  if (!poolCare) {
    return <div>ไม่พบข้อมูล</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{poolCare.name}</h1>
        <div className="flex gap-2">
          <CreateReportButton poolCareId={poolCare.id} />
          <Button
            variant="outline"
            onClick={() =>
              navigate({
                to: '/poolcares/$poolCareId/edit',
                params: { poolCareId: poolCare.id },
              })
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            แก้ไข
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            ลบ
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลทั่วไป</CardTitle>
            <CardDescription>รายละเอียดการดูแลสระว่ายน้ำ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">ชื่อ</div>
              <div className="font-medium">{poolCare.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">ลูกค้า</div>
              <div className="font-medium">{poolCare.customer_name || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">ที่อยู่</div>
              <div className="font-medium">{poolCare.address}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>รายละเอียดการให้บริการ</CardTitle>
            <CardDescription>ข้อมูลการให้บริการ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">วันให้บริการ</div>
              <div className="mt-1">
                <DayBadgeList days={poolCare.days_of_service} />
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">ระบบสระว่ายน้ำ</div>
              <div className="font-medium">{POOL_SYSTEM_MAP[poolCare.pool_system]}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">รวมค่าเคมี</div>
              <div className="font-medium">{poolCare.chemical_included ? 'ใช่' : 'ไม่'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">ราคา</div>
              <div className="text-2xl font-bold">
                {poolCare.price.toLocaleString('th-TH')} ฿
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลเพิ่มเติม</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">สร้างเมื่อ</span>
            <span>{new Date(poolCare.created_at).toLocaleString('th-TH')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">อัปเดตล่าสุด</span>
            <span>{new Date(poolCare.updated_at).toLocaleString('th-TH')}</span>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการลบการดูแลสระว่ายน้ำ "{poolCare.name}"
              รายงานทั้งหมดของการดูแลสระนี้จะถูกลบด้วย การกระทำนี้ไม่สามารถยกเลิกได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>ลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
