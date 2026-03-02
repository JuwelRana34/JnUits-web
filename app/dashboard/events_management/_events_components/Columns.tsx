'use client'

import { useState } from 'react'

import { Event } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { Copy, Edit, MoreHorizontal, Trash, Users } from 'lucide-react'
import { toast } from 'sonner'

import { archiveEvent } from '@/actions/EventsActions/EventsManagementAction'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { EditEventModal } from './EditEventModal'
import { RegistrationsModal } from './RegistrationsModal'

// Extended type based on your prisma include
export type EventWithCounts = Event & {
  _count: {
    registrations: number
    guestRegistrations: number
  }
}

// Separate component for the actions to handle modal states locally per row
const ActionCell = ({ event }: { event: EventWithCounts }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRegModalOpen, setIsRegModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(event.id)
    toast.success('Event ID copied to clipboard')
  }

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure? This deletes ALL registrations and payments linked to this event.'
      )
    )
      return

    setIsDeleting(true)
    const res = await archiveEvent(event.id)
    if (res.success) {
      toast.success('Event deleted successfully')
    } else {
      toast.error(res.error || 'Failed to delete')
    }
    setIsDeleting(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-50">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" /> Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setIsRegModalOpen(true)}>
            <Users className="mr-2 h-4 w-4" /> View Registrations
          </DropdownMenuItem>

          {/* Note: Replace this with your actual Edit Modal Trigger */}
          <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Event
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete Event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RegistrationsModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        eventId={event.id}
        baseFee={event.fee}
      />

      <EditEventModal
        event={event}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  )
}

export const columns: ColumnDef<EventWithCounts>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('title')}</div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <Badge variant="outline">{row.getValue('type')}</Badge>,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive')
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'fee',
    header: () => <div className="text-right">Fee</div>,
    cell: ({ row }) => {
      const fee = row.getValue('fee') as number
      return (
        <div className="text-right font-medium">
          {fee === 0 ? 'Free' : `৳${fee}`}
        </div>
      )
    },
  },
  {
    id: 'applicants',
    header: 'Applicants',
    cell: ({ row }) => {
      const counts = row.original._count
      const total = counts.registrations + counts.guestRegistrations
      return (
        <div className="flex items-center gap-2">
          <Users className="text-muted-foreground h-4 w-4" />
          <span>{total}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell event={row.original} />,
  },
]
