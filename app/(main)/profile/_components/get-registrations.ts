'use cache'

import { cacheLife, cacheTag } from 'next/cache'

import prisma from '@/lib/prismadb'

export async function getCachedRegistrations(userId: string) {
  cacheTag('registrations', `user-${userId}`)
  cacheLife('minutes')

  return prisma.registration.findMany({
    where: { userId },
    include: { event: true },
    orderBy: { appliedAt: 'desc' },
  })
}
