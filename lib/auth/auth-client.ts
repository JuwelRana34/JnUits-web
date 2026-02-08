import {
  adminClient,
  inferAdditionalFields,
  twoFactorClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',

  plugins: [
    adminClient(),
    twoFactorClient(),
    inferAdditionalFields({
      user: {
        studentId: { type: 'string' },
        department: { type: 'string' },
        phoneNumber: { type: 'string' },
        batch: { type: 'string' },
        gender: { type: 'string' },
        role: {
          type: 'string',
          defaultValue: 'USER',
        },
      },
    }),
  ],
})

// NOTE: এই ফাইলটি শুধুমাত্র ক্লায়েন্ট-সাইডে ব্যবহারের জন্য তৈরি করা হয়েছে। এখানে আমরা `authClient` তৈরি করছি যা আমাদের অ্যাপ্লিকেশনের বিভিন্ন অংশে ব্যবহার করা হবে সাইন-ইন, টু-ফ্যাক্টর অথেন্টিকেশন ইত্যাদি কাজের জন্য। এছাড়াও, এখানে কিছু হেল্পার ফাংশন রয়েছে যা সাইন-ইন এবং টু-ফ্যাক্টর ভেরিফিকেশন প্রক্রিয়াকে সহজ করে তোলে।

export const handleSignInAction = async (
  data: { email: string; password: string },
  options?: Parameters<typeof authClient.signIn.email>[1]
) => {
  return await authClient.signIn.email(data, options)
}

export const verifyOTPAction = async (code: string) => {
  return await authClient.twoFactor.verifyOtp({
    code: code.trim(),
  })
}

export const verifyBackupCodeAction = async (code: string) => {
  return await authClient.twoFactor.verifyBackupCode({
    code: code.trim(),
  })
}

export const sendOTPAction = async () => {
  return await authClient.twoFactor.sendOtp()
}
