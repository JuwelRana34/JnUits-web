// 'use client'

// import React, { useEffect, useState } from 'react'

// import { CldImage } from 'next-cloudinary'

// import { Crown } from 'lucide-react'

// import { cn } from '@/lib/utils'

// export const InfiniteMovingCards = ({
//   items,
//   direction = 'left',
//   speed = 'fast',
//   pauseOnHover = true,
//   className,
// }: {
//   items: {
//     name: string
//     points: number
//     image: string
//     rank: number
//   }[]
//   direction?: 'left' | 'right'
//   speed?: 'fast' | 'normal' | 'slow'
//   pauseOnHover?: boolean
//   className?: string
// }) => {
//   const containerRef = React.useRef<HTMLDivElement>(null)
//   const scrollerRef = React.useRef<HTMLUListElement>(null)

//   const [start, setStart] = useState(false)

//   useEffect(() => {
//     addAnimation()
//   }, [])

//   function addAnimation() {
//     if (containerRef.current && scrollerRef.current) {
//       const scrollerContent = Array.from(scrollerRef.current.children)

//       scrollerContent.forEach((item) => {
//         const duplicatedItem = item.cloneNode(true)
//         if (scrollerRef.current) {
//           scrollerRef.current.appendChild(duplicatedItem)
//         }
//       })

//       getDirection()
//       getSpeed()
//       setStart(true)
//     }
//   }

//   const getDirection = () => {
//     if (containerRef.current) {
//       containerRef.current.style.setProperty(
//         '--animation-direction',
//         direction === 'left' ? 'forwards' : 'reverse'
//       )
//     }
//   }

//   const getSpeed = () => {
//     if (containerRef.current) {
//       const duration =
//         speed === 'fast' ? '20s' : speed === 'normal' ? '40s' : '80s'
//       containerRef.current.style.setProperty('--animation-duration', duration)
//     }
//   }

//   return (
//     <div
//       ref={containerRef}
//       className={cn(
//         'relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]',
//         className
//       )}
//     >
//       <ul
//         ref={scrollerRef}
//         className={cn(
//           'flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-8 ',
//           start && 'animate-scroll',
//           pauseOnHover && 'hover:paused'
//         )}
//       >
//         {items.map((item, idx) => (
//           <li
//             key={`${item.name}-${idx}`}
//             className={cn(
//               'relative w-72 shrink-0 rounded-3xl border border-white/20 px-6 py-5 shadow-xl transition-all duration-300 md:w-80',
//               'bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80',
//               item.rank === 1 &&
//                 'ring-2 shadow-yellow-500/10 ring-yellow-400/50' // Rank 1 special glow
//             )}
//           >
//             {/* Rank 1 Crown Icon */}
//             {item.rank === 1 && (
//               <div className="absolute -top-5 left-1/2 z-30 -translate-x-1/2 drop-shadow-lg">
//                 <Crown className="h-8 w-8 animate-bounce fill-yellow-400 text-yellow-500 duration-3000" />
//               </div>
//             )}

//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <div
//                   className={cn(
//                     'relative h-14 w-14 overflow-hidden rounded-full border-2',
//                     item.rank === 1 ? 'border-yellow-500' : 'border-cyan-500'
//                   )}
//                 >
//                   <CldImage
//                     src={item.image || '/default-avatar.png'}
//                     alt={item.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 {/* Rank Badge */}
//                 <div
//                   className={cn(
//                     'absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white shadow-md',
//                     item.rank === 1 ? 'bg-yellow-500' : 'bg-cyan-600'
//                   )}
//                 >
//                   {item.rank}
//                 </div>
//               </div>

//               <div className="flex flex-col">
//                 <h4 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
//                   {item.name}
//                 </h4>
//                 <div className="flex items-center gap-1.5">
//                   <span className="flex h-2 w-2 rounded-full bg-cyan-500" />
//                   <span className="text-xs font-semibold tracking-wider text-cyan-600 uppercase dark:text-cyan-400">
//                     {item.points.toLocaleString()} Points
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Background Aesthetic Gradient */}
//             <div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-br from-cyan-500/5 to-transparent dark:from-cyan-500/10" />
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

'use client'

import React, { useCallback, useEffect, useRef } from 'react'

import { CldImage } from 'next-cloudinary'

import { Crown } from 'lucide-react'

import { cn } from '@/lib/utils'

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: {
    name: string
    points: number
    image: string
    rank: number
  }[]
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  pauseOnHover?: boolean
  className?: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLUListElement>(null)

  const getDirection = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        '--animation-direction',
        direction === 'left' ? 'forwards' : 'reverse'
      )
    }
  }, [direction])

  const getSpeed = useCallback(() => {
    if (containerRef.current) {
      const duration =
        speed === 'fast' ? '20s' : speed === 'normal' ? '40s' : '80s'
      containerRef.current.style.setProperty('--animation-duration', duration)
    }
  }, [speed])

  const addAnimation = useCallback(() => {
    const container = containerRef.current
    const scroller = scrollerRef.current
    if (!container || !scroller) return

    // Duplicate items for infinite scroll
    Array.from(scroller.children).forEach((item) => {
      scroller.appendChild(item.cloneNode(true))
    })

    // Apply direction + speed directly to the DOM (external system update)
    getDirection()
    getSpeed()

    // Add the animation class directly to the DOM — no setState needed
    scroller.classList.add('animate-scroll')
  }, [getDirection, getSpeed])

  useEffect(() => {
    addAnimation()
  }, [addAnimation])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-8',
          pauseOnHover && 'hover:paused'
        )}
      >
        {items.map((item, idx) => (
          <li
            key={`${item.name}-${idx}`}
            className={cn(
              'relative w-72 shrink-0 rounded-3xl border border-white/20 px-6 py-5 shadow-xl transition-all duration-300 md:w-80',
              'bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80',
              item.rank === 1 &&
                'ring-2 shadow-yellow-500/10 ring-yellow-400/50'
            )}
          >
            {/* Rank 1 Crown Icon */}
            {item.rank === 1 && (
              <div className="absolute -top-5 left-1/2 z-30 -translate-x-1/2 drop-shadow-lg">
                <Crown className="h-8 w-8 animate-bounce fill-yellow-400 text-yellow-500 duration-3000" />
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={cn(
                    'relative h-14 w-14 overflow-hidden rounded-full border-2',
                    item.rank === 1 ? 'border-yellow-500' : 'border-cyan-500'
                  )}
                >
                  <CldImage
                    src={item.image || '/default-avatar.png'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Rank Badge */}
                <div
                  className={cn(
                    'absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white shadow-md',
                    item.rank === 1 ? 'bg-yellow-500' : 'bg-cyan-600'
                  )}
                >
                  {item.rank}
                </div>
              </div>

              <div className="flex flex-col">
                <h4 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {item.name}
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-cyan-500" />
                  <span className="text-xs font-semibold tracking-wider text-cyan-600 uppercase dark:text-cyan-400">
                    {item.points.toLocaleString()} Points
                  </span>
                </div>
              </div>
            </div>

            {/* Background Aesthetic Gradient */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-br from-cyan-500/5 to-transparent dark:from-cyan-500/10" />
          </li>
        ))}
      </ul>
    </div>
  )
}
