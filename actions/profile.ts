'use server'

import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'

import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prismadb'

export async function resendVerificationEmail(): Promise<{
  success?: boolean
  error?: string
} | void> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return { error: 'You must be signed in.' }
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, emailVerified: true },
  })

  if (!dbUser) return { error: 'User not found.' }
  if (dbUser.emailVerified) return { error: 'Email is already verified.' }
  if (!dbUser.email) return { error: 'No email associated with your account.' }

  const email = dbUser.email

  try {
    await auth.api.sendVerificationEmail({
      body: { email, callbackURL: '/profile' },
      headers: await headers(),
    })
    revalidateTag('profile', 'default')
    revalidateTag(`user-${session.user.id}`, 'default')
    return { success: true }
  } catch {
    return { error: 'Failed to send verification email.' }
  }
}

export type UpdateProfileState = {
  success?: boolean
  error?: string
}

export async function updateProfile(
  _prev: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return { error: 'You must be signed in to update your profile.' }
  }

  const userId = session.user.id

  const name = formData.get('name')?.toString()?.trim()
  const phoneNumber = formData.get('phoneNumber')?.toString()?.trim() ?? ''
  const showPhone = formData.get('showPhone') === 'on'
  const showEmail = formData.get('showEmail') === 'on'

  if (!phoneNumber.trim() || phoneNumber.length < 10) {
    return { error: 'Please enter a valid phone number.' }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name: name || null }),
        phoneNumber,
        showPhone,
        showEmail,
      },
    })

    revalidateTag('profile', 'default')
    revalidateTag(`user-${userId}`, 'default')

    return { success: true }
  } catch {
    return { error: 'Failed to update profile. Please try again.' }
  }
}
