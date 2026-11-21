import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { MonthPicker, type YearMonth } from '@/components/ui/month-picker'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Eye, Trash2, Printer } from 'lucide-react'
import { usePoolCareReports, useDeletePoolCareReport } from '@/hooks/usePoolCareReports'
import { POOL_SYSTEM_MAP } from '@/lib/constants'
import { DayBadgeList } from '@/components/poolcare/DayBadge'
import { DayFilter } from '@/components/poolcare/DayFilter'
import { PoolCareReportSheet } from '@/components/poolcare/PoolCareReportSheet'
import type { PoolCareReport } from '@/types'
import { toast } from '@/hooks/useToast'

interface PoolCareReportsSearch {
  year?: number
  month?: number
  days?: string
}

export const Route = createFileRoute('/_authenticated/poolcare-reports/')({
  staticData: { breadcrumb: 'ใบดูแลสระว่ายน้ำ' },
  validateSearch: (search: Record<string, unknown>): PoolCareReportsSearch => {
    const year = Number(search.year)
    const month = Number(search.month)
    return {
      year: Number.isInteger(year) && year > 1900 ? year : undefined,
      month: Number.isInteger(month) && month >= 1 && month <= 12 ? month : undefined,
      days: typeof search.days === 'string' && search.days ? search.days : undefined,
    }
  },
  component: PoolCareReportsPage,
})

function PoolCareReportsPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const currentDate = new Date()
  const year = search.year ?? currentDate.getFullYear()
  const month = search.month ?? currentDate.getMonth() + 1
  const days = search.days ? search.days.split(',') : []
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  // Keep the report data (not just ids) so selections made on other pages can still be printed
  const [selectedReports, setSelectedReports] = useState<Map<string, PoolCareReport>>(new Map())
  const [printQueue, setPrintQueue] = useState<PoolCareReport[] | null>(null)

  const { data, isLoading } = usePoolCareReports({
    year,
    month,
    days: search.days,
    page,
    limit: 20,
  })

  const { mutate: deleteReport } = useDeletePoolCareReport()

  const handleDelete = () => {
    if (deleteId) {
      deleteReport(deleteId, {
        onSuccess: () => {
          setDeleteId(null)
        },
      })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    const pageReports = data?.data ?? []
    const next = new Map(selectedReports)
    pageReports.forEach((report) => {
      if (checked) next.set(report.id, report)
      else next.delete(report.id)
    })
    setSelectedReports(next)
  }

  const handleSelectReport = (report: PoolCareReport, checked: boolean) => {
    const next = new Map(selectedReports)
    if (checked) {
      next.set(report.id, report)
    } else {
      next.delete(report.id)
    }
    setSelectedReports(next)
  }

  // Render every selected sheet into one print-only container, then print them as a
  // single job (one A4 page per report). Opening a window per report gets blocked by
  // popup blockers after the first one.
  const handleBulkPrint = () => {
    if (selectedReports.size === 0) {
      toast({
        variant: 'destructive',
        title: 'กรุณาเลือกรายงาน',
        description: 'กรุณาเลือกรายงานที่ต้องการพิมพ์อย่างน้อย 1 รายการ',
      })
      return
    }
    setPrintQueue(Array.from(selectedReports.values()))
  }

  useEffect(() => {
    if (!printQueue) return
    const previousTitle = document.title
    // Default "Save as PDF" file name
    document.title = `poolcare-reports_${year}-${String(month).padStart(2, '0')}`
    const done = () => setPrintQueue(null)
    window.addEventListener('afterprint', done)
    // Wait one frame so the sheets are laid out before the print dialog snapshots the page
    const frame = requestAnimationFrame(() => window.print())
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('afterprint', done)
      document.title = previousTitle
    }
  }, [printQueue, year, month])

  const updateFilters = (next: PoolCareReportsSearch) => {
    navigate({ to: '.', search: { ...search, ...next }, replace: true })
    setPage(1)
    setSelectedReports(new Map())
  }

  const handlePeriodChange = (next: YearMonth) => updateFilters(next)

  const handleDaysChange = (next: string[]) =>
    updateFilters({ days: next.length > 0 ? next.join(',') : undefined })

  const allSelected =
    !!data?.data.length && data.data.every((report) => selectedReports.has(report.id))

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">รายงานการดูแลสระว่ายน้ำ</h1>
        <Button 
          onClick={handleBulkPrint}
          disabled={selectedReports.size === 0}
          variant={selectedReports.size > 0 ? 'default' : 'outline'}
        >
          <Printer className="mr-2 h-4 w-4" />
          พิมพ์ที่เลือก ({selectedReports.size})
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <MonthPicker value={{ year, month }} onChange={handlePeriodChange} />
          {data && (
            <span className="text-sm text-muted-foreground">
              ทั้งหมด {data.total.toLocaleString('th-TH')} รายงาน
            </span>
          )}
        </div>
        <DayFilter className="mt-4" value={days} onChange={handleDaysChange} />
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => handleSelectAll(checked === true)}
                />
              </TableHead>
              <TableHead>ชื่อลูกค้า</TableHead>
              <TableHead>ที่อยู่</TableHead>
              <TableHead>วันที่ให้บริการ</TableHead>
              <TableHead>ระบบสระ</TableHead>
              <TableHead>รวมเคมี</TableHead>
              <TableHead className="text-right">การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  กำลังโหลด...
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  ไม่พบข้อมูลรายงาน
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((report: PoolCareReport) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedReports.has(report.id)}
                      onCheckedChange={(checked) => handleSelectReport(report, checked === true)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      to="/poolcare-reports/$reportId"
                      params={{ reportId: report.id }}
                      className="font-medium text-primary hover:underline"
                    >
                      {report.name}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{report.address || '-'}</TableCell>
                  <TableCell>
                    <DayBadgeList days={report.days_of_service} />
                  </TableCell>
                  <TableCell>{POOL_SYSTEM_MAP[report.pool_system]}</TableCell>
                  <TableCell>{report.chemical_included ? 'ใช่' : 'ไม่'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate({
                            to: '/poolcare-reports/$reportId',
                            params: { reportId: report.id },
                          })
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(report.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={page === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบรายงานนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>ลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {printQueue &&
        createPortal(
          <div className="bulk-print-root">
            {printQueue.map((report) => (
              <PoolCareReportSheet key={report.id} report={report} className="bulk-print-sheet" />
            ))}
            <style>{`
              .bulk-print-root { display: none; }

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
                }

                /* Portal is a direct child of <body>; hide the rest of the app */
                body > *:not(.bulk-print-root) {
                  display: none !important;
                }

                .bulk-print-root {
                  display: block;
                }

                .bulk-print-sheet {
                  /* a hair under 210mm so rounding never spills into a blank page */
                  height: 209.5mm !important;
                  overflow: hidden;
                  break-inside: avoid;
                  break-after: page;
                }

                .bulk-print-sheet:last-of-type {
                  break-after: auto;
                }
              }
            `}</style>
          </div>,
          document.body
        )}
    </div>
  )
}
