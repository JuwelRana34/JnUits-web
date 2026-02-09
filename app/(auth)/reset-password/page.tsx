'use client'

import { Suspense, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth/auth-client'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError('Token is missing. Please click the link from your email again.')
      return
    }

    setLoading(true)
    setError('')

    await authClient.resetPassword(
      {
        newPassword: password,
        token: token,
      },
      {
        onSuccess: () => {
          toast.success('Password reset successfully!')
          router.push('/login')
        },
        onError: (ctx) => {
          setError(
            ctx.error.message ||
              'Failed to reset password. Token might be expired.'
          )
          setLoading(false)
        },
      }
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-zinc-950">
      <form
        onSubmit={handleReset}
        className="w-full max-w-sm space-y-4 rounded-2xl border bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h1 className="text-center text-2xl font-bold dark:text-white">
          New Password
        </h1>
        <p className="text-center text-sm text-gray-500">
          Enter a secure new password
        </p>

        {/* পাসওয়ার্ড ইনপুট কন্টেইনার */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'} // স্টেট অনুযায়ী টাইপ চেঞ্জ
            required
            placeholder="New password (min 8 chars)"
            className="w-full rounded-lg border p-3 pr-10 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p className="rounded bg-red-50 p-2 text-xs text-red-500 dark:bg-red-900/20">
            {error}
          </p>
        )}

        <Button
          disabled={loading || !password}
          className="flex w-full items-center justify-center rounded-lg p-3 font-semibold text-white transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Update Password'
          )}
        </Button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
