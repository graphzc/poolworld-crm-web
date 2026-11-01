import { Link } from '@tanstack/react-router'
import { CheckCircle2, FileWarning } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BulkCreateReportsButton } from '@/components/poolcare/BulkCreateReportsButton'
import type { PoolCare } from '@/types'

const MAX_MISSING_SHOWN = 5

interface ReportProgressProps {
  readonly monthLabel: string
  readonly totalPools: number
  readonly created: number
  readonly missingPools: PoolCare[]
}

export function ReportProgress({ monthLabel, totalPools, created, missingPools }: ReportProgressProps) {
  const percent = totalPools > 0 ? Math.round((created / totalPools) * 100) : 0
  const isComplete = totalPools > 0 && missingPools.length === 0

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-lg">ใบการดูแลประจำเดือน</CardTitle>
          <CardDescription>ความคืบหน้าการสร้างใบการดูแลเดือน{monthLabel}</CardDescription>
        </div>
        <BulkCreateReportsButton />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">
              สร้างแล้ว{' '}
              <span className="text-lg font-semibold text-gray-900 tabular-nums">{created}</span> จาก{' '}
              <span className="tabular-nums">{totalPools}</span> สระ
            </p>
            <span className="text-sm font-semibold tabular-nums text-gray-900">{percent}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {isComplete ? (
          <div className="flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            สร้างใบการดูแลครบทุกสระแล้ว
          </div>
        ) : missingPools.length > 0 ? (
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium text-amber-700">
              <FileWarning className="h-4 w-4" />
              ยังไม่ได้สร้างใบการดูแล {missingPools.length} สระ
            </p>
            <ul className="divide-y rounded-lg border text-sm">
              {missingPools.slice(0, MAX_MISSING_SHOWN).map((pool) => (
                <li key={pool.id} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <Link
                    to="/poolcares/$poolCareId"
                    params={{ poolCareId: pool.id }}
                    className="truncate font-medium text-gray-900 hover:text-primary hover:underline"
                  >
                    {pool.name}
                  </Link>
                  <span className="truncate text-muted-foreground">{pool.address}</span>
                </li>
              ))}
            </ul>
            {missingPools.length > MAX_MISSING_SHOWN && (
              <p className="text-xs text-muted-foreground">
                และอีก {missingPools.length - MAX_MISSING_SHOWN} สระ
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูลสระว่ายน้ำ</p>
        )}

        <Button variant="link" className="h-auto px-0" asChild>
          <Link to="/poolcare-reports">ดูใบการดูแลทั้งหมด →</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
