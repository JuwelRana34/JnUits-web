import { BarChart3 } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface TrafficChartProps {
  data: { date: string; signups: number; visitors: number }[]
}

export function TrafficChart({ data }: TrafficChartProps) {
  const maxCount = Math.max(
    ...data.map((d) => Math.max(d.visitors, d.signups)),
    1
  )

  return (
    <Card className="col-span-4 shadow-sm transition-shadow hover:shadow-md lg:col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="text-primary h-5 w-5" />
          Traffic Overview
        </CardTitle>
        <CardDescription className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div> Visitors
          </span>
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div> Signups
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {/* Dynamic Chart */}
        <div className="flex h-62.5 w-full items-end justify-between gap-2 px-2 pt-8">
          {data.length === 0 ? (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
              No traffic data available
            </div>
          ) : (
            data.map((item, i) => {
              const visitorHeight = Math.max(
                (item.visitors / maxCount) * 100,
                5
              )
              const signupHeight = Math.max((item.signups / maxCount) * 100, 5)

              return (
                <div
                  key={i}
                  className="group relative flex h-full w-full flex-col justify-end gap-1"
                >
                  {/* Tooltip */}
                  <div className="bg-popover text-popover-foreground pointer-events-none absolute -top-12 left-1/2 z-50 -translate-x-1/2 rounded border px-2 py-1 text-xs whitespace-nowrap opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                    <div className="mb-1 font-semibold">{item.date}</div>
                    <div className="flex justify-between gap-2">
                      <span>Visitors:</span> <span>{item.visitors}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span>Signups:</span> <span>{item.signups}</span>
                    </div>
                  </div>

                  {/* Bars container */}
                  <div className="flex h-full w-full items-end gap-0.5">
                    <div
                      className="w-full rounded-t-sm bg-blue-500/80 transition-all hover:bg-blue-600"
                      style={{ height: `${visitorHeight}%` }}
                    ></div>
                    <div
                      className="w-full rounded-t-sm bg-emerald-500/80 transition-all hover:bg-emerald-600"
                      style={{ height: `${signupHeight}%` }}
                    ></div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
