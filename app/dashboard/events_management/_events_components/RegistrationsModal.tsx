'use client'

import { useCallback, useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Filter, Loader2, Ticket, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  archiveEvent,
  getEventRegistrations,
  updateRegistrationStatus,
} from '@/actions/EventsActions/EventsManagementAction'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type RegistrationMetadata = {
  coupon?: string
  couponCode?: string
  [key: string]: unknown
}

type PaymentInfo = {
  amount: string
  transactionId: string
  provider: string | null
  status: string
  createdAt: Date
}
type MemberReg = {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  user: {
    name: string | null
    email: string | null
    phoneNumber: string
  } | null
  payments: PaymentInfo[]
  metadata?: RegistrationMetadata | null
}
type GuestReg = {
  id: string
  name: string
  email: string
  phone: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  payments: PaymentInfo[]
  metadata?: RegistrationMetadata | null
}

interface RegistrationsModalProps {
  eventId: string
  baseFee: number
  isOpen: boolean
  onClose: () => void
}

export function RegistrationsModal({
  eventId,
  baseFee,
  isOpen,
  onClose,
}: RegistrationsModalProps) {
  const [members, setMembers] = useState<MemberReg[]>([])
  const [guests, setGuests] = useState<GuestReg[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  >('ALL')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()
  const fetchRegistrations = useCallback(async () => {
    if (!eventId) return

    setIsLoading(true)
    const res = await getEventRegistrations(eventId)

    if (res.success) {
      setMembers(res.members as unknown as MemberReg[])
      setGuests(res.guests as unknown as GuestReg[])
    }

    setIsLoading(false)
  }, [eventId])

  useEffect(() => {
    const fetchReg = () => {
      if (isOpen && eventId) {
        fetchRegistrations()
        setStatusFilter('ALL')
      }
    }
    fetchReg()
  }, [eventId, fetchRegistrations, isOpen])

  // ─── HANDLERS ───────────────────────────────────────────────────────────
  const handleStatusChange = async (
    regId: string,
    newStatus: 'PENDING' | 'APPROVED' | 'REJECTED',
    isGuest: boolean
  ) => {
    if (isGuest) {
      setGuests((prev) =>
        prev.map((g) => (g.id === regId ? { ...g, status: newStatus } : g))
      )
    } else {
      setMembers((prev) =>
        prev.map((m) => (m.id === regId ? { ...m, status: newStatus } : m))
      )
    }

    const res = await updateRegistrationStatus(regId, newStatus, isGuest)
    if (res.success) {
      toast.success(`Status updated to ${newStatus}`)
    } else {
      toast.error(res.error || 'Failed to update status')
      fetchRegistrations()
    }
  }

  const handleDeleteAll = async () => {
    setIsDeletingAll(true)
    const res = await archiveEvent(eventId)
    if (res.success) {
      toast.success('All registrations deleted successfully.')
      setMembers([])
      setGuests([])
      setIsDeleteDialogOpen(false)
      router.refresh()
      onClose()
    } else {
      toast.error(res.error || 'Failed to delete registrations.')
    }
    setIsDeletingAll(false)
  }

  const filteredMembers = members.filter(
    (m) => statusFilter === 'ALL' || m.status === statusFilter
  )
  const filteredGuests = guests.filter(
    (g) => statusFilter === 'ALL' || g.status === statusFilter
  )
  // ─── UI RENDERERS ───────────────────────────────────────────────────────
  const renderPaymentDetails = (
    payments: PaymentInfo[],
    metadata?: RegistrationMetadata | null
  ) => {
    if (!payments || payments.length === 0) {
      return (
        <div className="flex flex-col text-sm">
          <span className="text-muted-foreground font-medium">
            Main Amount: ৳{baseFee}
          </span>
          <Badge variant="destructive" className="mt-1 w-fit">
            No Payment Found
          </Badge>
        </div>
      )
    }

    const payment = payments[0]
    const paidAmount = parseInt(payment.amount) || 0
    const discountApplied =
      baseFee > 0 && paidAmount < baseFee ? baseFee - paidAmount : 0

    // Assuming you store the used coupon code in metadata like: { coupon: "WINTER50" }
    const usedCoupon = metadata?.coupon || metadata?.couponCode

    return (
      <div className="bg-muted/30 flex flex-col rounded-md border p-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Main Fee:</span>
          <span className="text-muted-foreground line-through">৳{baseFee}</span>
        </div>

        {discountApplied > 0 && (
          <div className="flex justify-between gap-4 text-emerald-600 dark:text-emerald-400">
            <span>Discount:</span>
            <span>-৳{discountApplied}</span>
          </div>
        )}

        <div className="mt-1 flex justify-between gap-4 border-t pt-1 font-semibold">
          <span>Paid:</span>
          <span>৳{paidAmount}</span>
        </div>

        {usedCoupon && (
          <div className="mt-2 flex w-fit items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Ticket className="h-3 w-3" />
            <span>{usedCoupon}</span>
          </div>
        )}

        <span className="text-muted-foreground mt-1 font-mono text-[10px] break-all">
          TrxID: {payment.transactionId}
        </span>
        {metadata &&
          typeof metadata === 'object' &&
          'screenshotUrl' in metadata && (
            <Link
              href={metadata.screenshotUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-xs text-blue-600 hover:underline"
            >
              View Screenshot
            </Link>
          )}
      </div>
    )
  }

  const renderStatusSelect = (
    regId: string,
    currentStatus: string,
    isGuest: boolean
  ) => (
    <Select
      value={currentStatus}
      onValueChange={(val: 'PENDING' | 'APPROVED' | 'REJECTED') =>
        handleStatusChange(regId, val, isGuest)
      }
    >
      <SelectTrigger className="h-8 w-30 text-xs">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">Pending</SelectItem>
        <SelectItem value="APPROVED">Approved</SelectItem>
        <SelectItem value="REJECTED">Rejected</SelectItem>
      </SelectContent>
    </Select>
  )

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="flex max-h-[85vh] max-w-5xl flex-col overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Registrations</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex flex-1 justify-center py-10">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Tabs defaultValue="members" className="mt-4 w-full flex-1">
              <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <TabsList className="grid w-full grid-cols-2 sm:w-100">
                  <TabsTrigger value="members">
                    Members ({filteredMembers.length})
                  </TabsTrigger>
                  <TabsTrigger value="guests">
                    Guests ({filteredGuests.length})
                  </TabsTrigger>
                </TabsList>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <Filter className="text-muted-foreground h-4 w-4" />
                  <Select
                    value={statusFilter}
                    onValueChange={(
                      val: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
                    ) => setStatusFilter(val)}
                  >
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending Only</SelectItem>
                      <SelectItem value="APPROVED">Approved Only</SelectItem>
                      <SelectItem value="REJECTED">Rejected Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Members Tab */}
              <TabsContent value="members" className="mt-4 space-y-4">
                {filteredMembers.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    No member registrations yet.
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {filteredMembers.map((reg) => (
                      <div
                        key={reg.id}
                        className="bg-card hover:bg-muted/10 grid grid-cols-1 items-center gap-4 rounded-lg border p-4 transition-colors md:grid-cols-3"
                      >
                        <div className="min-w-0 pr-4">
                          <p className="text-base font-semibold wrap-break-word">
                            {reg.user?.name || 'Unknown'}
                          </p>
                          {/* break-all ব্যবহার করা হয়েছে যাতে ইমেইল কন্টেইনারের বাইরে না যায় */}
                          <p className="text-muted-foreground text-sm break-all">
                            {reg.user?.email}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {reg.user?.phoneNumber}
                          </p>
                        </div>

                        <div className="md:justify-self-center">
                          {renderPaymentDetails(reg.payments, reg.metadata)}
                        </div>

                        <div className="flex flex-col items-start gap-2 md:items-end md:justify-self-end">
                          <Badge
                            variant={
                              reg.status === 'APPROVED'
                                ? 'default'
                                : reg.status === 'REJECTED'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            Current: {reg.status}
                          </Badge>
                          {renderStatusSelect(reg.id, reg.status, false)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Guests Tab */}
              <TabsContent value="guests" className="mt-4 space-y-4">
                {filteredGuests.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    No guest registrations yet.
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {filteredGuests.map((reg) => (
                      <div
                        key={reg.id}
                        className="bg-card hover:bg-muted/10 grid grid-cols-1 items-center gap-4 rounded-lg border p-4 transition-colors md:grid-cols-3"
                      >
                        <div className="min-w-0 pr-4">
                          <p className="text-base font-semibold wrap-break-word">
                            {reg.name}
                          </p>
                          {/* break-all ব্যবহার করা হয়েছে যাতে ইমেইল কন্টেইনারের বাইরে না যায় */}
                          <p className="text-muted-foreground text-sm break-all">
                            {reg.email}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {reg.phone}
                          </p>
                        </div>

                        <div className="md:justify-self-center">
                          {renderPaymentDetails(reg.payments, reg.metadata)}
                        </div>

                        <div className="flex flex-col items-start gap-2 md:items-end md:justify-self-end">
                          <Badge
                            variant={
                              reg.status === 'APPROVED'
                                ? 'default'
                                : reg.status === 'REJECTED'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            Current: {reg.status}
                          </Badge>
                          {renderStatusSelect(reg.id, reg.status, true)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Delete All Action */}
          {!isLoading && (members.length > 0 || guests.length > 0) && (
            <DialogFooter className="mt-6 items-center border-t pt-4 sm:justify-between">
              <p className="text-muted-foreground mb-4 text-xs sm:mb-0">
                Total Revenue available in admin dashboard.
              </p>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeletingAll}
                className="w-full sm:w-auto"
              >
                {/* {isDeletingAll ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete All Registrations */}
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Registrations
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* /* ─── NEW PROFESSIONAL ALERT DIALOG──────────────────── */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete ALL
              registrations and associated payments for this event from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAll}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault()
                handleDeleteAll()
              }}
              disabled={isDeletingAll}
            >
              {isDeletingAll ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {isDeletingAll ? 'Deleting...' : 'Delete Everything'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
