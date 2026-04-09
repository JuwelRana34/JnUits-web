import { Suspense } from 'react'
import Image from 'next/image'
import { Banknote, CalendarDays } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

import Countdown from './Countdown'
import RegisterButton from './RegisterButton'

export interface IEvent {
  id: string
  title: string
  fee: number
  isPaid: boolean
  description: string
  image: string
  deadline: string | Date
  isPublic: boolean
  type?: string
}

export default function EventCard({ event }: { event: IEvent }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950 py-0 gap-3">
      {/* 1. Responsive Image Container */}
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden sm:aspect-[4/3] lg:aspect-[16/9]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        
        {/* Subtle dark gradient overlay to make the image look premium */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="absolute right-3 top-3 z-10">
          <Badge 
            variant={event.isPaid ? 'destructive' : 'default'}
            className="font-medium shadow-sm backdrop-blur-md"
          >
            {event.isPaid ? 'Paid Event' : 'Free Entry'}
          </Badge>
        </div>
      </div>

      {/* 2. Card Content Area (flex-1 pushes footer to the bottom) */}
      <CardContent className="flex flex-1 flex-col p-3">
        <h3 className="mb-4 line-clamp-2 text-xl font-bold tracking-tight  dark:text-neutral-50 capitalize">
          {event.title}
        </h3>

        {/* Grouped Meta Information with a subtle background */}
        <div className="mb-5 flex flex-col gap-2.5 rounded-lg bg-neutral-50 p-3.5 text-sm text-neutral-600 dark:bg-neutral-900/50 dark:text-neutral-400">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4.5 w-4.5 shrink-0 text-blue-500" />
            <span className="font-medium">
              Deadline: <span className="text-neutral-900 dark:text-neutral-200">{new Date(event.deadline).toLocaleDateString()}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Banknote className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
            <span className="font-medium">
              Fee: <span className="text-neutral-900 dark:text-neutral-200">{event.fee > 0 ? `${event.fee} BDT` : 'Free'}</span>
            </span>
          </div>
        </div>

        {/* Description */}
        <div
          className="prose prose-sm mb-6 line-clamp-2 text-neutral-500 dark:text-neutral-400"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />

        {/* mt-auto pushes the countdown to the bottom of the content area if description is short */}
        <div className="mt-auto">
          <Countdown deadline={event.deadline} />
        </div>
      </CardContent>

      {/* 3. Footer Area */}
      <CardFooter className="border-t border-neutral-100 p-3 dark:border-neutral-800">
        <Suspense
          fallback={
            <Button
              disabled
              className="w-full cursor-not-allowed bg-blue-600/70 font-semibold text-white shadow-sm"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Preparing Registration...</span>
              </div>
            </Button>
          }
        >
          <div className="w-full">
             <RegisterButton event={event} />
          </div>
        </Suspense>
      </CardFooter>
    </Card>
  )
}





