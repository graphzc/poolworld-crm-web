import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePoolCareReport } from '@/hooks/usePoolCareReports'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import { PoolCareReportSheet } from '@/components/poolcare/PoolCareReportSheet'
import { reportFileName } from '@/lib/reportFileName'

export const Route = createFileRoute('/_authenticated/poolcare-reports/$reportId')({
  staticData: { breadcrumb: ReportBreadcrumb },
  component: PoolCareReportPage,
})

function ReportBreadcrumb({ params }: { params: Record<string, string> }) {
  const { data: report } = usePoolCareReport(params.reportId)
  return report?.name ?? 'รายงาน'
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
      <PoolCareReportSheet report={report} className="printable-content" />

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
