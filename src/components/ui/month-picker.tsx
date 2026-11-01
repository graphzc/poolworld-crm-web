import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { THAI_MONTHS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export interface YearMonth {
  year: number
  month: number // 1-12
}

interface MonthPickerProps {
  value: YearMonth
  onChange: (value: YearMonth) => void
  className?: string
}

export const toBuddhistYear = (year: number) => year + 543

function shiftMonth({ year, month }: YearMonth, delta: number): YearMonth {
  const index = year * 12 + (month - 1) + delta
  return { year: Math.floor(index / 12), month: (index % 12) + 1 }
}

interface MonthGridProps {
  year: number
  onYearChange: (year: number) => void
  selected: YearMonth
  onSelectMonth: (month: number) => void
  className?: string
}

// Year stepper + 12-month grid. `year` is the year being shown, which may differ from `selected`.
export function MonthGrid({ year, onYearChange, selected, onSelectMonth, className }: MonthGridProps) {
  const now = new Date()
  const today: YearMonth = { year: now.getFullYear(), month: now.getMonth() + 1 }

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="ปีก่อนหน้า"
          onClick={() => onYearChange(year - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold">พ.ศ. {toBuddhistYear(year)}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="ปีถัดไป"
          onClick={() => onYearChange(year + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {THAI_MONTHS.map((m) => {
          const isSelected = year === selected.year && m.value === selected.month
          const isToday = year === today.year && m.value === today.month
          return (
            <Button
              key={m.value}
              variant={isSelected ? 'default' : 'ghost'}
              size="sm"
              aria-pressed={isSelected}
              className={cn(isToday && !isSelected && 'border border-primary text-primary')}
              onClick={() => onSelectMonth(m.value)}
            >
              {m.short}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export function MonthPicker({ value, onChange, className }: MonthPickerProps) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(value.year)

  const now = new Date()
  const today: YearMonth = { year: now.getFullYear(), month: now.getMonth() + 1 }
  const isCurrentMonth = value.year === today.year && value.month === today.month

  const handleOpenChange = (next: boolean) => {
    if (next) setViewYear(value.year)
    setOpen(next)
  }

  const select = (next: YearMonth) => {
    onChange(next)
    setOpen(false)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        aria-label="เดือนก่อนหน้า"
        onClick={() => onChange(shiftMonth(value, -1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-48 justify-start font-medium">
            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
            {THAI_MONTHS[value.month - 1].label} {toBuddhistYear(value.year)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" align="start">
          <MonthGrid
            year={viewYear}
            onYearChange={setViewYear}
            selected={value}
            onSelectMonth={(month) => select({ year: viewYear, month })}
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        aria-label="เดือนถัดไป"
        onClick={() => onChange(shiftMonth(value, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {!isCurrentMonth && (
        <Button variant="link" size="sm" onClick={() => onChange(today)}>
          เดือนนี้
        </Button>
      )}
    </div>
  )
}
