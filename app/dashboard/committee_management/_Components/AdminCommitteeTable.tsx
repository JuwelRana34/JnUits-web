'use client'

import { useCallback, useState, useTransition } from 'react'

import { CldImage } from 'next-cloudinary'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  deleteMemberAction,
  editMemberAction,
} from '@/actions/committeeActions/commiteeAction'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface User {
  id: string
  name: string | null
  email: string | null
  image?: string | null
}

interface CommitteeMember {
  id: string
  designation: string
  user: User
}

interface Committee {
  id: string
  session: string
  members: CommitteeMember[]
}

interface Props {
  committee: Committee | null
  committees: { id: string; session: string }[]
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  member,
  open,
  onConfirm,
  onCancel,
  isPending,
}: {
  member: CommitteeMember | null
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <DialogHeader>
          <DialogTitle className="text-center">Remove Member</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to remove{' '}
            <span className="text-foreground font-medium">
              {member?.user.name || 'this member'}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-row gap-3 sm:justify-center">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? 'Removing...' : 'Yes, Remove'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({
  member,
  open,
  onConfirm,
  onCancel,
  isPending,
}: {
  member: CommitteeMember | null
  open: boolean
  onConfirm: (designation: string) => void
  onCancel: () => void
  isPending: boolean
}) {
  const [designation, setDesignation] = useState(member?.designation ?? '')

  // Reset input when a new member is targeted
  if (member && member.designation !== designation && !isPending) {
    setDesignation(member.designation)
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>
            Update the designation for this committee member.
          </DialogDescription>
        </DialogHeader>

        {/* Member Info (read-only) */}
        {member && (
          <div className="bg-muted flex items-center gap-3 rounded-lg p-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border">
              <CldImage
                src={member.user.image || '/default-avatar.png'}
                alt={member.user.name || 'Avatar'}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{member.user.name || 'N/A'}</p>
              <p className="text-muted-foreground text-xs">
                {member.user.email}
              </p>
            </div>
          </div>
        )}

        {/* Designation Field */}
        <div className="space-y-1.5">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            disabled={isPending}
            placeholder="Enter designation"
          />
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(designation)}
            disabled={isPending || !designation.trim()}
            className="flex-1"
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Table Component ─────────────────────────────────────────────────────
export default function AdminCommitteeTable({ committee, committees }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [deleteTarget, setDeleteTarget] = useState<CommitteeMember | null>(null)
  const [editTarget, setEditTarget] = useState<CommitteeMember | null>(null)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleSessionChange = (session: string) => {
    router.push(`${pathname}?${createQueryString('session', session)}`, {
      scroll: false,
    })
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    startTransition(async () => {
      await deleteMemberAction(deleteTarget.id)
      setDeleteTarget(null)
      router.refresh()
    })
  }

  const handleEditConfirm = (designation: string) => {
    if (!editTarget) return
    startTransition(async () => {
      await editMemberAction(editTarget.id, designation)
      setEditTarget(null)
      router.refresh()
    })
  }

  return (
    <>
      <DeleteModal
        member={deleteTarget}
        open={!!deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isPending={isPending}
      />

      <EditModal
        member={editTarget}
        open={!!editTarget}
        onConfirm={handleEditConfirm}
        onCancel={() => setEditTarget(null)}
        isPending={isPending}
      />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Table Header & Filters */}
        <div className="border-b border-gray-200 p-4 sm:px-6 sm:py-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h3 className="text-base leading-6 font-semibold text-gray-900">
              Session: {committee?.session || 'Select a session'}
            </h3>
            <select
              value={committee?.session || ''}
              onChange={(e) => handleSessionChange(e.target.value)}
              disabled={isPending}
              className="w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:w-auto sm:text-sm"
            >
              {committees.map((c) => (
                <option key={c.id} value={c.session}>
                  {c.session}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Member
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Designation
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {committee?.members.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                        <CldImage
                          src={m.user.image || '/default-avatar.png'}
                          alt={m.user.name || 'Avatar'}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {m.user.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {m.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs leading-5 font-semibold text-blue-800">
                      {m.designation}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditTarget(m)}
                      disabled={isPending}
                      className="mr-1 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-900"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(m)}
                      disabled={isPending}
                      className="text-red-600 hover:bg-red-50 hover:text-red-900"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!committee?.members.length && (
            <div className="p-8 text-center text-gray-500">
              No members found in this session.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
