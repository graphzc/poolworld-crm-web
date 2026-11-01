import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  readonly title: string
  readonly value: React.ReactNode
  readonly icon: LucideIcon
  readonly iconClassName: string
  readonly children?: React.ReactNode
}

export function StatCard({ title, value, icon: Icon, iconClassName, children }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums text-gray-900">
            {value}
          </p>
        </div>
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            iconClassName
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {children && <div className="mt-4 text-sm text-muted-foreground">{children}</div>}
    </Card>
  )
}
