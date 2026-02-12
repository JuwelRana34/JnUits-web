'use cache'

import { cacheLife, cacheTag } from 'next/cache'

import prisma from '@/lib/prismadb'

export async function getCachedProfile(userId: string) {
  cacheTag('profile', `user-${userId}`)
  cacheLife('minutes')

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      membershipId: true,
      isExecutive: true,
      points: true,
      studentId: true,
      department: true,
      batch: true,
      gender: true,
      phoneNumber: true,
      showPhone: true,
      showEmail: true,
      twoFactorEnabled: true,
      createdAt: true,
    },
  })
}
