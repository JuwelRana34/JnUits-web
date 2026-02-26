'use server'

import { cacheLife, cacheTag, revalidateTag, updateTag } from 'next/cache'

import { v2 as cloudinary } from 'cloudinary'

import { verifyAdminAccess, verifyOnlyAdmin } from '@/lib/VerifyAdmin'
import { getPublicIdFromUrl } from '@/lib/getPublicIdOfImage'
import { prisma } from '@/lib/prismadb'

// INFO:user Data type and role
export type UserRole =
  | 'USER'
  | 'MEMBER'
  | 'EXECUTIVE'
  | 'SUB_EXECUTIVE'
  | 'ADMIN'
  | 'SUPER_ADMIN'

export type UserData = {
  id: string
  name: string | null
  email: string | null
  studentId: string
  department: string
  role: UserRole
  points: number
  phoneNumber: string
  banned: boolean
}

export async function fetchUsersFromDB(page: number = 1, limit: number = 10) {
  'use cache'
  cacheTag('management-users')
  cacheLife('days')
  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          studentId: true,
          department: true,
          role: true,
          points: true,
          phoneNumber: true,
          banned: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ])

    return {
      users: users as UserData[],
      total,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { users: [], total: 0, totalPages: 0 }
  }
}

export async function updateUserRole(userId: string, newRole: UserRole) {
  await verifyOnlyAdmin()

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })
    revalidateTag('management-users', 'max')
    return { success: true }
  } catch {
    throw new Error('Failed to update user role')
  }
}

export async function updatePoints(userId: string, pointsToAdd: number) {
  await verifyAdminAccess()
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        points: { increment: pointsToAdd },
      },
      select: { points: true },
    })

    revalidateTag('management-users', 'max')
    updateTag(`user-${userId}`)
    updateTag('top-active-members')

    return { success: true, newTotal: updated.points }
  } catch (error) {
    console.error('Update points error:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update points'
    )
  }
}

export async function banUser(userId: string, reason: string) {
  try {
    await verifyAdminAccess()

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) throw new Error('User not found')

    const isCurrentlyBanned = user.banned || false

    await prisma.user.update({
      where: { id: userId },
      data: {
        banned: !isCurrentlyBanned,
        banReason: !isCurrentlyBanned ? reason : null,
      },
    })

    revalidateTag('management-users', 'max')

    return { success: true, banned: !isCurrentlyBanned }
  } catch (error) {
    // ✅ Log the REAL error to see what's actually failing
    console.error('Ban user real error:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to ban user'
    )
  }
}

export async function deleteUser(userId: string) {
  await verifyOnlyAdmin()

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    })

    if (user?.image) {
      const publicId = getPublicIdFromUrl(user.image)
      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId)
        if (result.result !== 'ok' && result.result !== 'not found') {
          console.error('Cloudinary deletion failed:', result)
        } else {
          console.log(`Successfully deleted image with ID: ${publicId}`)
        }
      }
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    revalidateTag('management-users', 'max')
    updateTag('dashboard-stats')
    updateTag('recent-activity')
    return { success: true }
  } catch (error: unknown) {
    console.error('User deletion error:', error)
    throw new Error('Failed to delete user')
  }
}
