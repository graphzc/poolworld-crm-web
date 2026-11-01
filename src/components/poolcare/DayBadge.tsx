import { Badge } from '@/components/ui/badge'
import { DAY_COLOR_MAP, DAY_MAP } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface DayBadgeProps {
  day: string
  className?: string
}

export function DayBadge({ day, className }: DayBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-normal', DAY_COLOR_MAP[day], className)}>
      {DAY_MAP[day] || day}
    </Badge>
  )
}

export function DayBadgeList({ days }: { days: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {days.map((day) => (
        <DayBadge key={day} day={day} />
      ))}
    </div>
  )
}
