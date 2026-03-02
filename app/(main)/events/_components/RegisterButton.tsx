'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  Banknote,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Facebook,
  ImageUp,
  Link,
  Loader2,
  Mail,
  Phone,
  Receipt,
  Sparkles,
  Tag,
  User,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import type { ZodIssue } from 'zod'

import { validateCoupon } from '@/actions/EventsActions/couponAction'
import { deleteImageAction } from '@/actions/cloudinary'
import { registerForEvent } from '@/actions/registrationAction/registrationAction'
import { PaymentNumber } from '@/app/constants'
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
import { uploadImage } from '@/lib/cloudinary/PhotoUpload'
import { getRegistrationSchema } from '@/lib/validationSchema/RegistrationSchema'

import { IEvent } from './EventCard'

// ─── Types ────────────────────────────────────────────────────────────────────
type FormData = {
  name: string
  email: string
  phone: string
  trxId: string
  provider: 'bKash' | 'Nagad' | 'Bank' | ''
  // BCC only
  gender: 'Male' | 'Female' | 'Other' | ''
  facebook: string
  basicSkills: string
  coupon: string
}

type CouponResult = {
  discount: number
  discountType: 'FIXED' | 'PERCENT' | 'FREE'
  finalFee: number
}

type FormErrors = Partial<
  Record<keyof FormData | 'screenshot' | 'coupon', string>
>

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  trxId: '',
  provider: '',
  gender: '',
  facebook: '',
  basicSkills: '',
  coupon: '',
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RegisterButton({ event }: { event: IEvent }) {
  const { user } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isCouponPending, startCouponTransition] = useTransition()

  const isDeadlinePassed = new Date(event.deadline) < new Date()
  const isBCC = event.type === 'BCC_COURSE'

  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<'details' | 'form' | 'success'>('details')
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  )
  const [isUploading, setIsUploading] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const finalFee = appliedCoupon
    ? appliedCoupon.finalFee
    : Number(event.fee) || 0

  const isFreeAfterCoupon = event.isPaid && finalFee === 0
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
    setScreenshot(null)
    setScreenshotPreview(null)
    setAppliedCoupon(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (!user) {
      setFormData(INITIAL_FORM)
    } else {
      setFormData((prev) => ({
        ...prev,
        phone: '',
        trxId: '',
        provider: '',
        gender: '',
        facebook: '',
        basicSkills: '',
        coupon: '',
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
        field === 'trxId' || field === 'coupon'
          ? e.target.value.toUpperCase()
          : e.target.value
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
      // Coupon field change হলে applied coupon reset
      if (field === 'coupon') setAppliedCoupon(null)
    }

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'File size must be under 5MB',
      }))
      return
    }
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'Only image files are allowed',
      }))
      return
    }
    setScreenshot(file)
    setScreenshotPreview(URL.createObjectURL(file))
    setErrors((prev) => ({ ...prev, screenshot: undefined }))
  }

  // ── Apply Coupon ──────────────────────────────────────────────────────────
  const handleApplyCoupon = () => {
    if (!formData.coupon.trim()) {
      setErrors((prev) => ({ ...prev, coupon: 'Enter a coupon code first' }))
      return
    }

    startCouponTransition(async () => {
      const res = await validateCoupon({
        code: formData.coupon,
        eventId: event.id,
        isGuest: !user,
        fee: Number(event.fee) || 0,
      })

      if (res.success && res.data) {
        setAppliedCoupon(res.data)
        setErrors((prev) => ({ ...prev, coupon: undefined }))
        toast.success(
          `Coupon applied! You save ${
            res.data.discountType === 'FREE'
              ? '100%'
              : res.data.discountType === 'PERCENT'
                ? `${res.data.discount}%`
                : `${res.data.discount} BDT`
          }`
        )
      } else {
        setAppliedCoupon(null)
        setErrors((prev) => ({
          ...prev,
          coupon: res.error || 'Invalid coupon',
        }))
      }
    })
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setFormData((prev) => ({ ...prev, coupon: '' }))
    setErrors((prev) => ({ ...prev, coupon: undefined }))
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const isGuest = !user

    if (isGuest && event.isPaid && !isBCC) {
      toast.error('You must be logged in to register for a paid event.')
      return
    }

    if (isBCC && event.isPaid && !isFreeAfterCoupon && !screenshot) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'Payment screenshot is required',
      }))
      return
    }

    const result = getRegistrationSchema({
      isGuest,
      isPaid: event.isPaid && !isFreeAfterCoupon,
      isBCC,
      isFree: isFreeAfterCoupon,
    }).safeParse({
      ...formData,
      provider: event.isPaid ? formData.provider : undefined,
      gender: isBCC ? formData.gender : undefined,
      facebook:
        isBCC && formData.facebook.trim() ? formData.facebook : undefined,
      basicSkills: isBCC ? formData.basicSkills : undefined,
    })

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.issues.forEach((issue: ZodIssue) => {
        fieldErrors[issue.path[0] as keyof FormErrors] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    startTransition(async () => {
      try {
        let screenshotUrl: string | undefined = undefined
        if (isBCC && screenshot) {
          setIsUploading(true)
          try {
            screenshotUrl = await uploadImage(screenshot, 'Payments', 5)
          } catch {
            toast.error('Failed to upload screenshot. Please try again.')
            setIsUploading(false)
            return
          }
          setIsUploading(false)
        }

        const bccFields = isBCC
          ? {
              gender: formData.gender || undefined,
              facebook: formData.facebook || undefined,
              basicSkills: formData.basicSkills || undefined,
              screenshotUrl,
            }
          : {}

        const response = await registerForEvent({
          isGuest,
          eventId: event.id,
          userId: user?.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          trxId: formData.trxId || undefined,
          provider: formData.provider || undefined,
          isPaid: Boolean(event.isPaid),
          fee: Number(event.fee) || 0,
          isBCC,
          coupon: appliedCoupon ? formData.coupon : undefined, // ✅ applied হলেই পাঠাবে
          ...bccFields,
        })

        if (response.success) {
          setView('success')
          if (!isGuest) setTimeout(() => router.push('/profile'), 3000)
        } else {
          if (screenshotUrl) {
            await deleteImageAction(screenshotUrl)
          }

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

  const isSubmitDisabled = isPending || isUploading

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
          {/* ── Details View ── */}
          {view === 'details' && (
            <div className="animate-in fade-in zoom-in-95 space-y-6 duration-300">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          {/* ── Form View ── */}
          {view === 'form' &&
            (!user && event.isPaid && !isBCC ? (
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
                      disabled={!!user}
                      className={`h-12 rounded-xl border-neutral-200 bg-neutral-50 pl-11 dark:border-neutral-800 dark:bg-neutral-900 ${errors.name ? 'border-red-500' : ''} ${user ? 'cursor-not-allowed opacity-70' : ''}`}
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
                      disabled={!!user}
                      className={`h-12 rounded-xl border-neutral-200 bg-neutral-50 pl-11 dark:border-neutral-800 dark:bg-neutral-900 ${errors.email ? 'border-red-500' : ''} ${user ? 'cursor-not-allowed opacity-70' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="ml-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone — Guest only */}
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
                        className={`h-12 rounded-xl border-neutral-200 bg-neutral-50 pl-11 dark:border-neutral-800 dark:bg-neutral-900 ${errors.phone ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="ml-1 text-xs text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                )}

                {/* ── BCC Course Extra Fields ── */}
                {isBCC && (
                  <div className="space-y-4 rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/50 dark:bg-purple-950/20">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                        BCC Course Additional Info
                      </p>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <Label className="ml-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Gender
                      </Label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(val) => {
                          setFormData((p) => ({
                            ...p,
                            gender: val as FormData['gender'],
                          }))
                          if (errors.gender)
                            setErrors((p) => ({ ...p, gender: undefined }))
                        }}
                        className="flex gap-3"
                      >
                        {(['Male', 'Female', 'Other'] as const).map((g) => (
                          <div
                            key={g}
                            className={`flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-2 dark:bg-neutral-900 ${formData.gender === g ? 'border-purple-500' : 'border-neutral-200 dark:border-neutral-800'}`}
                          >
                            <RadioGroupItem value={g} id={`gender-${g}`} />
                            <Label
                              htmlFor={`gender-${g}`}
                              className="cursor-pointer text-sm font-medium"
                            >
                              {g}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.gender && (
                        <p className="ml-1 text-xs text-red-500">
                          {errors.gender}
                        </p>
                      )}
                    </div>

                    {/* Facebook */}
                    <div className="grid gap-2">
                      <Label
                        htmlFor="facebook"
                        className="ml-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                      >
                        Facebook Profile URL
                      </Label>
                      <div className="relative">
                        <Facebook className="absolute top-3 left-3.5 h-5 w-5 text-neutral-400" />
                        <Input
                          id="facebook"
                          value={formData.facebook}
                          onChange={updateField('facebook')}
                          placeholder="https://facebook.com/yourprofile"
                          className={`h-12 rounded-xl border-neutral-200 bg-white pl-11 dark:border-neutral-800 dark:bg-neutral-900 ${errors.facebook ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.facebook && (
                        <p className="ml-1 text-xs text-red-500">
                          {errors.facebook}
                        </p>
                      )}
                    </div>

                    {/* Basic Skills */}
                    <div className="grid gap-2">
                      <Label
                        htmlFor="basicSkills"
                        className="ml-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                      >
                        Basic Skills
                      </Label>
                      <div className="relative">
                        <Link className="absolute top-3 left-3.5 h-5 w-5 text-neutral-400" />
                        <Input
                          id="basicSkills"
                          value={formData.basicSkills}
                          onChange={updateField('basicSkills')}
                          placeholder="e.g. HTML, CSS, Basic Computer"
                          className={`h-12 rounded-xl border-neutral-200 bg-white pl-11 dark:border-neutral-800 dark:bg-neutral-900 ${errors.basicSkills ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.basicSkills && (
                        <p className="ml-1 text-xs text-red-500">
                          {errors.basicSkills}
                        </p>
                      )}
                    </div>

                    {/* Screenshot — Paid BCC only */}
                    {event.isPaid && !isFreeAfterCoupon && (
                      <div className="grid gap-2">
                        <Label className="ml-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Payment Screenshot
                        </Label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleScreenshotChange}
                        />
                        {screenshotPreview ? (
                          <div className="relative overflow-hidden rounded-xl border border-purple-200 dark:border-purple-900/50">
                            <Image
                              width={500}
                              height={500}
                              src={screenshotPreview}
                              alt="Payment screenshot preview"
                              className="max-h-40 w-full bg-neutral-50 object-contain dark:bg-neutral-900"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setScreenshot(null)
                                setScreenshotPreview(null)
                                if (fileInputRef.current)
                                  fileInputRef.current.value = ''
                              }}
                              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex h-24 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-white transition-colors hover:bg-purple-50 dark:bg-neutral-900 dark:hover:bg-purple-950/20 ${errors.screenshot ? 'border-red-400' : 'border-purple-200 dark:border-purple-900/50'}`}
                          >
                            <ImageUp className="h-6 w-6 text-purple-400" />
                            <span className="text-xs font-medium text-neutral-500">
                              Click to upload screenshot
                            </span>
                            <span className="text-xs text-neutral-400">
                              PNG, JPG up to 5MB
                            </span>
                          </button>
                        )}
                        {errors.screenshot && (
                          <p className="ml-1 text-xs text-red-500">
                            {errors.screenshot}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Payment — Paid Event only ── */}
                {event.isPaid && !isFreeAfterCoupon && (
                  <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                    {/* ── Payment Instructions ── */}
                    <div className="space-y-3">
                      {/* Mobile Wallet */}
                      <div className="rounded-xl border border-amber-300 bg-white p-3.5 dark:border-amber-800 dark:bg-neutral-900">
                        <div className="mb-2 flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                            Mobile Wallet (bKash / Nagad)
                          </p>
                        </div>
                        <div className="mb-2.5 flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950/40">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            Send Money (Personal)
                          </span>
                          <span className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                            {PaymentNumber}
                          </span>
                        </div>
                        <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                          Treasurer JnUITS
                        </p>
                        <ul className="space-y-1">
                          {[
                            'Select the Send Money option.',
                            `Amount: ${event.fee} BDT`,
                            'Reference: Type your Student ID.',
                            'Take a Screenshot of the confirmation.',
                          ].map((step, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400"
                            >
                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-amber-200 dark:bg-amber-900/50" />
                        <span className="text-xs font-semibold text-amber-500">
                          OR
                        </span>
                        <div className="h-px flex-1 bg-amber-200 dark:bg-amber-900/50" />
                      </div>

                      {/* Bank Deposit */}
                      <div className="rounded-xl border border-amber-300 bg-white p-3.5 dark:border-amber-800 dark:bg-neutral-900">
                        <div className="mb-2 flex items-center gap-2">
                          <Receipt className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                            Bank Deposit (Agrani Bank)
                          </p>
                        </div>
                        <div className="mb-2.5 space-y-1.5">
                          {[
                            {
                              label: 'Branch',
                              value: 'Jagannath University Branch',
                            },
                            {
                              label: 'Acc Name',
                              value: 'Jagannath University IT Society',
                            },
                            { label: 'Acc Number', value: '0200013199689' },
                          ].map(({ label, value }) => (
                            <div
                              key={label}
                              className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-1.5 dark:bg-amber-950/40"
                            >
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                {label}
                              </span>
                              <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                        <ul className="space-y-1">
                          {[
                            'Fill up a deposit form.',
                            `Deposit ${event.fee} BDT.`,
                            'Collect the slip after deposit.',
                            'Take a clear Photo of the payment slip.',
                          ].map((step, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400"
                            >
                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Note */}
                      <p className="text-center text-xs text-amber-700 dark:text-amber-400">
                        😊 Please ensure all details are correct before making
                        the payment.
                      </p>
                    </div>

                    {/* ── Coupon Section ── */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Coupon Code{' '}
                        <span className="font-normal text-neutral-400">
                          (Optional)
                        </span>
                      </Label>

                      {appliedCoupon ? (
                        <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
                              {formData.coupon}
                            </span>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400">
                              applied
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Sparkles className="absolute top-3 left-3.5 h-5 w-5 text-neutral-400" />
                            <Input
                              value={formData.coupon}
                              onChange={updateField('coupon')}
                              placeholder="e.g. DISC20"
                              className={`h-12 rounded-xl border-amber-200 bg-white pl-11 font-mono dark:border-amber-900/50 dark:bg-neutral-900 ${errors.coupon ? 'border-red-500' : ''}`}
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={isCouponPending || !formData.coupon}
                            className="h-12 rounded-xl bg-amber-500 px-5 font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
                          >
                            {isCouponPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Apply'
                            )}
                          </Button>
                        </div>
                      )}
                      {errors.coupon && (
                        <p className="ml-1 text-xs text-red-500">
                          {errors.coupon}
                        </p>
                      )}
                    </div>

                    {/* ── Price Summary ── */}
                    {appliedCoupon && (
                      <div className="space-y-1.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                        <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
                          <span>Original Fee</span>
                          <span className="line-through">{event.fee} BDT</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400">
                          <div className="flex items-center gap-1">
                            <Tag className="h-3.5 w-3.5" />
                            <span>Discount</span>
                          </div>
                          <span>
                            -
                            {appliedCoupon.discountType === 'FREE'
                              ? `${event.fee} BDT (FREE)`
                              : appliedCoupon.discountType === 'PERCENT'
                                ? `${appliedCoupon.discount}%`
                                : `${appliedCoupon.discount} BDT`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-emerald-200 pt-1.5 text-base font-bold text-neutral-900 dark:border-emerald-800 dark:text-white">
                          <span>You Pay</span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {finalFee === 0 ? 'FREE 🎉' : `${finalFee} BDT`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Payment Method + TrxId — free হলে লুকাবে */}
                    {!isFreeAfterCoupon && (
                      <>
                        {/* Payment Method */}
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Payment Method
                          </Label>
                          <RadioGroup
                            value={formData.provider}
                            onValueChange={(value) => {
                              setFormData((prev) => ({
                                ...prev,
                                provider: value as FormData['provider'],
                              }))
                              if (errors.provider)
                                setErrors((prev) => ({
                                  ...prev,
                                  provider: undefined,
                                }))
                            }}
                            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                          >
                            {(['bKash', 'Nagad', 'Bank'] as const).map((p) => (
                              <div
                                key={p}
                                className={`flex items-center gap-2 rounded-lg border bg-white p-2.5 dark:bg-neutral-900 ${formData.provider === p ? 'border-blue-500' : 'border-neutral-200 dark:border-neutral-800'}`}
                              >
                                <RadioGroupItem value={p} id={p} />
                                <Label
                                  htmlFor={p}
                                  className="cursor-pointer text-sm font-medium"
                                >
                                  {p}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
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
                              className={`h-12 rounded-xl border-amber-200 bg-white pl-11 font-mono dark:border-amber-900/50 dark:bg-neutral-900 ${errors.trxId ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {errors.trxId && (
                            <p className="ml-1 text-xs text-red-500">
                              {errors.trxId}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </form>
            ))}

          {/* ── Success View ── */}
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
            (!user && event.isPaid && !isBCC ? null : (
              <div className="w-full space-y-3">
                {/* Fee summary in footer */}
                {event.isPaid && (
                  <div className="flex items-center justify-between rounded-xl bg-neutral-100 px-4 py-2.5 dark:bg-neutral-800">
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Amount to pay
                    </span>
                    <span className="text-base font-bold text-neutral-900 dark:text-white">
                      {finalFee === 0 ? (
                        <span className="text-emerald-500">FREE 🎉</span>
                      ) : (
                        <span>
                          {appliedCoupon && (
                            <span className="mr-2 text-sm font-normal text-neutral-400 line-through">
                              {event.fee} BDT
                            </span>
                          )}
                          {finalFee} BDT
                        </span>
                      )}
                    </span>
                  </div>
                )}
                <Button
                  type="submit"
                  form="registration-form"
                  disabled={isSubmitDisabled}
                  className="h-12 w-full rounded-xl bg-linear-to-r from-green-600 to-emerald-600 text-base font-bold text-white hover:from-green-700 hover:to-emerald-700 disabled:opacity-60"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Uploading screenshot...
                    </div>
                  ) : isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Processing...
                    </div>
                  ) : (
                    `Confirm & ${event.isPaid ? 'Submit Payment' : 'Register'}`
                  )}
                </Button>
              </div>
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
