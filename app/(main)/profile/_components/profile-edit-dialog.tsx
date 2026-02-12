'use client'

import { useActionState, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Eye, Loader2, Pencil, Phone } from 'lucide-react'

import { updateProfile } from '@/actions/profile'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface ProfileEditDialogProps {
  user: {
    name: string | null
    email: string | null
    phoneNumber: string
    showPhone: boolean
    showEmail: boolean
  }
}

export default function ProfileEditDialog({ user }: ProfileEditDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(updateProfile, {})

  // Avoid direct setState in effect; use a transition instead for proper flow
  useEffect(() => {
    if (state.success) {
      // Defer state update to next tick to avoid cascading renders
      const timeout = setTimeout(() => {
        setOpen(false)
        router.refresh()
      }, 0)
      return () => clearTimeout(timeout)
    }
  }, [state.success, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="h-full overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile and control what others can see. You only see
            and edit your own data.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-6">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Display Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  defaultValue={user.name ?? ''}
                  placeholder="Your name"
                  disabled={isPending}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  defaultValue={user.phoneNumber}
                  placeholder="01xxxxxxxxx"
                  required
                  disabled={isPending}
                />
                <FieldDescription>
                  Your phone number (required for account)
                </FieldDescription>
              </Field>

              <div className="bg-muted/30 rounded-lg border p-4">
                <p className="mb-3 text-sm font-medium">Privacy</p>
                <p className="text-muted-foreground mb-4 text-xs">
                  Choose what appears on your public profile
                </p>
                <div className="space-y-3">
                  <label className="bg-background hover:bg-muted/50 flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors">
                    <span className="flex items-center gap-2 text-sm">
                      <Eye className="text-muted-foreground h-4 w-4" />
                      Show email on profile
                    </span>
                    <input
                      type="checkbox"
                      name="showEmail"
                      defaultChecked={user.showEmail}
                      disabled={isPending}
                      className="border-input h-4 w-4 rounded accent-indigo-600"
                    />
                  </label>
                  <label className="bg-background hover:bg-muted/50 flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors">
                    <span className="flex items-center gap-2 text-sm">
                      <Phone className="text-muted-foreground h-4 w-4 shrink-0" />
                      Show phone on profile
                    </span>
                    <input
                      type="checkbox"
                      name="showPhone"
                      defaultChecked={user.showPhone}
                      disabled={isPending}
                      className="border-input h-4 w-4 rounded accent-indigo-600"
                    />
                  </label>
                </div>
              </div>
            </FieldGroup>
          </FieldSet>

          {state.error && (
            <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
              {state.error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
