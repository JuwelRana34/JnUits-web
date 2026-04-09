'use client';

import { useEffect, useState } from 'react';

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
    <div className="flex flex-col items-center gap-4">
      <h1 
        className="
          text-center text-lg font-extrabold uppercase tracking-widest 

          text-transparent bg-clip-text    
          bg-gradient-to-r from-rose-500 from-[40%] via-rose-100 via-[50%] to-rose-500 to-[60%]
          bg-[size:300%_auto] 
          animate-shine                    
        "
      >
        Registration Time Left:
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
            className="min-w-[4rem] flex flex-col items-center rounded border border-slate-400/50 bg-slate-700 px-2 py-1 shadow-md shadow-blue-500/20"
          >
            <span className="text-sm leading-tight font-bold text-slate-200">
              {item.value}
            </span>
            <span className="text-[10px] text-slate-200 uppercase">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}