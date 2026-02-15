'use server'
import { revalidateTag } from 'next/cache'

import { z } from 'zod'

import { getCachedSession } from '@/lib/auth/getSession'
import { prisma } from '@/lib/prismadb'
import { eventSchema } from '@/lib/validationSchema/event'

export async function createEvent(data: z.infer<typeof eventSchema>) {
  try {
    const session = await getCachedSession()
    // FIXME: need to change permission to admin
    if (session?.user.role !== 'USER')
      return { success: false, message: 'Action not parmit for you.' }
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
      },
    })
    revalidateTag('all-events', 'max')
    return { success: true, event }
  } catch (error) {
    console.error(error)

    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation error', issues: error.issues }
    }

    return { success: false, error: 'Failed to create event' }
  }
}
