'use client'

import { useRouter } from 'next/navigation'

import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

export default function RegisterButton({ eventId }: { eventId: string }) {
  const router = useRouter()

  return (
    <HoverBorderGradient
      containerClassName="rounded-full w-full"
      as="button"
      onClick={() => router.push(`/events/${eventId}`)}
      className="flex w-full items-center justify-center bg-black text-sm font-medium text-white"
    >
      Details & Register
    </HoverBorderGradient>
  )
}
