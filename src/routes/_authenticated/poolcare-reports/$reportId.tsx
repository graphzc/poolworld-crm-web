import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePoolCareReport } from '@/hooks/usePoolCareReports'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import { POOL_SYSTEM_MAP, DAY_MAP } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/poolcare-reports/$reportId')({
  staticData: { breadcrumb: ReportBreadcrumb },
  component: PoolCareReportPage,
})

function ReportBreadcrumb({ params }: { params: Record<string, string> }) {
  const { data: report } = usePoolCareReport(params.reportId)
  return report?.name ?? 'รายงาน'
}

const MONTHS_TH = [
  '', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

// e.g. "Villa Sunset_2026-11" — year-month so files sort chronologically
function reportFileName(name: string, year: number, month: number) {
  const safeName = name.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim()
  return `${safeName}_${year}-${String(month).padStart(2, '0')}`
}

function PoolCareReportPage() {
  const { reportId } = Route.useParams()
  const { data: report, isLoading } = usePoolCareReport(reportId)

  // Browsers use document.title as the default "Save as PDF" file name
  useEffect(() => {
    if (!report) return
    const previousTitle = document.title
    document.title = reportFileName(report.name, report.year, report.month)
    return () => {
      document.title = previousTitle
    }
  }, [report])

  const handlePrint = () => {
    globalThis.print()
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">กำลังโหลด...</div>
  }

  if (!report) {
    return <div className="flex items-center justify-center min-h-screen">ไม่พบข้อมูล</div>
  }

  const daysInMonth = new Date(report.year, report.month, 0).getDate()
  const serviceDaysSet = new Set(report.service_dates)
  const daysOfServiceText = report.days_of_service.map((day) => DAY_MAP[day]).join(', ')

  return (
    <div className="print-container">
      {/* Print button - hidden when printing */}
      <div className="print:hidden mb-4 flex justify-end no-print">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          พิมพ์รายงาน
        </Button>
      </div>

      {/* A4 Landscape Paper */}
      <div
        className="printable-content bg-white print:m-0 mx-auto flex flex-col"
        style={{ width: '297mm', height: '210mm', padding: '5mm', fontFamily: "'Google Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="text-center pb-1.5">
          <h1 className="text-xl font-bold">
            ตารางการปฏิบัติงานดูแลสระว่ายน้ำ Pool World
          </h1>
          <div className="text-sm mt-1">
            งานดูแลสระว่ายน้ำ {report.name} {report.address}
          </div>
          <div className="text-sm mt-1">
            ระยะเวลาดูแลสระว่ายน้ำ 1 - {daysInMonth} {MONTHS_TH[report.month]} {report.year + 543}
            {' เข้า '} {daysOfServiceText}
            <span className="ml-3">เคมี: </span>
            <span className={cn('', { 'text-red-600': report.chemical_included })}>
              {report.chemical_included ? 'รวมเคมี' : 'ไม่รวมเคมี'}
            </span>
            <span className='ml-3'>
              <span>ระบบ: </span>
              {POOL_SYSTEM_MAP[report.pool_system]}
            </span>
          </div>
        </div>
        {/* Table - stretches to fill the remaining page height, so 28-31 days all fit */}
        <div className="flex-1 min-h-0">
          <table className="w-full h-full border-collapse border border-black text-xs leading-tight">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-1 py-[1.4px]" rowSpan={2}>วัน</th>
                <th className="border border-black px-1 py-[1.4px]" colSpan={6}>
                  รายการทำความสะอาดสระว่ายน้ำ/และอุปกรณ์
                </th>
                <th className="border border-black px-1 py-[1.4px]" colSpan={6}>
                  เช็ควาล์วในห้องเครื่องก่อนกลับ
                </th>
                <th className="border border-black px-1 py-[1.4px]" rowSpan={2}>ปะปา</th>
                <th className="border border-black px-1 py-[1.4px]" rowSpan={2}>เวลาเข้า-ออก</th>
                <th className="border border-black px-1 py-[1.4px]" rowSpan={2}>ลายเซ็นต์</th>
              </tr>
              <tr className="bg-gray-100">
                <th className="border border-black px-1 py-[1.4px]">PH</th>
                <th className="border border-black px-1 py-[1.4px]">CL</th>
                <th className="border border-black px-1 py-[1.4px]">ดูดตะกอน</th>
                <th className="border border-black px-1 py-[1.4px]">ช้อนใบไม้</th>
                <th className="border border-black px-1 py-[1.4px]">ขัดสระ</th>
                <th className="border border-black px-1 py-[1.4px]">B/W</th>
                <th className="border border-black px-1 py-[1.4px]">ตะกร้าสกิมเมอร์</th>
                <th className="border border-black px-1 py-[1.4px]">ตะกร้าหน้าปั๊ม</th>
                <th className="border border-black px-1 py-[1.4px]">วาล์วดูดตะกอน</th>
                <th className="border border-black px-1 py-[1.4px]">วาล์วสะดือ</th>
                <th className="border border-black px-1 py-[1.4px]">วาล์วแท็งค์</th>
                <th className="border border-black px-1 py-[1.4px]">วาล์วสกิมเมอร์</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isServiceDay = serviceDaysSet.has(day)
                return (
                  <tr key={day} >
                    <td className={`border border-black text-center font-medium ${isServiceDay ? 'bg-pink-200' : ''}`}>
                      {day}
                    </td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }

          * {
             -webkit-print-color-adjust: exact !important;
             print-color-adjust: exact !important;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }

          body * {
            visibility: hidden;
          }

          .printable-content,
          .printable-content * {
            visibility: visible;
          }

          /* fixed, not absolute: <main> in AppLayout is position:relative and sits
             below the (hidden but still space-taking) header, which pushed the sheet down */
          .printable-content {
            position: fixed;
            left: 0;
            top: 0;
            width: 297mm;
            height: 210mm;
            margin: 0 !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
          }

          .no-print {
            display: none !important;
          }

          table {
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  )
}
