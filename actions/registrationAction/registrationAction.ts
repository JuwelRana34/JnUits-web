'use server'

import { updateTag } from 'next/cache'

import { z } from 'zod'

import prisma from '@/lib/prismadb'

// ✅ Updated Zod Schema
const RegistrationSchema = z.discriminatedUnion('isGuest', [
  // Member Registration
  z
    .object({
      isGuest: z.literal(false),
      eventId: z.string().min(1, 'Event ID is required'),
      userId: z.string().min(1, 'User ID is required'),
      name: z.string().min(3, 'Name must be at least 3 characters'),
      email: z.string().email('Invalid email address'),
      phone: z.string().optional(),
      isPaid: z.boolean(),
      fee: z.number().default(0),
      trxId: z.string().optional(),
      provider: z.enum(['bKash', 'Rocket', 'Nagad', 'Bank']).default('bKash'),
    })
    .refine((data) => !data.isPaid || (data.trxId && data.trxId.length >= 8), {
      message: 'Valid Transaction ID is required for paid events.',
      path: ['trxId'],
    }),

  // Guest Registration
  z
    .object({
      isGuest: z.literal(true),
      eventId: z.string().min(1, 'Event ID is required'),
      userId: z.undefined(),
      name: z.string().min(3, 'Name must be at least 3 characters'),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(11, 'Valid phone number is required'),
      isPaid: z.boolean(),
      fee: z.number().default(0),
      trxId: z.string().optional(),
      provider: z.enum(['bKash', 'Rocket', 'Nagad', 'Bank']).default('bKash'),
    })
    .refine((data) => !data.isPaid || (data.trxId && data.trxId.length >= 8), {
      message: 'Valid Transaction ID is required for paid events.',
      path: ['trxId'],
    }),
])

type RegistrationInput = z.input<typeof RegistrationSchema>

export async function registerForEvent(formData: RegistrationInput) {
  const parsed = RegistrationSchema.safeParse(formData)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message
    return { success: false, error: firstError || 'Invalid data provided.' }
  }

  const data = parsed.data
  const { eventId, email, isPaid, fee, trxId, provider } = data

  // Duplicate check
  if (!data.isGuest) {
    const existing = await prisma.registration.findFirst({
      where: { userId: data.userId, eventId },
    })
    if (existing)
      return {
        success: false,
        error: 'You are already registered for this event.',
      }
  } else {
    const existing = await prisma.guestRegistration.findFirst({
      where: { email, eventId },
    })
    if (existing)
      return {
        success: false,
        error: 'This email is already registered for this event.',
      }
  }

  // Transaction ID duplicate check
  if (isPaid && trxId) {
    const existingPayment = await prisma.payment.findUnique({
      where: { transactionId: trxId },
    })
    if (existingPayment)
      return {
        success: false,
        error: 'This Transaction ID has already been used.',
      }
  }

  const paymentData =
    isPaid && trxId
      ? {
          create: {
            transactionId: trxId,
            amount: String(fee ?? 0),
            provider: provider || 'bKash',
          },
        }
      : undefined

  // ✅ Member
  if (!data.isGuest) {
    await prisma.registration.create({
      data: {
        eventId,
        userId: data.userId,
        status: 'PENDING',
        ...(paymentData && {
          payments: {
            create: { ...paymentData.create, userId: data.userId },
          },
        }),
      },
    })
    updateTag(`user-registrations-${data.userId}`)
  }

  // ✅ Guest
  else {
    await prisma.guestRegistration.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventId,
        status: 'PENDING',
        ...(paymentData && { payments: paymentData }),
      },
    })
  }

  return { success: true }
}
