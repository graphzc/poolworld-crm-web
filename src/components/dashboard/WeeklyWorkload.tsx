import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { WeekdayWorkload } from '@/hooks/useDashboard'

interface WeeklyWorkloadProps {
  readonly workload: WeekdayWorkload[]
  readonly todayKey: string
}

export function WeeklyWorkload({ workload, todayKey }: WeeklyWorkloadProps) {
  const maxCount = Math.max(1, ...workload.map((item) => item.count))
  const busiest = workload.reduce((max, item) => (item.count > max.count ? item : max), workload[0])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">ปริมาณงานรายสัปดาห์</CardTitle>
        <CardDescription>
          {busiest.count > 0
            ? `วันที่งานมากที่สุดคือวัน${busiest.label} (${busiest.count} สระ)`
            : 'จำนวนสระที่เข้าบริการในแต่ละวัน'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="flex h-48 items-end gap-2 border-b border-gray-200"
          role="img"
          aria-label={workload.map((item) => `วัน${item.label} ${item.count} สระ`).join(', ')}
        >
          {workload.map((item) => {
            const isToday = item.day === todayKey
            return (
              <div
                key={item.day}
                className="group relative flex h-full flex-1 flex-col items-center justify-end"
              >
                <span
                  className={cn(
                    'mb-1 text-xs font-semibold tabular-nums text-gray-900',
                    !isToday && 'opacity-0 transition-opacity group-hover:opacity-100'
                  )}
                >
                  {item.count}
                </span>
                <div
                  className={cn(
                    'w-full max-w-10 rounded-t transition-colors',
                    isToday ? 'bg-primary' : 'bg-primary/25 group-hover:bg-primary/45'
                  )}
                  style={{ height: `${(item.count / maxCount) * 85}%`, minHeight: item.count ? 4 : 0 }}
                />
              </div>
            )
          })}
        </div>
        <div className="mt-2 flex gap-2">
          {workload.map((item) => (
            <span
              key={item.day}
              className={cn(
                'flex-1 text-center text-xs',
                item.day === todayKey ? 'font-semibold text-primary' : 'text-muted-foreground'
              )}
            >
              {item.shortLabel}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
