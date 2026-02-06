'use client'
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth-client'

export default function OTPVerify() {
  const [otp, setOtp] = useState('')
  const router = useRouter()

  const handleVerify = async () => {
    await authClient.twoFactor.verifyOtp(
      {
        code: otp,
      },
      {
        onSuccess: () => {
          alert('Login Successful!')
          router.push('/dashboard')
        },
        onError: (ctx) => alert(ctx.error.message),
      }
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-gray-600">
        Enter the OTP sent to your email
      </p>
      <input
        type="text"
        maxLength={6}
        className="w-full rounded-lg border p-3 text-center text-2xl tracking-widest outline-none focus:ring-2 focus:ring-indigo-500"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="000000"
      />
      <button
        onClick={handleVerify}
        className="w-full rounded-lg bg-indigo-600 py-3 font-bold text-white"
      >
        Verify & Login
      </button>
    </div>
  )
}
