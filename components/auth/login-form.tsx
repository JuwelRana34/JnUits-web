'use client'

import { useState } from 'react'

// Eye আইকনগুলো ইম্পোর্ট করা হয়েছে
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Eye, EyeOff, Loader2, X } from 'lucide-react'

import { authClient } from '@/lib/auth/auth-client'

import { Button } from '../ui/button'
import { TwoFactorForm } from './two-factor-form'

export function LoginForm() {
  const router = useRouter()
  const [isOTPRequired, setIsOTPRequired] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '' })

  // পাসওয়ার্ড টগল এর জন্য স্টেট
  const [showPassword, setShowPassword] = useState(false)

  // Forgot Password এর জন্য স্টেট
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMessage, setForgotMessage] = useState({ type: '', text: '' })

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    setForgotMessage({ type: '', text: '' })

    await authClient.requestPasswordReset(
      {
        email: forgotEmail,
        redirectTo: '/reset-password',
      },
      {
        onSuccess: () => {
          setForgotLoading(false)
          setForgotMessage({
            type: 'success',
            text: 'Password reset link sent to your email!',
          })
          setTimeout(() => setShowForgotModal(false), 3000)
        },
        onError: (ctx) => {
          setForgotLoading(false)
          setForgotMessage({
            type: 'error',
            text: ctx.error.message || 'Something went wrong',
          })
        },
      }
    )
  }

  if (isOTPRequired) {
    return <TwoFactorForm onBack={() => setIsOTPRequired(false)} />
  }

  return (
    <div className="w-full">
      <form className="mt-8 space-y-5" onSubmit={handleSignIn}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Email address
            </label>
            <input
              type="email"
              required
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Forgot password?
              </button>
            </div>
            {/* পাসওয়ার্ড ইনপুট ফিল্ড আপডেট */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-500 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg py-3 font-semibold text-white shadow-sm transition-all disabled:opacity-60"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <p className="text-center text-sm text-gray-600 dark:text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/registration"
            prefetch={false}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Create an account
          </Link>
        </p>
      </form>

      {/*NOTE: Forgot Password Modal */}

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Reset Password
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6 text-sm text-gray-600 dark:text-zinc-400">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                required
                placeholder="email@example.com"
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />

              {forgotMessage.text && (
                <p
                  className={`text-center text-sm ${forgotMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
                >
                  {forgotMessage.text}
                </p>
              )}
              <Button
                type="submit"
                disabled={forgotLoading}
                className="flex w-full items-center justify-center rounded-lg font-semibold text-white transition-all disabled:opacity-60"
              >
                {forgotLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
