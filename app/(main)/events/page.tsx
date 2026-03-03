import { cacheLife, cacheTag } from 'next/cache'

import { getEvents } from '@/actions/event'

import EventCard from './_components/EventCard'

export default async function EventsPage() {
  'use cache'
  cacheLife('max')
  cacheTag('all-events')

  const events = await getEvents()

  return (
    <div className="relative min-h-screen px-4 py-5 antialiased">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="bg-linear-to-b from-emerald-200 to-blue-500 bg-clip-text pb-5 text-5xl font-bold text-transparent md:text-7xl">
            Upcoming Events
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-neutral-500">
            Join our workshops, seminars, and courses to enhance your skills.
          </p>
        </div>

        {events.length === 0 ? (
          <h1 className="text-center text-4xl text-slate-200">
            No Events Found!
          </h1>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
