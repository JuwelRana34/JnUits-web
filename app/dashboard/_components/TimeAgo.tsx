'use client'

import { formatDistanceToNow } from 'date-fns'

export function TimeAgo({ timestamp }: { timestamp: string | Date }) {
  return (
    <span
      className="text-muted-foreground text-[12px] font-medium whitespace-nowrap"
      suppressHydrationWarning
    >
      {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
    </span>
  )
}
