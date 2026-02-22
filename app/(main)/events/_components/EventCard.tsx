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
    <Card className="group overflow-hidden border-neutral-400 pt-0 transition-all hover:border-blue-400">
      <div className="relative h-48 w-full overflow-hidden">
        {/* <CldImage
              src={event.image}
              alt={event.name ?? 'Profile'}
              fill
              sizes="(max-width: 768px) 96px, 112px"
              crop="fill"
              gravity="auto"
              format="auto"
              quality="auto"
              className="object-cover"
            /> */}
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={event.isPaid ? 'destructive' : 'default'}>
            {event.isPaid ? 'Paid' : 'Free'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3">
        <h3 className="mb-2 line-clamp-2 text-xl font-semibold capitalize">
          {event.title}
        </h3>

        <div className="mb-4 flex flex-col gap-2 text-sm text-neutral-400">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-indigo-400" />
            <span>
              Deadline: {new Date(event.deadline).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-emerald-400" />
            <span>Fee: {event.fee > 0 ? `${event.fee} BDT` : 'Free'}</span>
          </div>
        </div>

        <div
          className="line-clamp-2 text-sm text-neutral-500"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />

        <Countdown deadline={event.deadline} />
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Suspense
          fallback={
            <Button
              disabled
              className="w-full cursor-not-allowed border-0 bg-linear-to-r from-blue-600 to-indigo-600 font-semibold text-white opacity-70"
            >
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Loading...
              </div>
            </Button>
          }
        >
          <RegisterButton event={event} />
        </Suspense>
      </CardFooter>
    </Card>
  )
}
