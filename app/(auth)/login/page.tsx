'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth-client'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOTPRequired, setIsOTPRequired] = useState(false)
  const [useBackupCode, setUseBackupCode] = useState(false) // ব্যাকআপ কোড মোড

  // ১. সাইন-ইন ফাংশন
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: (ctx) => {
          if (ctx.data.twoFactorRedirect) {
            setIsOTPRequired(true)
            setLoading(false)
          } else {
            router.push('/')
          }
        },
        onError: (ctx) => {
          setLoading(false)
          setError(ctx.error.message || 'Invalid email or password')
        },
      }
    )
  }

  // ২. ওটিপি বা ব্যাকআপ কোড ভেরিফাই ফাংশন
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (useBackupCode) {
      const { data, error: backupError } =
        await authClient.twoFactor.verifyBackupCode({
          code: otp.trim(),
        })

      if (backupError) {
        setLoading(false)
        setError(backupError.message || 'Invalid backup code')
      } else {
        router.push('/') // সফল হলে হোম পেজে
      }
    } else {
      // ওটিপি ভেরিফিকেশন (আগের মতোই)
      const { error: verifyError } = await authClient.twoFactor.verifyOtp({
        code: otp.trim(),
      })

      if (verifyError) {
        setLoading(false)
        setError(verifyError.message || 'Invalid OTP')
      } else {
        router.push('/')
      }
    }
  }

  const handleResendOTP = async () => {
    setError('')
    setLoading(true)
    const { error } = await authClient.twoFactor.sendOtp()
    setLoading(false)
    if (error) setError(error.message || 'Failed to resend OTP')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isOTPRequired ? '2FA Verification' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            {isOTPRequired
              ? useBackupCode
                ? 'Enter your recovery backup code'
                : 'We sent a 6-digit code to your email'
              : 'Sign in to your account'}
          </p>
        </div>

        {!isOTPRequired ? (
          /* --- সাধারণ লগইন ফর্ম --- */
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* --- 2FA (OTP/Backup Code) ফর্ম --- */
          <form className="mt-8 space-y-5" onSubmit={handleVerify2FA}>
            <div>
              <label className="mb-1.5 block text-center text-sm font-medium text-gray-700 dark:text-zinc-300">
                {useBackupCode ? 'Enter Backup Code' : 'Enter 6-digit OTP'}
              </label>
              <input
                type="text"
                required
                autoFocus
                className={`block w-full rounded-lg border border-gray-300 bg-white px-4 py-4 text-center text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white ${!useBackupCode ? 'font-mono text-3xl tracking-[0.5em]' : 'text-lg'}`}
                placeholder={useBackupCode ? 'xxxxx-xxxxx' : '000000'}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-500 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <div className="flex flex-col items-center gap-2 text-sm">
              {!useBackupCode ? (
                <>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Resend OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUseBackupCode(true)
                      setOtp('')
                      setError('')
                    }}
                    className="text-gray-500 hover:underline"
                  >
                    Use Backup Code
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setUseBackupCode(false)
                    setOtp('')
                    setError('')
                  }}
                  className="text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Use Email OTP
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOTPRequired(false)}
                className="text-gray-400 hover:underline"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
