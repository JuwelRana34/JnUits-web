// // import { Button } from '@/components/ui/button'
// // import { GridPattern } from '@/components/ui/grid-pattern'
// // import { cn } from '@/lib/utils'

// // import { EventProps, OngoingEventCard } from './OngoingEventCard'

// // export function FeaturesSection() {
// //   // Mock data based on Prisma Event model
// //   const mockEvents: EventProps[] = [
// //     {
// //       id: '64a2b1c3e4b0a1234567890a',
// //       title: 'Advanced Web Development Bootcamp',
// //       description:
// //         'Learn modern web development using Next.js, Prisma, and Tailwind CSS. Hands-on projects included.',
// //       fee: 1500,
// //       isPaid: true,
// //       type: 'BCC_COURSE',
// //       image:
// //         'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',

// //       // 🔥 FIX: Added quotes around the date string
// //       deadline: '2026-04-25T23:59:59.000Z',

// //       isFeatured: true,
// //       totalApplicants: 124,
// //     },
// //     {
// //       id: '64a2b1c3e4b0a1234567890b',
// //       title: 'Open Source Contribution Workshop',
// //       description:
// //         'A complete guide on how to make your first open source contribution on GitHub.',
// //       fee: 0,
// //       isPaid: false,
// //       type: 'WORKSHOP',
// //       image:
// //         'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',

// //       // 🔥 FIX: Added quotes around the date string
// //       deadline: '2026-04-25T23:59:59.000Z',

// //       isFeatured: false,
// //       totalApplicants: 89,
// //     },
// //     {
// //       id: '64a2b1c3e4b0a1234567890b',
// //       title: 'Open Source Contribution Workshop',
// //       description:
// //         'A complete guide on how to make your first open source contribution on GitHub.',
// //       fee: 0,
// //       isPaid: false,
// //       type: 'WORKSHOP',
// //       image:
// //         'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',

// //       // 🔥 FIX: Added quotes around the date string
// //       deadline: '2026-04-25T23:59:59.000Z',

// //       isFeatured: false,
// //       totalApplicants: 89,
// //     },
// //   ]

// //   return (
// //     <>
// //       <div className="bg-background relative overflow-hidden p-2">
// //         <GridPattern
// //           width={20}
// //           height={20}
// //           x={-1}
// //           y={-1}
// //           className={cn(
// //             'z-0 [mask-image:linear-gradient(to_bottom_right,white,transparent)]'
// //           )}
// //         />

// //         <div className="my-10 flex items-center justify-center gap-1">
// //           <div className="h-1 w-14 bg-linear-to-l from-cyan-500 to-transparent" />
// //           <h1 className="text-2xl font-bold md:text-4xl">Ongoing Events </h1>
// //           <div className="h-1 w-14 bg-linear-to-r from-cyan-500 to-transparent" />
// //         </div>

// //         {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
// //         <div className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5">
// //           {mockEvents.map((event) => (
// //             <div key={event.id} className="flex justify-center">
// //               <OngoingEventCard event={event} />
// //             </div>
// //           ))}
// //         </div>

// //         <div className="mx-auto w-full my-8">
// //           <Button variant="outline">see all</Button>
// //         </div>
// //       </div>
// //     </>
// //   )
// // }


// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { GridPattern } from '@/components/ui/grid-pattern'
// import { cn } from '@/lib/utils'

// // Tomar actual action er path thik kore nio
// import { EventProps, OngoingEventCard } from './OngoingEventCard'
// import { getOngoingEvents } from '@/actions/EventsActions/EventsManagementAction'

// export async function ONgoingSection() {
//   const { success, events } = await getOngoingEvents()
//   const displayEvents = success && events ? events : []

//   return (
//     <div className="bg-background relative overflow-hidden p-2">
//       {/* Background Grid Pattern */}
//       <GridPattern
//         width={20}
//         height={20}
//         x={-1}
//         y={-1}
//         className={cn(
//           'z-0 md:mask-x-from-90% md:mask-x-to-95%'
//         )}
//       />

//       {/* Header Section */}
//       <div className="my-8 flex items-center justify-center gap-1 relative z-10">
//         <div className="h-1 w-14 bg-linear-to-l from-cyan-500 to-transparent" />
//         <h1 className="text-2xl font-bold md:text-4xl">Ongoing Events</h1>
//         <div className="h-1 w-14 bg-linear-to-r from-cyan-500 to-transparent" />
//       </div>

//       {/* Events Grid Section */}
//       <div className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-1">
//         {displayEvents.length > 0 ? (
//           displayEvents.map((event) => (
//             <div key={event.id} className="flex justify-center w-full sm:w-auto">
//               <OngoingEventCard event={event as EventProps} />
//             </div>
//           ))
//         ) : (
//           // Jodi kono active event na thake
//           <div className="py-12 text-center text-muted-foreground w-full">
//             <p className="text-lg">Currently, there are no ongoing events. Stay tuned!</p>
//           </div>
//         )}
//       </div>

//       {/* See All Button */}
//       <div className="mx-auto w-full my-12 flex justify-center relative z-10">
//         <Link href="/events">
//           <Button variant="outline" className="px-5 capitalize">
//             See All Events
//           </Button>
//         </Link>
//       </div>
//     </div>
//   )
// }


import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GridPattern } from '@/components/ui/grid-pattern'
import { cn } from '@/lib/utils'

import { EventProps, OngoingEventCard } from './OngoingEventCard'
import { getOngoingEvents } from '@/actions/EventsActions/EventsManagementAction'

export async function ONgoingSection() {
  const { success, events } = await getOngoingEvents()
  const displayEvents = success && events ? events : []
  // ইভেন্ট কয়টি আছে 
  const eventCount = displayEvents.length

  return (
    <div className="bg-background relative overflow-hidden p-2">
      {/* Background Grid Pattern */}
      <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn('z-0 md:mask-x-from-90% md:mask-x-to-95%')}
      />

      {/* Header Section */}
      <div className="my-8 flex items-center justify-center gap-1 relative z-10">
        <div className="h-1 w-14 bg-linear-to-l from-cyan-500 to-transparent" />
        <h1 className="text-2xl font-bold md:text-4xl">Ongoing Events</h1>
        <div className="h-1 w-14 bg-linear-to-r from-cyan-500 to-transparent" />
      </div>

      {/* Events Container - ডাইনামিক স্টাইলিং */}
      <div
        className={cn(
          'relative z-10 mx-auto w-full gap-6 px-1',
          eventCount === 1 ? 'flex max-w-lg justify-center' :
          eventCount === 2 ? 'grid max-w-4xl grid-cols-1 sm:grid-cols-2' :
          'grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {eventCount > 0 ? (
          displayEvents.map((event) => (
            <OngoingEventCard key={event.id} event={event as EventProps} />
          ))
        ) : (
          // যদি কোনো active event না থাকে
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <p className="text-lg">Currently, there are no ongoing events. Stay tuned!</p>
          </div>
        )}
      </div>

      {/* See All Button */}
      <div className="mx-auto my-12 flex w-full justify-center relative z-10">
        <Link href="/events">
          <Button variant="outline" className="px-5 capitalize">
            See All Events
          </Button>
        </Link>
      </div>
    </div>
  )
}