import { Link } from '@tanstack/react-router'
import { CalendarCheck, ChevronRight, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { POOL_SYSTEM_MAP } from '@/lib/constants'
import type { PoolCare } from '@/types'

interface TodayScheduleProps {
  readonly pools: PoolCare[]
  readonly dayLabel: string
}

export function TodaySchedule({ pools, dayLabel }: TodayScheduleProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-lg">งานวันนี้</CardTitle>
          <CardDescription>สระที่ต้องเข้าบริการในวัน{dayLabel}</CardDescription>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary tabular-nums">
          {pools.length} สระ
        </span>
      </CardHeader>
      <CardContent className="flex-1">
        {pools.length === 0 ? (
          <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center">
            <CalendarCheck className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-gray-900">ไม่มีงานบริการวันนี้</p>
            <p className="text-sm text-muted-foreground">ไม่มีสระที่กำหนดเข้าบริการในวัน{dayLabel}</p>
          </div>
        ) : (
          <ul className="max-h-80 divide-y overflow-y-auto rounded-lg border">
            {pools.map((pool, index) => (
              <li key={pool.id}>
                <Link
                  to="/poolcares/$poolCareId"
                  params={{ poolCareId: pool.id }}
                  className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 tabular-nums">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">{pool.name}</p>
                    <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{pool.address || 'ไม่ระบุที่อยู่'}</span>
                    </p>
                  </div>
                  <div className="hidden shrink-0 gap-1.5 sm:flex">
                    <Badge variant="outline" className="font-normal">
                      {POOL_SYSTEM_MAP[pool.pool_system]}
                    </Badge>
                    {pool.chemical_included && (
                      <Badge variant="secondary" className="font-normal">
                        รวมเคมี
                      </Badge>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
