'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  ChevronLeft,
  KeySquare,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  sendOTPAction,
  verifyBackupCodeAction,
  verifyOTPAction,
} from '@/lib/auth/auth-client'

interface TwoFactorFormProps {
  onBack: () => void
}

export function TwoFactorForm({ onBack }: TwoFactorFormProps) {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) return setError('Please enter the code')

    setLoading(true)
    setError('')

    try {
      // ✅ সরাসরি অ্যাকশনগুলো ব্যবহার করা বেশি ক্লিন
      const { error: resError } = useBackupCode
        ? await verifyBackupCodeAction(otp)
        : await verifyOTPAction(otp)

      if (resError) {
        const msg = resError.message || 'Verification failed. Please try again.'
        setError(msg)
        toast.error(msg)
        setLoading(false)
      } else {
        toast.success('Successfully verified!')
        router.push('/')
        router.refresh()
      }
    } catch {
      toast.error('An unexpected error occurred')
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResending(true)
    try {
      const { error: resendError } = await sendOTPAction()
      if (resendError) {
        toast.error(resendError.message || 'Failed to resend OTP')
      } else {
        toast.success('A new OTP has been sent to your email.')
      }
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
          <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">
          Two-Factor Authentication
        </h2>
        <p className="text-muted-foreground text-sm">
          {useBackupCode
            ? 'Enter one of your 10-character backup codes.'
            : 'Enter the 6-digit code sent to your email.'}
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp" className="text-sm font-medium">
            {useBackupCode ? 'Backup Code' : 'Verification Code'}
          </Label>
          <Input
            id="otp"
            type="text"
            placeholder={useBackupCode ? 'XXXXX-XXXXX' : '000000'}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={`text-center text-lg font-semibold tracking-widest ${
              !useBackupCode && 'font-mono'
            }`}
            autoFocus
            disabled={loading}
          />
          {error && (
            <p className="text-destructive text-xs font-medium">{error}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
            </>
          ) : (
            'Verify & Continue'
          )}
        </Button>
      </form>

      {/* Footer Actions */}
      <div className="flex flex-col space-y-3 pt-2">
        {!useBackupCode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResendOTP}
            disabled={resending || loading}
            className="text-muted-foreground text-xs hover:text-indigo-600"
          >
            <RefreshCw
              className={`mr-2 h-3.5 w-3.5 ${resending && 'animate-spin'}`}
            />
            Resend Code
          </Button>
        )}

        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="link"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground px-0 text-xs"
          >
            <ChevronLeft className="mr-1 h-3 w-3" /> Back to Login
          </Button>

          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setUseBackupCode(!useBackupCode)
              setOtp('')
              setError('')
            }}
            className="px-0 text-xs text-indigo-600 dark:text-indigo-400"
          >
            <KeySquare className="mr-1.5 h-3.5 w-3.5" />
            {useBackupCode ? 'Use OTP instead' : 'Use Backup Code'}
          </Button>
        </div>
      </div>
    </div>
  )
}
