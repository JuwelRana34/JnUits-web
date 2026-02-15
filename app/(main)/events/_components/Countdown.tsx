'use client'

import { useEffect, useState } from 'react'

export default function Countdown({ deadline }: { deadline: string | Date }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    mins: number
    secs: number
  } | null>(null)

  useEffect(() => {
    const target = new Date(deadline).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        clearInterval(interval)
        setTimeLeft(null)
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
          secs: Math.floor((difference / 1000) % 60),
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  if (!timeLeft)
    return (
      <span className="text-xs font-bold tracking-wider text-red-500 uppercase">
        Registration Closed
      </span>
    )

  return (
    <>
      <h1 className="inline-block animate-pulse text-rose-300">
        Registration Time left:
      </h1>
      <div className="flex justify-center gap-2 rounded py-2 text-center">
        {[
          { label: 'D', value: timeLeft.days },
          { label: 'H', value: timeLeft.hours },
          { label: 'M', value: timeLeft.mins },
          { label: 'S', value: timeLeft.secs },
        ].map((item, i) => (
          <div
            key={i}
            className="min-w-8.7 flex flex-col rounded border border-neutral-700 bg-neutral-800/80 px-2 py-1"
          >
            <span className="text-sm leading-tight font-bold text-indigo-400">
              {item.value}
            </span>
            <span className="text-[10px] text-neutral-500 uppercase">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}
