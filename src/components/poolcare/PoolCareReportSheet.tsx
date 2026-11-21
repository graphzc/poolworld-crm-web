import { POOL_SYSTEM_MAP, DAY_MAP } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { PoolCareReport } from '@/types'

const MONTHS_TH = [
  '', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

// 6 cleaning + 6 valve checks + water supply, time in-out, signature
const CHECK_COLUMNS = 15

interface PoolCareReportSheetProps {
  report: PoolCareReport
  className?: string
}

/** One A4-landscape pool care sheet for a single report. */
export function PoolCareReportSheet({ report, className }: PoolCareReportSheetProps) {
  const daysInMonth = new Date(report.year, report.month, 0).getDate()
  const serviceDaysSet = new Set(report.service_dates)
  const daysOfServiceText = report.days_of_service.map((day) => DAY_MAP[day]).join(', ')

  return (
    <div
      className={cn('bg-white print:m-0 mx-auto flex flex-col', className)}
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
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <tr key={day}>
                <td
                  className={cn('border border-black text-center font-medium', {
                    'bg-pink-200': serviceDaysSet.has(day),
                  })}
                >
                  {day}
                </td>
                {Array.from({ length: CHECK_COLUMNS }, (_, i) => (
                  <td key={i} className="border border-black"></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
