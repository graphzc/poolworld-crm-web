import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Button } from '@/components/ui/button'
import { MonthGrid, toBuddhistYear, type YearMonth } from '@/components/ui/month-picker'
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
import { CalendarDays, FileStack, Loader2 } from 'lucide-react'
import { useBulkCreatePoolCareReports } from '@/hooks/usePoolCareReports'
import { THAI_MONTHS } from '@/lib/constants'

const currentPeriod = (): YearMonth => {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

export function BulkCreateReportsButton() {
  const [open, setOpen] = useState(false)
  const [period, setPeriod] = useState<YearMonth>(currentPeriod)
  const { mutate: bulkCreate, isPending } = useBulkCreatePoolCareReports()

  const handleOpen = () => {
    setPeriod(currentPeriod())
    setOpen(true)
  }

  const handleCreate = (e: MouseEvent) => {
    // Keep the dialog open until the request finishes so the loading state is visible
    e.preventDefault()
    bulkCreate(period, {
      onSuccess: () => {
        setOpen(false)
      },
    })
  }

  const periodLabel = `${THAI_MONTHS[period.month - 1].label} ${toBuddhistYear(period.year)}`

  return (
    <>
      <Button onClick={handleOpen} variant="outline">
        <FileStack className="mr-2 h-4 w-4" />
        สร้างรายงานทั้งหมด
      </Button>

      <AlertDialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>สร้างรายงานการดูแลสระว่ายน้ำทั้งหมด</AlertDialogTitle>
            <AlertDialogDescription>
              เลือกปีและเดือนที่ต้องการสร้างรายงานสำหรับทุกรายการ
            </AlertDialogDescription>
          </AlertDialogHeader>

          <MonthGrid
            className="rounded-md border p-3"
            year={period.year}
            onYearChange={(year) => setPeriod((p) => ({ ...p, year }))}
            selected={period}
            onSelectMonth={(month) => setPeriod((p) => ({ ...p, month }))}
          />

          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              สร้างรายงานประจำเดือน <span className="font-semibold">{periodLabel}</span>
            </span>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreate} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'กำลังสร้าง...' : 'สร้างรายงาน'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
