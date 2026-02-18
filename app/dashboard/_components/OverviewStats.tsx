import { Calendar, CreditCard, DollarSign, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsProps {
  data: {
    totalUsers: number
    totalEvents: number
    totalRegistrations: number
    revenue: number
  }
}

export function OverviewStats({ data }: StatsProps) {
  const stats = [
    {
      title: 'Total Revenue',
      value: `$${data.revenue.toLocaleString()}`,
      change: 'Lifetime',
      icon: DollarSign,
      color: 'text-emerald-500',
    },
    {
      title: 'Total Users',
      value: data.totalUsers.toLocaleString(),
      change: 'Registered Members',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Events',
      value: data.totalEvents.toLocaleString(),
      change: 'All Time',
      icon: Calendar,
      color: 'text-orange-500',
    },
    {
      title: 'Registrations',
      value: data.totalRegistrations.toLocaleString(),
      change: 'Event Signups',
      icon: CreditCard,
      color: 'text-purple-500',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="group border-l-4 transition-all duration-300 hover:shadow-lg"
          style={{
            borderLeftColor:
              i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)',
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div
              className={cn(
                'bg-muted/50 group-hover:bg-muted rounded-full p-2 transition-colors',
                stat.color
              )}
            >
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-muted-foreground mt-1 text-xs">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
