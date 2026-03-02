'use server'

import { revalidatePath } from 'next/cache'

import { getCachedSession } from '@/lib/auth/getSession'
import { prisma } from '@/lib/prismadb'

// ─── Auth Check Helper ────────────────────────────────────────────────────────
async function checkAdmin() {
  const session = await getCachedSession()

  const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'EXECUTIVE', 'SUB_EXECUTIVE']

  if (!session?.user.role || !allowedRoles.includes(session.user.role)) {
    return { authorized: false as const, error: 'Unauthorized' }
  }

  return { authorized: true as const }
}

// ─── Create Coupon ────────────────────────────────────────────────────────────
export async function createCoupon(data: {
  code: string
  couponType: 'GLOBAL' | 'EVENT_SPECIFIC'
  discountType: 'FIXED' | 'PERCENT' | 'FREE'
  discount: number
  memberOnly: boolean
  maxUses: number
  expiresAt?: string
  eventId?: string
}) {
  const auth = await checkAdmin()
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        couponType: data.couponType,
        discountType: data.discountType,
        discount: data.discountType === 'FREE' ? 100 : data.discount,
        memberOnly: data.memberOnly,
        maxUses: data.maxUses,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        eventId: data.eventId || null,
      },
    })

    revalidatePath('/admin/coupons')
    return { success: true, coupon }
  } catch {
    return { success: false, error: 'Coupon code already exists.' }
  }
}

// ─── Get All Coupons ──────────────────────────────────────────────────────────
export async function getCoupons() {
  const auth = await checkAdmin()
  if (!auth.authorized)
    return { success: false, error: auth.error, coupons: [] }

  try {
    const coupons = await prisma.coupon.findMany({
      include: { event: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, coupons }
  } catch {
    return { success: false, error: 'Failed to fetch coupons.', coupons: [] }
  }
}

// ─── Toggle Active Status ─────────────────────────────────────────────────────
export async function toggleCouponStatus(id: string) {
  const auth = await checkAdmin()
  if (!auth.authorized) return { success: false, error: auth.error }

  try {
    const coupon = await prisma.coupon.findUnique({ where: { id } })
    if (!coupon) return { success: false, error: 'Coupon not found.' }

    await prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive },
    })

    revalidatePath('/admin/coupons')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update coupon.' }
  }
}

// ─── Validate Coupon (public — registration এ use হবে) ───────────────────────
export async function validateCoupon(data: {
  code: string
  eventId: string
  isGuest: boolean
  fee: number
}) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() },
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

    // Discount calculate
    let finalFee = data.fee
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

    return {
      success: true,
      data: {
        discount: coupon.discount,
        discountType: coupon.discountType as 'FIXED' | 'PERCENT' | 'FREE',
        finalFee,
      },
    }
  } catch {
    return { success: false, error: 'Failed to validate coupon.' }
  }
}

// ─── Delete Coupon ────────────────────────────────────────────────────────────
export async function deleteCoupon(id: string) {
  const auth = await checkAdmin()
  if (!auth.authorized) return { success: false, error: 'Unauthorized' }

  try {
    await prisma.coupon.delete({ where: { id } })
    revalidatePath('/admin/coupons')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete coupon.' }
  }
}
