import Image from 'next/image'

import { Banknote, CalendarDays } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
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
    <Card className="group overflow-hidden border-neutral-800 bg-neutral-900/50 pt-0 transition-all hover:border-neutral-700">
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
        <h3 className="mb-2 line-clamp-1 text-xl font-semibold text-neutral-100">
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
        <RegisterButton eventId={event.id} />
      </CardFooter>
    </Card>
  )
}
