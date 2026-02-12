'use cache'

import { cacheLife, cacheTag } from 'next/cache'

import prisma from '@/lib/prismadb'

export async function getCachedPosts(userId: string) {
  cacheTag('posts', `posts-user-${userId}`)
  cacheLife('minutes')

  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { id: 'desc' },
  })
}
