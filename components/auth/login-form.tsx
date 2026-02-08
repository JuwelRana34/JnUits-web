'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Loader2 } from 'lucide-react'

import { authClient } from '@/lib/auth/auth-client'

import { TwoFactorForm } from './two-factor-form'

export function LoginForm() {
  const router = useRouter()
  const [isOTPRequired, setIsOTPRequired] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    await authClient.signIn.email(formData, {
      onSuccess: async (ctx) => {
        if (ctx.data.twoFactorRedirect) {
          const { error: otpError } = await authClient.twoFactor.sendOtp()

          if (otpError) {
            setError(otpError.message || 'Failed to send verification code')
            setLoading(false)
          } else {
            setIsOTPRequired(true)
            setLoading(false)
          }
        } else {
          router.push('/')
          router.refresh()
        }
      },
      onError: (ctx) => {
        setLoading(false)
        setError(ctx.error.message || 'Invalid credentials')
      },
    })
  }

  // যদি ২FA প্রয়োজন হয়
  if (isOTPRequired) {
    return <TwoFactorForm onBack={() => setIsOTPRequired(false)} />
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSignIn}>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-zinc-300">
            Email address
          </label>
          <input
            type="email"
            required
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-zinc-300">
            Password
          </label>
          <input
            type="password"
            required
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-500 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  )
}
