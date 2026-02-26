'use client'

import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards'

interface Member {
  id: string
  name: string | null
  email: string | null
  image: string | null
  points: number
}

export function TopMembersScroller({ members }: { members: Member[] }) {
  const items = members.map((member, index) => ({
    name: member.name ?? 'Anonymous',
    points: member.points,
    image: member.image ?? '/default-avatar.png',
    rank: index + 1,
  }))

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl py-4 antialiased">
      <InfiniteMovingCards items={items} direction="left" speed="slow" />
    </div>
  )
}
