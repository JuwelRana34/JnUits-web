'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Loader2, Mail, ShieldCheck } from 'lucide-react'

import { resendVerificationEmail } from '@/actions/profile'
import Enable2FA from '@/components/auth/Enable2FA'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth/auth-client'

interface ProfileSecurityControlsProps {
  emailVerified: boolean
  twoFactorEnabled: boolean
}

export default function ProfileSecurityControls({
  emailVerified,
  twoFactorEnabled,
}: ProfileSecurityControlsProps) {
  const router = useRouter()
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [showEnable2FADialog, setShowEnable2FADialog] = useState(false)
  const [showDisable2FADialog, setShowDisable2FADialog] = useState(false)
  const [disablePassword, setDisablePassword] = useState('')
  const [disableLoading, setDisableLoading] = useState(false)

  const handleResendVerification = async () => {
    setResendLoading(true)
    setResendMessage(null)
    const result = await resendVerificationEmail()
    setResendLoading(false)
    if (result?.success) {
      setResendMessage({
        type: 'success',
        text: 'Verification email sent! Check your inbox.',
      })
      router.refresh()
    } else if (result?.error) {
      setResendMessage({ type: 'error', text: result.error })
    }
  }

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!disablePassword) return
    setDisableLoading(true)
    const { error } = await authClient.twoFactor.disable({
      password: disablePassword,
    })
    setDisableLoading(false)
    if (!error) {
      setShowDisable2FADialog(false)
      setDisablePassword('')
      router.refresh()
    } else {
      setResendMessage({
        type: 'error',
        text: error?.message ?? 'Failed to disable 2FA',
      })
    }
  }

  return (
    <div className="space-y-2">
      {/* Email Verified */}
      <div className="bg-muted/30 flex flex-col gap-2 rounded-lg border px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Mail className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">Email Verified</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium ${emailVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-500'}`}
          >
            {emailVerified ? 'Yes' : 'Pending'}
          </span>
          {!emailVerified && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={resendLoading}
              className="h-7 text-xs"
            >
              {resendLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                'Resend'
              )}
            </Button>
          )}
        </div>
      </div>
      {resendMessage && (
        <p
          className={`text-xs ${resendMessage.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}
        >
          {resendMessage.text}
        </p>
      )}

      {/* Two-Factor Auth */}
      <div className="bg-muted/30 flex flex-col gap-2 rounded-lg border px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">Two-Factor Auth</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium ${twoFactorEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}
          >
            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </span>
          {twoFactorEnabled ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDisable2FADialog(true)}
              className="h-7 text-xs"
            >
              Disable
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEnable2FADialog(true)}
              className="h-7 text-xs"
            >
              Enable
            </Button>
          )}
        </div>
      </div>

      {/* Enable 2FA Dialog */}
      <Dialog open={showEnable2FADialog} onOpenChange={setShowEnable2FADialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Auth</DialogTitle>
            <DialogDescription>
              Add an extra layer of security to your account.
            </DialogDescription>
          </DialogHeader>
          <Enable2FA />
        </DialogContent>
      </Dialog>

      {/* Disable 2FA Dialog */}
      <Dialog
        open={showDisable2FADialog}
        onOpenChange={setShowDisable2FADialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Auth</DialogTitle>
            <DialogDescription>
              Enter your password to disable 2FA. Your account will be less
              secure.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDisable2FA} className="space-y-4">
            <Input
              type="password"
              placeholder="Current password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              required
              disabled={disableLoading}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDisable2FADialog(false)}
                disabled={disableLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={disableLoading}>
                {disableLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Disable 2FA'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
