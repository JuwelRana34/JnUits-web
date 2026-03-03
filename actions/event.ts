'use server'
import { updateTag } from 'next/cache'

import { z } from 'zod'

import { getCachedSession } from '@/lib/auth/getSession'
import { prisma } from '@/lib/prismadb'
import { eventSchema } from '@/lib/validationSchema/event'

export async function createEvent(data: z.infer<typeof eventSchema>) {
  try {
    const session = await getCachedSession()
    // FIXME: need to change permission to admin
    const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'EXECUTIVE', 'SUB_EXECUTIVE']

    if (!session?.user.role || !allowedRoles.includes(session.user.role)) {
      return { success: false, message: 'Action not permitted for you.' }
    }

    const validated = eventSchema.parse(data)

    const event = await prisma.event.create({
      data: {
        title: validated.title,
        fee: validated.fee,
        isPaid: validated.isPaid,
        isActive: validated.isActive,
        description: validated.description,
        image: validated.image,
        deadline: new Date(validated.deadline),
        isPublic: validated.isPublic,
        type: validated.type,
      },
    })
    updateTag('all-events')
    return { success: true, event }
  } catch (error) {
    console.error(error)

    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation error', issues: error.issues }
    }

    return { success: false, error: 'Failed to create event' }
  }
}

export async function getEvents() {
  return await prisma.event.findMany({
    where: { isActive: true },
    orderBy: { deadline: 'asc' },
  })
}
