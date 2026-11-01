import { DAYS_OF_WEEK, DAY_COLOR_MAP } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface DayFilterProps {
  value: string[]
  onChange: (days: string[]) => void
  className?: string
}

const chipClass =
  'h-8 rounded-full border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

export function DayFilter({ value, onChange, className }: DayFilterProps) {
  const toggle = (day: string) => {
    const next = value.includes(day) ? value.filter((d) => d !== day) : [...value, day]
    // Keep the week order regardless of click order
    onChange(DAYS_OF_WEEK.map((d) => d.value).filter((d) => next.includes(d)))
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm font-medium text-muted-foreground">วันที่ให้บริการ:</span>
      <button
        type="button"
        aria-pressed={value.length === 0}
        onClick={() => onChange([])}
        className={cn(
          chipClass,
          value.length === 0
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-input bg-background text-muted-foreground hover:bg-accent'
        )}
      >
        ทุกวัน
      </button>
      {DAYS_OF_WEEK.map((day) => {
        const active = value.includes(day.value)
        return (
          <button
            key={day.value}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(day.value)}
            className={cn(
              chipClass,
              active
                ? cn(DAY_COLOR_MAP[day.value], 'font-medium')
                : 'border-input bg-background text-muted-foreground hover:bg-accent'
            )}
          >
            {day.label}
          </button>
        )
      })}
    </div>
  )
}
