import { OverviewStats } from './_components/OverviewStats'
import { QuickActions } from './_components/QuickActions'
import { RecentActivity } from './_components/RecentActivity'
import { TrafficChart } from './_components/TrafficChart'
import { getDashboardStats, getRecentActivity, getTrafficData } from './actions'

export default async function DashboardPage() {
  const statsData = await getDashboardStats()
  const trafficData = await getTrafficData()
  const recentActivity = await getRecentActivity()
  const safeStats = statsData.success
    ? statsData
    : {
        totalUsers: 0,
        totalEvents: 0,
        totalRegistrations: 0,
        revenue: 0,
      }

  const safeTraffic = trafficData.success ? trafficData.data : []

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden p-2 md:p-6">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Global site overview and admin controls.
          </p>
        </div>

        <OverviewStats data={safeStats} />

        {/* Bento Grid Layout */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <TrafficChart data={safeTraffic} />
          <RecentActivity data={recentActivity} />
        </div>

        {/* Helper Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
