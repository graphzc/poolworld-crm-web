import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Segment {
  label: string
  count: number
  color: string
}

interface PoolBreakdownProps {
  readonly total: number
  readonly chlorine: number
  readonly salt: number
  readonly chemicalIncluded: number
}

// Categorical slots validated for color-vision deficiency (blue / aqua / orange)
const COLORS = {
  blue: '#2a78d6',
  aqua: '#1baf7a',
  orange: '#eb6834',
  neutral: '#d4d4d8',
}

function SplitBar({ title, segments }: { readonly title: string; readonly segments: Segment[] }) {
  const total = segments.reduce((sum, segment) => sum + segment.count, 0)

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-gray-100">
        {total > 0 &&
          segments
            .filter((segment) => segment.count > 0)
            .map((segment) => (
              <div
                key={segment.label}
                title={`${segment.label}: ${segment.count} สระ`}
                style={{
                  width: `${(segment.count / total) * 100}%`,
                  backgroundColor: segment.color,
                }}
              />
            ))}
      </div>
      <ul className="space-y-1.5">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              {segment.label}
            </span>
            <span className="tabular-nums text-gray-900">
              {segment.count} สระ
              <span className="ml-1.5 text-muted-foreground">
                ({total > 0 ? Math.round((segment.count / total) * 100) : 0}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PoolBreakdown({ total, chlorine, salt, chemicalIncluded }: PoolBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">ภาพรวมสระ</CardTitle>
        <CardDescription>สัดส่วนระบบสระและเงื่อนไขเคมี จาก {total} สระ</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SplitBar
          title="ระบบสระ"
          segments={[
            { label: 'คลอรีน', count: chlorine, color: COLORS.blue },
            { label: 'เกลือ', count: salt, color: COLORS.aqua },
          ]}
        />
        <SplitBar
          title="เคมี"
          segments={[
            { label: 'รวมเคมี', count: chemicalIncluded, color: COLORS.orange },
            { label: 'ไม่รวมเคมี', count: total - chemicalIncluded, color: COLORS.neutral },
          ]}
        />
      </CardContent>
    </Card>
  )
}
