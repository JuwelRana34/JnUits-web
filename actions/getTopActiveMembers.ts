'use server'
import { UserRole } from '@prisma/client'

import prisma from '@/lib/prismadb'

export const getTopActiveMembers = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        banned: false,
        role: {
          in: [
            UserRole.MEMBER,
            UserRole.EXECUTIVE,
            UserRole.SUB_EXECUTIVE,
            UserRole.ADMIN,
          ],
        },
      },
      orderBy: {
        points: 'desc',
      },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        points: true,
      },
    })

    return users
  } catch (error) {
    console.error('Top active members fetch error:', error)
    return []
  }
}
