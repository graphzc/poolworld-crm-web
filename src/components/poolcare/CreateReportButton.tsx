import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText } from 'lucide-react'
import { useCreatePoolCareReport } from '@/hooks/usePoolCareReports'
import { useNavigate } from '@tanstack/react-router'

interface CreateReportButtonProps {
  poolCareId: string
}

export function CreateReportButton({ poolCareId }: CreateReportButtonProps) {
  const navigate = useNavigate()
  const currentDate = new Date()
  const [year, setYear] = useState(currentDate.getFullYear())
  const [month, setMonth] = useState(currentDate.getMonth() + 1)
  const { mutate: createReport, isPending } = useCreatePoolCareReport()

  const handleCreate = () => {
    createReport(
      {
        poolcare_id: poolCareId,
        year,
        month,
      },
      {
        onSuccess: (report) => {
          navigate({ to: '/poolcare-reports/$reportId', params: { reportId: report.id } })
        },
      }
    )
  }

  const years = Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i)
  const months = [
    { value: 1, label: 'มกราคม' },
    { value: 2, label: 'กุมภาพันธ์' },
    { value: 3, label: 'มีนาคม' },
    { value: 4, label: 'เมษายน' },
    { value: 5, label: 'พฤษภาคม' },
    { value: 6, label: 'มิถุนายน' },
    { value: 7, label: 'กรกฎาคม' },
    { value: 8, label: 'สิงหาคม' },
    { value: 9, label: 'กันยายน' },
    { value: 10, label: 'ตุลาคม' },
    { value: 11, label: 'พฤศจิกายน' },
    { value: 12, label: 'ธันวาคม' },
  ]

  return (
    <div className="flex items-center gap-2">
      <Select value={month.toString()} onValueChange={(v) => setMonth(Number(v))}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value.toString()}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year.toString()} onValueChange={(v) => setYear(Number(v))}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y + 543}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleCreate} disabled={isPending}>
        <FileText className="mr-2 h-4 w-4" />
        {isPending ? 'กำลังสร้าง...' : 'สร้างรายงาน'}
      </Button>
    </div>
  )
}
