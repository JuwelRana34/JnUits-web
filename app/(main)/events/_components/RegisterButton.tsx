'use client'

import { useEffect, useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Mail,
  Phone,
  Receipt,
  User,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { registerForEvent } from '@/actions/registrationAction/registrationAction'
import { useAuth } from '@/components/features/AuthProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { IEvent } from './EventCard'

// ─── Client-side Validation Schema ───────────────────────────────────────────
const getSchema = (isGuest: boolean, isPaid: boolean) =>
  z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: isGuest
      ? z
          .string()
          .min(11, 'Valid phone number is required')
          .regex(/^01[3-9]\d{8}$/, 'Enter a valid BD phone number')
      : z.string().optional(),
    trxId: isPaid
      ? z.string().min(8, 'Transaction ID must be at least 8 characters')
      : z.string().optional(),
    provider: isPaid
      ? z.enum(['bKash', 'Rocket', 'Nagad', 'Bank'], {
          message: 'Please select a payment method',
        })
      : z.string().optional(),
  })

type FormErrors = Partial<
  Record<'name' | 'email' | 'phone' | 'trxId' | 'provider', string>
>

type FormData = {
  name: string
  email: string
  phone: string
  trxId: string
  provider: 'bKash' | 'Rocket' | 'Nagad' | 'Bank'
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RegisterButton({ event }: { event: IEvent }) {
  const { user } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isDeadlinePassed = new Date(event.deadline) < new Date()

  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<'details' | 'form' | 'success'>('details')
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    trxId: '',
    provider: '' as FormData['provider'],
  })

  // Auto-fill logged-in user data
  useEffect(() => {
    const autoFillData = () => {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
        }))
      }
    }
    autoFillData()
  }, [user])

  const resetDialog = () => {
    setView('details')
    setErrors({})
    // Guest হলে form reset করো, Member হলে auto-fill রেখে দাও
    if (!user) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        trxId: '',
        provider: 'bKash',
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        phone: '',
        trxId: '',
        provider: 'bKash',
      }))
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) setTimeout(resetDialog, 300)
  }

  const updateField =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === 'trxId' ? e.target.value.toUpperCase() : e.target.value
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const isGuest = !user

    if (isGuest && event.isPaid) {
      toast.error('You must be logged in to register for a paid event.')
      return
    }

    // Client-side validation
    const result = getSchema(isGuest, event.isPaid).safeParse({
      ...formData,
      // ✅ Free event হলে provider validation skip
      provider: event.isPaid ? formData.provider : undefined,
    })
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof FormErrors] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    startTransition(async () => {
      try {
        const response = await registerForEvent(
          isGuest
            ? {
                isGuest: true,
                eventId: event.id,
                userId: undefined,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                trxId: formData.trxId,
                provider: formData.provider,
                isPaid: Boolean(event.isPaid),
                fee: Number(event.fee) || 0,
              }
            : {
                isGuest: false,
                eventId: event.id,
                userId: user!.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                trxId: formData.trxId,
                provider: formData.provider,
                isPaid: Boolean(event.isPaid),
                fee: Number(event.fee) || 0,
              }
        )

        if (response.success) {
          setView('success')
          // Member হলে ৩ সেকেন্ড পর profile-এ redirect
          if (!isGuest) {
            setTimeout(() => {
              router.push('/profile')
            }, 3000)
          }
        } else {
          toast.error(
            response.error || 'Something went wrong. Please try again.'
          )
        }
      } catch {
        toast.error(
          'Network error. Please check your connection and try again.'
        )
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          disabled={isDeadlinePassed}
          className="w-full border-0 bg-linear-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-sm transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeadlinePassed ? 'Registration Closed' : 'Details & Register'}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-background flex h-[90vh] w-[95vw] flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl sm:max-w-150 sm:border-solid md:h-fit md:max-h-[90vh]">
        {/* ── Header ── */}
        <DialogHeader className="bg-background/80 relative z-20 flex shrink-0 flex-row items-center justify-between space-y-0 border-b p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {view === 'form' && (
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2 h-8 w-8 shrink-0 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => {
                  setView('details')
                  setErrors({})
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="m-0 line-clamp-2 text-xl font-bold tracking-tight capitalize">
              {view === 'details'
                ? event.title
                : view === 'form'
                  ? 'Registration Details'
                  : 'Registration Complete'}
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => handleOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* ── Body ── */}
        <div className="overflow-y-auto p-4 pb-8 sm:p-6">
          {/* Details View */}
          {view === 'details' && (
            <div className="animate-in fade-in zoom-in-95 space-y-6 duration-300">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Fee Card */}
                <div className="group relative flex flex-col gap-1 overflow-hidden rounded-2xl border border-green-100 bg-linear-to-br from-green-50 to-emerald-50 p-4 dark:border-green-900/30 dark:from-green-950/20 dark:to-emerald-950/20">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                    <Banknote className="h-4 w-4" /> Registration Fee
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {event.fee > 0 ? `${event.fee} BDT` : 'Free Entry'}
                  </div>
                  {event.isPaid && (
                    <Badge
                      variant="secondary"
                      className="mt-1 w-fit bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                    >
                      Paid Event
                    </Badge>
                  )}
                </div>

                {/* Deadline Card */}
                <div className="group relative flex flex-col gap-1 overflow-hidden rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-indigo-50 p-4 dark:border-blue-900/30 dark:from-blue-950/20 dark:to-indigo-950/20">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                    <CalendarDays className="h-4 w-4" /> Registration Deadline
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {new Date(event.deadline).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <p
                    className={`text-sm font-medium ${isDeadlinePassed ? 'text-red-500' : 'text-blue-600/80 dark:text-blue-400/80'}`}
                  >
                    {isDeadlinePassed
                      ? 'Deadline has passed'
                      : "Don't miss out!"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 shadow-sm sm:p-5 dark:border-neutral-800/50 dark:bg-neutral-900/30">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-neutral-900 uppercase dark:text-neutral-100">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  About the Event
                </h3>
                <div
                  className="prose prose-neutral prose-lg dark:prose-invert wrap-break-words max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            </div>
          )}

          {/* Form View */}
          {view === 'form' &&
            (!user && event.isPaid ? (
              // ✅ Guest + Paid — Login prompt
              <div className="animate-in fade-in zoom-in-95 flex flex-col items-center justify-center space-y-4 py-10 text-center duration-300">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Banknote className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Login Required
                </h3>
                <p className="max-w-70 leading-relaxed text-neutral-500">
                  You must be logged in to register for a paid event.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  className="mt-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 font-bold text-white hover:from-blue-700 hover:to-indigo-700"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <form
                id="registration-form"
                onSubmit={handleSubmit}
                className="animate-in fade-in slide-in-from-right-4 space-y-5 duration-300"
                noValidate
              >
                {/* Name */}
                <div className="grid gap-2">
                  <Label
                    htmlFor="name"
                    className="ml-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute top-3 left-3.5 h-5 w-5 text-neutral-400" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={updateField('name')}
                      placeholder="John Doe"
                      disabled={!!user} // Member হলে name edit করা যাবে না
                      className={`h-12 rounded-xl border-neutral-200 bg-neutral-50 pl-11 dark:border-neutral-800 dark:bg-neutral-900 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''} ${user ? 'cursor-not-allowed opacity-70' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="ml-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="ml-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute top-3 left-3.5 h-5 w-5 text-neutral-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={updateField('email')}
                      placeholder="you@example.com"
                      disabled={!!user} // Member হলে email edit করা যাবে না
                      className={`h-12 rounded-xl border-neutral-200 bg-neutral-50 pl-11 dark:border-neutral-800 dark:bg-neutral-900 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''} ${user ? 'cursor-not-allowed opacity-70' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="ml-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone — শুধু Guest এর জন্য */}
                {!user && (
                  <div className="grid gap-2">
                    <Label
                      htmlFor="phone"
                      className="ml-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute top-3 left-3.5 h-5 w-5 text-neutral-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={updateField('phone')}
                        placeholder="01XXXXXXXXX"
                        maxLength={11}
                        className={`h-12 rounded-xl border-neutral-200 bg-neutral-50 pl-11 dark:border-neutral-800 dark:bg-neutral-900 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="ml-1 text-xs text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                )}

                {/* Payment — শুধু Paid Event এর জন্য */}
                {event.isPaid && (
                  <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                    <div className="flex items-start gap-3">
                      <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                        Please send{' '}
                        <span className="font-bold">{event.fee} BDT</span> to:{' '}
                        <span className="rounded bg-amber-200 px-1 font-mono font-bold dark:bg-amber-800">
                          01XXXXXXXXX
                        </span>
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Payment Method
                      </Label>
                      <RadioGroup
                        value={formData.provider}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            provider: value as FormData['provider'],
                          }))
                        }
                        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                      >
                        {(['bKash', 'Rocket', 'Nagad', 'Bank'] as const).map(
                          (p) => (
                            <div
                              key={p}
                              className={`flex items-center gap-2 rounded-lg border bg-white p-2.5 dark:bg-neutral-900 ${
                                formData.provider === p
                                  ? 'border-blue-500 dark:border-blue-400' // ✅ selected state
                                  : 'border-neutral-200 dark:border-neutral-800'
                              }`}
                            >
                              <RadioGroupItem value={p} id={p} />
                              <Label
                                htmlFor={p}
                                className="cursor-pointer text-sm font-medium"
                              >
                                {p}
                              </Label>
                            </div>
                          )
                        )}
                      </RadioGroup>
                      {/* ✅ Error message */}
                      {errors.provider && (
                        <p className="ml-1 text-xs text-red-500">
                          {errors.provider}
                        </p>
                      )}
                    </div>

                    {/* Transaction ID */}
                    <div className="grid gap-2">
                      <Label
                        htmlFor="trxId"
                        className="ml-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                      >
                        Transaction ID
                      </Label>
                      <div className="relative">
                        <Receipt className="absolute top-3 left-3.5 h-5 w-5 text-neutral-400" />
                        <Input
                          id="trxId"
                          value={formData.trxId}
                          onChange={updateField('trxId')}
                          placeholder="e.g. 9J5B7X2Q"
                          className={`h-12 rounded-xl border-amber-200 bg-white pl-11 font-mono dark:border-amber-900/50 dark:bg-neutral-900 ${errors.trxId ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                      </div>
                      {errors.trxId && (
                        <p className="ml-1 text-xs text-red-500">
                          {errors.trxId}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </form>
            ))}

          {/* Success View */}
          {view === 'success' && (
            <div className="animate-in zoom-in flex flex-col items-center justify-center space-y-4 py-10 text-center duration-300">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Registration Successful!
              </h3>
              <p className="max-w-70 leading-relaxed text-neutral-500">
                {event.isPaid
                  ? 'Your payment is being verified.'
                  : "You're all set!"}
                {user
                  ? ' Redirecting to your profile...'
                  : ' Thank you for registering!'}
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="bg-background/80 z-20 shrink-0 border-t p-5 backdrop-blur-xl">
          {view === 'details' && (
            <Button
              type="button"
              onClick={() => setView('form')}
              disabled={isPending || isDeadlinePassed}
              className="h-12 w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-base text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
            >
              Proceed to Register
            </Button>
          )}

          {view === 'form' &&
            (!user && event.isPaid ? null : (
              <Button
                type="submit"
                form="registration-form"
                disabled={isPending}
                className="h-12 w-full rounded-xl bg-linear-to-r from-green-600 to-emerald-600 text-base font-bold text-white hover:from-green-700 hover:to-emerald-700 disabled:opacity-60"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing...
                  </div>
                ) : (
                  `Confirm & ${event.isPaid ? 'Submit Payment' : 'Register'}`
                )}
              </Button>
            ))}

          {view === 'success' &&
            (user ? (
              <Button
                variant="outline"
                onClick={() => router.push('/profile')}
                className="h-12 w-full rounded-xl text-base font-bold"
              >
                Go to Profile
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="h-12 w-full rounded-xl text-base font-bold"
              >
                Close
              </Button>
            ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
