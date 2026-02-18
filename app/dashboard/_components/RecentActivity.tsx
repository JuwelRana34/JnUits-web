import { Suspense } from 'react'

import Image from 'next/image'

import { Activity, CreditCard, FileText, Ticket, UserPlus } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { TimeAgo } from './TimeAgo'

interface ActivityItem {
  id: string
  type: 'REGISTRATION' | 'SIGNUP' | 'POST' | 'PAYMENT'
  userName: string | null
  userImage: string | null
  target: string | null | undefined
  timestamp: string
}

export async function RecentActivity({ data }: { data: ActivityItem[] }) {
  return (
    <Card className="bg-card/60 col-span-3 border-none shadow-sm backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-blue-500" />
          রিসেন্ট অ্যাক্টিভিটি
        </CardTitle>
        <CardDescription>
          সাম্প্রতিক মেম্বার আপডেট এবং পোস্টসমূহ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {data.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No recent activity.
            </p>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                className="group flex items-start gap-3 transition-all"
              >
                {/* Avatar Section */}
                <div className="relative shrink-0">
                  <div className="bg-secondary h-9 w-9 overflow-hidden rounded-full border">
                    {item.userImage ? (
                      <Image
                        src={item.userImage}
                        alt="User"
                        fill
                        className="rounded-full object-cover shadow-2xl ring-2 shadow-blue-100 ring-blue-200"
                        sizes="36px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-blue-100 font-bold text-blue-600">
                        {item.userName?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  {/* Type Icon Overlay */}
                  <div
                    className={cn(
                      'border-background absolute -right-1 -bottom-1 rounded-full border-2 p-0.5',
                      item.type === 'POST'
                        ? 'bg-orange-500'
                        : item.type === 'SIGNUP'
                          ? 'bg-blue-500'
                          : item.type === 'PAYMENT'
                            ? 'bg-purple-500'
                            : 'bg-emerald-500'
                    )}
                  >
                    {item.type === 'POST' && (
                      <FileText className="h-2 w-2 text-white" />
                    )}
                    {item.type === 'SIGNUP' && (
                      <UserPlus className="h-2 w-2 text-white" />
                    )}
                    {item.type === 'PAYMENT' && (
                      <CreditCard className="h-2 w-2 text-white" />
                    )}
                    {item.type === 'REGISTRATION' && (
                      <Ticket className="h-2 w-2 text-white" />
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm leading-none font-semibold">
                      {item.userName || 'অজানা মেম্বার'}
                    </p>
                    <Suspense fallback={<p> loading </p>}>
                      <TimeAgo timestamp={item.timestamp} />
                    </Suspense>
                  </div>
                  <div className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                    {item.type === 'SIGNUP' && 'আইটি সোসাইটিতে যোগ দিয়েছেন 🎉'}
                    {item.type === 'POST' && (
                      <span>
                        একটি ব্লগ পোস্ট করেছেন:{' '}
                        <span className="text-foreground font-medium">
                          &quot;{item.target}&quot;
                        </span>
                      </span>
                    )}
                    {item.type === 'PAYMENT' && (
                      <span className="font-medium text-purple-600">
                        পেমেন্ট কমপ্লিট: {item.target}
                      </span>
                    )}
                    {item.type === 'REGISTRATION' && (
                      <span>
                        ইভেন্টে জয়েন করেছেন:{' '}
                        <span className="font-medium text-emerald-600">
                          {item.target}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
