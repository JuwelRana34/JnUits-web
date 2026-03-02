'use client'

import { useEffect, useState, useTransition } from 'react'

import {
  Infinity,
  BadgePercent,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Crown,
  Globe,
  Hash,
  Loader2,
  Plus,
  Target,
  Ticket,
  Trash2,
  Users,
  X,
  XCircle,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'

import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  toggleCouponStatus,
} from '@/actions/EventsActions/couponAction'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ─── Types ────────────────────────────────────────────────────────────────────
type Coupon = {
  id: string
  code: string
  couponType: 'GLOBAL' | 'EVENT_SPECIFIC'
  discountType: 'FIXED' | 'PERCENT' | 'FREE'
  discount: number
  memberOnly: boolean
  maxUses: number
  usedCount: number
  isActive: boolean
  expiresAt: string | null
  event?: { id: string; title: string } | null
}

type FormState = {
  code: string
  couponType: 'GLOBAL' | 'EVENT_SPECIFIC'
  discountType: 'FIXED' | 'PERCENT' | 'FREE'
  discount: string
  memberOnly: boolean
  maxUses: string
  expiresAt: string
  eventId: string
}

const INITIAL_FORM: FormState = {
  code: '',
  couponType: 'GLOBAL',
  discountType: 'FIXED',
  discount: '',
  memberOnly: false,
  maxUses: '1',
  expiresAt: '',
  eventId: '',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const discountLabel = (c: Coupon) => {
  if (c.discountType === 'FREE') return '100% FREE'
  if (c.discountType === 'PERCENT') return `${c.discount}% OFF`
  return `${c.discount} BDT OFF`
}

const isExpired = (expiresAt: string | null) =>
  expiresAt ? new Date(expiresAt) < new Date() : false

// ─── Component ────────────────────────────────────────────────────────────────
export default function CouponManagePage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM)
  const [isPending, startTransition] = useTransition()

  const loadCoupons = async () => {
    setIsLoading(true)
    const res = await getCoupons()
    if (res.success) setCoupons(res.coupons as Coupon[])
    setIsLoading(false)
  }

  useEffect(() => {
    const CuponLoader = () => {
      loadCoupons()
    }
    CuponLoader()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code.trim()) {
      toast.error('Coupon code is required')
      return
    }
    if (formData.discountType !== 'FREE' && !formData.discount) {
      toast.error('Discount amount is required')
      return
    }
    if (formData.couponType === 'EVENT_SPECIFIC' && !formData.eventId.trim()) {
      toast.error('Event ID is required for event-specific coupons')
      return
    }

    startTransition(async () => {
      const res = await createCoupon({
        code: formData.code.toUpperCase(),
        couponType: formData.couponType,
        discountType: formData.discountType,
        discount: Number(formData.discount) || 0,
        memberOnly: formData.memberOnly,
        maxUses: Number(formData.maxUses) || 1,
        expiresAt: formData.expiresAt || undefined,
        eventId: formData.eventId || undefined,
      })

      if (res.success) {
        toast.success('Coupon created successfully!')
        setFormData(INITIAL_FORM)
        setShowForm(false)
        loadCoupons()
      } else {
        toast.error(res.error || 'Failed to create coupon')
      }
    })
  }

  const handleToggle = async (id: string) => {
    startTransition(async () => {
      const res = await toggleCouponStatus(id)
      if (res.success) {
        loadCoupons()
      } else {
        toast.error('Failed to update coupon status')
      }
    })
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return
    startTransition(async () => {
      const res = await deleteCoupon(id)
      if (res.success) {
        toast.success('Coupon deleted')
        loadCoupons()
      } else {
        toast.error('Failed to delete coupon')
      }
    })
  }

  // ── Stats ──
  const totalCoupons = coupons.length
  const activeCoupons = coupons.filter(
    (c) => c.isActive && !isExpired(c.expiresAt)
  ).length
  const totalUses = coupons.reduce((acc, c) => acc + c.usedCount, 0)

  return (
    <div className="min-h-screen bg-neutral-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
                <Ticket className="h-5 w-5 text-violet-400" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Coupon Management
              </h1>
            </div>
            <p className="mt-1 ml-13 text-sm text-neutral-400">
              Create and manage discount coupons
            </p>
          </div>
          <Button
            onClick={() => setShowForm((v) => !v)}
            className="gap-2 rounded-xl bg-violet-600 font-semibold text-white hover:bg-violet-700"
          >
            {showForm ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {showForm ? 'Cancel' : 'New Coupon'}
          </Button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: 'Total',
              value: totalCoupons,
              icon: Hash,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
            },
            {
              label: 'Active',
              value: activeCoupons,
              icon: CheckCircle2,
              color: 'text-green-400',
              bg: 'bg-green-500/10',
            },
            {
              label: 'Total Uses',
              value: totalUses,
              icon: Zap,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10',
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/5 bg-white/5 p-4"
            >
              <div
                className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}
              >
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-neutral-400">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Create Form ── */}
        {showForm && (
          <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 duration-200">
            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-white">
              <Plus className="h-4 w-4 text-violet-400" />
              Create New Coupon
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Code */}
                <div className="grid gap-1.5">
                  <Label className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                    Coupon Code
                  </Label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        code: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="e.g. DISC20"
                    className="h-11 rounded-xl border-white/10 bg-white/5 font-mono text-white placeholder:text-neutral-600 focus-visible:ring-violet-500"
                  />
                </div>

                {/* Max Uses */}
                <div className="grid gap-1.5">
                  <Label className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                    Max Uses
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.maxUses}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, maxUses: e.target.value }))
                    }
                    className="h-11 rounded-xl border-white/10 bg-white/5 text-white focus-visible:ring-violet-500"
                  />
                </div>

                {/* Coupon Type */}
                <div className="grid gap-1.5">
                  <Label className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                    Coupon Type
                  </Label>
                  <div className="flex gap-2">
                    {(['GLOBAL', 'EVENT_SPECIFIC'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({ ...p, couponType: t }))
                        }
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                          formData.couponType === t
                            ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                            : 'border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10'
                        }`}
                      >
                        {t === 'GLOBAL' ? (
                          <Globe className="h-3.5 w-3.5" />
                        ) : (
                          <Target className="h-3.5 w-3.5" />
                        )}
                        {t === 'GLOBAL' ? 'Global' : 'Event Specific'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount Type */}
                <div className="grid gap-1.5">
                  <Label className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                    Discount Type
                  </Label>
                  <div className="flex gap-2">
                    {(['FIXED', 'PERCENT', 'FREE'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({ ...p, discountType: t }))
                        }
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-medium transition-colors ${
                          formData.discountType === t
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                            : 'border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10'
                        }`}
                      >
                        {t === 'FIXED' && <Hash className="h-3 w-3" />}
                        {t === 'PERCENT' && (
                          <BadgePercent className="h-3 w-3" />
                        )}
                        {t === 'FREE' && <Infinity className="h-3 w-3" />}
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount Amount — FREE হলে লুকাবে */}
                {formData.discountType !== 'FREE' && (
                  <div className="grid gap-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                      {formData.discountType === 'PERCENT'
                        ? 'Discount (%)'
                        : 'Discount (BDT)'}
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={
                        formData.discountType === 'PERCENT' ? 100 : undefined
                      }
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, discount: e.target.value }))
                      }
                      placeholder={
                        formData.discountType === 'PERCENT' ? '20' : '100'
                      }
                      className="h-11 rounded-xl border-white/10 bg-white/5 text-white focus-visible:ring-violet-500"
                    />
                  </div>
                )}

                {/* Expiry Date */}
                <div className="grid gap-1.5">
                  <Label className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                    Expiry Date{' '}
                    <span className="text-neutral-500 normal-case">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, expiresAt: e.target.value }))
                    }
                    className="h-11 rounded-xl border-white/10 bg-white/5 text-white focus-visible:ring-violet-500"
                  />
                </div>

                {/* Event ID — EVENT_SPECIFIC হলে */}
                {formData.couponType === 'EVENT_SPECIFIC' && (
                  <div className="grid gap-1.5 sm:col-span-2">
                    <Label className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                      Event ID
                    </Label>
                    <Input
                      value={formData.eventId}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, eventId: e.target.value }))
                      }
                      placeholder="Paste event ID here"
                      className="h-11 rounded-xl border-white/10 bg-white/5 font-mono text-white focus-visible:ring-violet-500"
                    />
                  </div>
                )}
              </div>

              {/* Member Only Toggle */}
              <div
                onClick={() =>
                  setFormData((p) => ({ ...p, memberOnly: !p.memberOnly }))
                }
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                  formData.memberOnly
                    ? 'border-amber-500/40 bg-amber-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/8'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Crown
                    className={`h-4 w-4 ${formData.memberOnly ? 'text-amber-400' : 'text-neutral-500'}`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${formData.memberOnly ? 'text-amber-300' : 'text-neutral-300'}`}
                    >
                      Member Only
                    </p>
                    <p className="text-xs text-neutral-500">
                      Only logged-in members can use this coupon
                    </p>
                  </div>
                </div>
                <div
                  className={`h-5 w-9 rounded-full transition-colors ${formData.memberOnly ? 'bg-amber-500' : 'bg-neutral-700'}`}
                >
                  <div
                    className={`mt-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${formData.memberOnly ? 'translate-x-4.5' : 'translate-x-0.5'}`}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="h-11 w-full rounded-xl bg-violet-600 font-bold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  'Create Coupon'
                )}
              </Button>
            </form>
          </div>
        )}

        {/* ── Coupon List ── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <Ticket className="mb-3 h-10 w-10 text-neutral-600" />
            <p className="text-sm font-medium text-neutral-400">
              No coupons yet
            </p>
            <p className="text-xs text-neutral-600">
              Create your first coupon above
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {coupons.map((coupon) => {
              const expired = isExpired(coupon.expiresAt)
              const usageRatio = coupon.usedCount / coupon.maxUses
              const exhausted = coupon.usedCount >= coupon.maxUses

              return (
                <div
                  key={coupon.id}
                  className={`group rounded-2xl border p-4 transition-all ${
                    !coupon.isActive || expired || exhausted
                      ? 'border-white/5 bg-white/2 opacity-60'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left — Code + Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-white/10 px-3 py-1 font-mono text-base font-bold tracking-widest text-white">
                        {coupon.code}
                      </span>

                      {/* Discount badge */}
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          coupon.discountType === 'FREE'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : coupon.discountType === 'PERCENT'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {discountLabel(coupon)}
                      </span>

                      {/* Type badge */}
                      <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-neutral-400">
                        {coupon.couponType === 'GLOBAL' ? (
                          <>
                            <Globe className="h-3 w-3" /> Global
                          </>
                        ) : (
                          <>
                            <Target className="h-3 w-3" /> Event
                          </>
                        )}
                      </span>

                      {/* Member only */}
                      {coupon.memberOnly && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                          <Crown className="h-3 w-3" /> Member Only
                        </span>
                      )}

                      {/* Status badges */}
                      {expired && (
                        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-400">
                          Expired
                        </span>
                      )}
                      {exhausted && (
                        <span className="rounded-full bg-neutral-500/20 px-2 py-0.5 text-xs text-neutral-400">
                          Exhausted
                        </span>
                      )}
                      {coupon.event && (
                        <span className="max-w-32 truncate rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400">
                          {coupon.event.title}
                        </span>
                      )}
                    </div>

                    {/* Right — Actions */}
                    <div className="flex items-center gap-2">
                      {/* Usage */}
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <Users className="h-3.5 w-3.5" />
                        <span>
                          {coupon.usedCount}/{coupon.maxUses}
                        </span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full transition-all ${usageRatio >= 1 ? 'bg-red-500' : usageRatio > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{
                              width: `${Math.min(usageRatio * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Expiry */}
                      {coupon.expiresAt && (
                        <div className="hidden items-center gap-1 text-xs text-neutral-500 sm:flex">
                          <Calendar className="h-3 w-3" />
                          {new Date(coupon.expiresAt).toLocaleDateString(
                            'en-GB',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: '2-digit',
                            }
                          )}
                        </div>
                      )}

                      {/* Toggle */}
                      <button
                        onClick={() => handleToggle(coupon.id)}
                        disabled={isPending}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                          coupon.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-neutral-500/20 text-neutral-400 hover:bg-neutral-500/30'
                        }`}
                      >
                        {coupon.isActive ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                        disabled={isPending}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
