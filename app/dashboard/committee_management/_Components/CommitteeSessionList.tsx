'use client'

import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { deleteCommitteeSession } from '@/actions/committeeActions/commiteeAction'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Committee {
  id: string
  session: string
}

interface Props {
  committees: Committee[]
}

function DeleteCommitteeModal({
  committee,
  open,
  onConfirm,
  onCancel,
  isPending,
}: {
  committee: Committee | null
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
          <DialogTitle className="text-center">Delete Committee</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete the{' '}
            <span className="text-foreground font-medium">
              {committee?.session}
            </span>{' '}
            committee? All members in this session will also be removed.
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
            {isPending ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function CommitteeList({ committees }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<Committee | null>(null)

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    startTransition(async () => {
      await deleteCommitteeSession(deleteTarget.id)
      setDeleteTarget(null)
      router.refresh()
    })
  }

  if (committees.length === 0) return null

  return (
    <>
      <DeleteCommitteeModal
        committee={deleteTarget}
        open={!!deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isPending={isPending}
      />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                All Sessions
              </h2>
              <p className="text-sm text-gray-500">
                {committees.length} committee session
                {committees.length !== 1 ? 's' : ''} total
              </p>
            </div>
            {/* Badge */}
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
              {committees.length} Sessions
            </span>
          </div>
        </div>

        {/* List */}
        <ul className="divide-y divide-gray-100">
          {committees.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                {/* Index Badge */}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                  {index + 1}
                </span>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.session}
                  </p>
                  <p className="text-xs text-gray-400">
                    ID: {item.id.slice(0, 8)}...
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Calendar Icon */}
                <div className="flex items-center gap-1.5 rounded-md bg-gray-50 px-2.5 py-1.5">
                  <svg
                    className="h-3.5 w-3.5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5"
                    />
                  </svg>
                  <span className="text-xs font-medium text-gray-500">
                    {item.session}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(item)}
                  disabled={isPending}
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
