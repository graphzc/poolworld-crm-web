import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, FileText, Plus, UserPlus, Users, Wallet, Waves } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { StatCard } from '@/components/dashboard/StatCard'
import { TodaySchedule } from '@/components/dashboard/TodaySchedule'
import { WeeklyWorkload } from '@/components/dashboard/WeeklyWorkload'
import { PoolBreakdown } from '@/components/dashboard/PoolBreakdown'
import { ReportProgress } from '@/components/dashboard/ReportProgress'
import { useDashboard } from '@/hooks/useDashboard'
import { DAY_MAP } from '@/lib/constants'

export const Route = createFileRoute('/_authenticated/')({
  staticData: { breadcrumb: 'หน้าแรก' },
  component: DashboardPage,
})

function getGreeting(hour: number) {
  if (hour < 12) return 'สวัสดีตอนเช้า'
  if (hour < 17) return 'สวัสดีตอนบ่าย'
  return 'สวัสดีตอนเย็น'
}

function DashboardPage() {
  const dashboard = useDashboard()
  const { now, todayKey, customers, pools, reports } = dashboard

  const dateLabel = now.toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const monthLabel = now.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-sm sm:p-8">
        <Waves className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 text-white/10" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-blue-100">{dateLabel}</p>
            <h1 className="text-2xl font-bold sm:text-3xl">{getGreeting(now.getHours())}</h1>
            <p className="text-blue-50">
              {dashboard.isLoading
                ? 'กำลังโหลดข้อมูล...'
                : dashboard.todayPools.length > 0
                  ? `วันนี้มีสระที่ต้องเข้าบริการ ${dashboard.todayPools.length} สระ`
                  : 'วันนี้ไม่มีงานบริการสระ'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/customers/new">
                <UserPlus className="mr-2 h-4 w-4" />
                เพิ่มลูกค้า
              </Link>
            </Button>
            <Button asChild className="bg-white/15 text-white hover:bg-white/25">
              <Link to="/poolcares/new">
                <Plus className="mr-2 h-4 w-4" />
                เพิ่มสระ
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {dashboard.isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : dashboard.isError ? (
        <Card className="flex flex-col items-center justify-center gap-3 p-10 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="font-medium text-gray-900">ไม่สามารถโหลดข้อมูลได้</p>
          <Button variant="outline" onClick={dashboard.refetch}>
            ลองใหม่อีกครั้ง
          </Button>
        </Card>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="ลูกค้าทั้งหมด"
              value={customers.total.toLocaleString('th-TH')}
              icon={Users}
              iconClassName="bg-blue-50 text-blue-600"
            >
              มีภาษี {customers.tax} · ไม่มีภาษี {customers.nonTax}
            </StatCard>
            <StatCard
              title="สระที่ดูแล"
              value={pools.total.toLocaleString('th-TH')}
              icon={Waves}
              iconClassName="bg-cyan-50 text-cyan-600"
            >
              รวมเคมี {pools.chemicalIncluded} สระ
            </StatCard>
            <StatCard
              title="ค่าบริการรวมต่อเดือน"
              value={`฿${pools.monthlyRevenue.toLocaleString('th-TH')}`}
              icon={Wallet}
              iconClassName="bg-emerald-50 text-emerald-600"
            >
              เฉลี่ย ฿
              {(pools.total > 0 ? Math.round(pools.monthlyRevenue / pools.total) : 0).toLocaleString(
                'th-TH'
              )}{' '}
              ต่อสระ
            </StatCard>
            <StatCard
              title="ใบการดูแลเดือนนี้"
              value={
                <>
                  {reports.created}
                  <span className="text-lg font-normal text-muted-foreground">/{pools.total}</span>
                </>
              }
              icon={FileText}
              iconClassName="bg-violet-50 text-violet-600"
            >
              เข้าบริการรวม {reports.monthlyVisits} ครั้งในเดือนนี้
            </StatCard>
          </div>

          {/* Schedule */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TodaySchedule pools={dashboard.todayPools} dayLabel={DAY_MAP[todayKey]} />
            </div>
            <WeeklyWorkload workload={dashboard.weeklyWorkload} todayKey={todayKey} />
          </div>

          {/* Reports & pools */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ReportProgress
                monthLabel={monthLabel}
                totalPools={pools.total}
                created={reports.created}
                missingPools={reports.missingPools}
              />
            </div>
            <PoolBreakdown
              total={pools.total}
              chlorine={pools.chlorine}
              salt={pools.salt}
              chemicalIncluded={pools.chemicalIncluded}
            />
          </div>
        </>
      )}
    </div>
  )
}
