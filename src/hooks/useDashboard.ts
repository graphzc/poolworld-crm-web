import { useCustomers } from '@/hooks/useCustomers'
import { useAllPoolCares } from '@/hooks/usePoolCares'
import { useAllPoolCareReports } from '@/hooks/usePoolCareReports'
import { DAYS_OF_WEEK, DAY_SHORT_MAP } from '@/lib/constants'

export interface WeekdayWorkload {
  day: string
  label: string
  shortLabel: string
  count: number
}

export const useDashboard = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  // DAYS_OF_WEEK is ordered SUN..SAT, matching Date.getDay()
  const todayKey = DAYS_OF_WEEK[now.getDay()].value

  // limit: 1 — only the totals are needed
  const taxCustomers = useCustomers({ limit: 1, customerType: 'Tax' })
  const nonTaxCustomers = useCustomers({ limit: 1, customerType: 'Non-Tax' })
  const poolCares = useAllPoolCares()
  const reports = useAllPoolCareReports({ year, month })

  const queries = [taxCustomers, nonTaxCustomers, poolCares, reports]
  const pools = poolCares.data ?? []
  const reportedPoolIds = new Set((reports.data ?? []).map((report) => report.poolcare_id))

  const weeklyWorkload: WeekdayWorkload[] = DAYS_OF_WEEK.map((day) => ({
    day: day.value,
    label: day.label,
    shortLabel: DAY_SHORT_MAP[day.value],
    count: pools.filter((pool) => pool.days_of_service.includes(day.value)).length,
  }))

  return {
    isLoading: queries.some((query) => query.isLoading),
    isError: queries.some((query) => query.isError),
    refetch: () => queries.forEach((query) => query.refetch()),
    now,
    todayKey,
    customers: {
      tax: taxCustomers.data?.total ?? 0,
      nonTax: nonTaxCustomers.data?.total ?? 0,
      total: (taxCustomers.data?.total ?? 0) + (nonTaxCustomers.data?.total ?? 0),
    },
    pools: {
      total: pools.length,
      chlorine: pools.filter((pool) => pool.pool_system === 'CHLORINE').length,
      salt: pools.filter((pool) => pool.pool_system === 'SALT').length,
      chemicalIncluded: pools.filter((pool) => pool.chemical_included).length,
      monthlyRevenue: pools.reduce((sum, pool) => sum + pool.price, 0),
    },
    todayPools: pools.filter((pool) => pool.days_of_service.includes(todayKey)),
    weeklyWorkload,
    reports: {
      created: pools.filter((pool) => reportedPoolIds.has(pool.id)).length,
      missingPools: pools.filter((pool) => !reportedPoolIds.has(pool.id)),
      monthlyVisits: (reports.data ?? []).reduce(
        (sum, report) => sum + (report.service_dates?.length ?? 0),
        0
      ),
    },
  }
}
