'use server'

import { revalidateTag, updateTag } from 'next/cache'

import { prisma } from '@/lib/prismadb'

type RegistrationInput = {
  isGuest: boolean
  eventId: string
  userId?: string
  name: string
  email: string
  phone?: string
  trxId?: string
  provider?: string
  isPaid: boolean
  fee: number
  isBCC: boolean
  gender?: string
  facebook?: string
  basicSkills?: string
  coupon?: string
  screenshotUrl?: string
}

export async function registerForEvent(data: RegistrationInput) {
  try {
    let finalFee = data.fee

    // ── Duplicate registration check ───────────────────────────────
    if (data.isGuest) {
      const existing = await prisma.guestRegistration.findFirst({
        where: { email: data.email, eventId: data.eventId },
      })
      if (existing)
        return {
          success: false,
          error: 'You have already registered for this event.',
        }
    } else {
      const existing = await prisma.registration.findFirst({
        where: { userId: data.userId, eventId: data.eventId },
      })
      if (existing)
        return {
          success: false,
          error: 'You have already registered for this event.',
        }
    }

    // ── Coupon validation ──────────────────────────────────────────
    let couponId: string | null = null

    if (data.coupon) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: data.coupon },
      })

      if (!coupon || !coupon.isActive)
        return { success: false, error: 'Invalid or inactive coupon.' }

      if (coupon.expiresAt && coupon.expiresAt < new Date())
        return { success: false, error: 'This coupon has expired.' }

      if (coupon.usedCount >= coupon.maxUses)
        return { success: false, error: 'Coupon usage limit reached.' }

      if (
        coupon.couponType === 'EVENT_SPECIFIC' &&
        coupon.eventId !== data.eventId
      )
        return {
          success: false,
          error: 'This coupon is not valid for this event.',
        }

      if (coupon.memberOnly && data.isGuest)
        return { success: false, error: 'This coupon is for members only.' }

      // Per-user/email check — CouponUsage model দিয়ে
      const alreadyUsed = await prisma.couponUsage.findFirst({
        where: {
          couponId: coupon.id,
          ...(data.userId
            ? { userId: data.userId } // Member হলে userId দিয়ে check
            : { email: data.email }), // Guest হলে email দিয়ে check
        },
      })
      if (alreadyUsed)
        return { success: false, error: 'You have already used this coupon.' }

      // Discount calculate
      if (coupon.discountType === 'FREE') {
        finalFee = 0
      } else if (coupon.discountType === 'PERCENT') {
        finalFee = Math.max(
          0,
          data.fee - Math.floor((data.fee * coupon.discount) / 100)
        )
      } else {
        finalFee = Math.max(0, data.fee - coupon.discount)
      }

      couponId = coupon.id

      // usedCount increment + CouponUsage record
      await prisma.$transaction([
        prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        }),
        prisma.couponUsage.create({
          data: {
            couponId: coupon.id,
            userId: data.userId ?? null,
            email: data.email,
          },
        }),
      ])
    }

    // ── BCC metadata ───────────────────────────────────────────────
    const metadata = data.isBCC
      ? {
          gender: data.gender ?? null,
          facebook: data.facebook ?? null,
          basicSkills: data.basicSkills ?? null,
          coupon: data.coupon ?? null,
          screenshotUrl: data.screenshotUrl ?? null,
          discountApplied: data.fee - finalFee,
        }
      : null

    // paid + trxId আছে + free না হলেই payment create হবে
    const shouldCreatePayment = data.isPaid && !!data.trxId && finalFee > 0

    // ── Guest registration ─────────────────────────────────────────
    if (data.isGuest) {
      const guestReg = await prisma.guestRegistration.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone ?? '',
          eventId: data.eventId,
          metadata,
          ...(shouldCreatePayment
            ? {
                payments: {
                  create: {
                    amount: String(finalFee),
                    transactionId: data.trxId!,
                    provider: data.provider ?? null,
                    status: 'PENDING',
                  },
                },
              }
            : {}),
        },
      })
      updateTag(`event-registrations-${data.eventId}`)
      return { success: true, registration: guestReg }
    }

    // ── Member registration ────────────────────────────────────────
    const registration = await prisma.registration.create({
      data: {
        userId: data.userId ?? null,
        eventId: data.eventId,
        metadata,
        ...(shouldCreatePayment
          ? {
              payments: {
                create: {
                  amount: String(finalFee),
                  transactionId: data.trxId!,
                  provider: data.provider ?? null,
                  status: 'PENDING',
                  userId: data.userId ?? null,
                },
              },
            }
          : {}),
      },
    })
    updateTag(`event-registrations-${data.eventId}`)
    return { success: true, registration }
  } catch (error) {
    console.error('[registerForEvent]', error)
    return { success: false, error: 'Registration failed. Please try again.' }
  }
}
