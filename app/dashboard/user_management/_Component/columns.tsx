'use client'

import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { ColumnDef } from '@tanstack/react-table'
import {
  Ban,
  Coins,
  Copy,
  MoreHorizontal,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

import {
  UserData,
  UserRole,
  banUser,
  deleteUser,
  updatePoints,
  updateUserRole,
} from '@/actions/dashboardActions/UsersManagement'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const DataTableRowActions = ({ user }: { user: UserData }) => {
  const [actionType, setActionType] = useState<
    'role' | 'points' | 'ban' | 'delete' | null
  >(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, startTransition] = useTransition()
  const router = useRouter()
  const [newRole, setNewRole] = useState<UserRole>(user.role)
  const [pointsInput, setPointsInput] = useState<number>(user.points)
  const [banReason, setBanReason] = useState('')

  const handleOpen = (type: typeof actionType) => {
    setActionType(type)
    setNewRole(user.role)
    setPointsInput(0)
    setBanReason('')
    setIsOpen(true)
  }

  const onSubmit = () => {
    startTransition(async () => {
      try {
        if (actionType === 'role') {
          await updateUserRole(user.id, newRole)
          router.refresh()
          toast.success('User role updated successfully!')
        } else if (actionType === 'points') {
          const result = await updatePoints(user.id, pointsInput)
          router.refresh()
          toast.success(`Points updated! New total: ${result.newTotal}`)
        } else if (actionType === 'ban') {
          const result = await banUser(user.id, banReason)
          router.refresh()
          toast.success(
            result.banned
              ? 'User banned successfully!'
              : 'User unbanned successfully!'
          )
        } else if (actionType === 'delete') {
          await deleteUser(user.id)
          router.refresh()
          toast.success(`User deleted successfully! ${user.name}`)
        }

        setIsOpen(false)
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Something went wrong! Please try again.')
        }
      }
    })
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
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(user.id)}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy User ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => handleOpen('role')}>
            <ShieldCheck className="mr-2 h-4 w-4" /> Manage Role
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpen('points')}>
            <Coins className="mr-2 h-4 w-4" /> Add/Deduct Points
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleOpen('ban')}
            className="text-amber-600 focus:bg-amber-50 focus:text-amber-600"
          >
            <Ban className="mr-2 h-4 w-4" /> Ban / Unban User
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleOpen('delete')}
            className="text-red-600 focus:bg-red-50 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'role' && 'Manage User Role'}
              {actionType === 'points' && 'Manage Points'}
              {actionType === 'ban' && 'Ban/Unban User'}
              {actionType === 'delete' && 'Delete User'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'delete'
                ? 'Are you sure you want to permanently delete this user? This action cannot be undone.'
                : `Updating data for ${user.name || 'this user'}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Manage Role Form */}
            {actionType === 'role' && (
              <div className="grid gap-2">
                <Label htmlFor="role">Select New Role</Label>
                {/* ✅ Fixed: Added onValueChange to track selected role */}
                <Select
                  value={newRole}
                  onValueChange={(val) => setNewRole(val as UserRole)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="SUB_EXECUTIVE">Sub Executive</SelectItem>
                    <SelectItem value="EXECUTIVE">Executive</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Manage Points Form */}
            {actionType === 'points' && (
              <div className="grid gap-2">
                <Label htmlFor="points">Points to Add or Deduct</Label>
                <p className="text-muted-foreground text-sm">
                  Current points:{' '}
                  <span className="font-semibold text-amber-600">
                    {user.points}
                  </span>
                </p>
                <Input
                  id="points"
                  type="number"
                  placeholder="e.g. 50 to add, -30 to deduct"
                  value={pointsInput}
                  onChange={(e) => setPointsInput(Number(e.target.value))}
                />
              </div>
            )}

            {/* Ban/Unban Form */}
            {actionType === 'ban' && (
              <div className="grid gap-2">
                {/* ✅ Show current ban status so user knows what action will happen */}
                <div
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    user.banned
                      ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
                      : 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                  }`}
                >
                  <Ban className="h-4 w-4" />
                  {user.banned
                    ? 'This user is currently BANNED'
                    : 'This user is currently ACTIVE'}
                </div>

                {!user.banned && (
                  <>
                    <Label htmlFor="reason">Ban Reason (Optional)</Label>
                    <Input
                      id="reason"
                      placeholder="e.g. Violation of rules"
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                    />
                  </>
                )}

                <p className="text-muted-foreground text-sm">
                  {user.banned
                    ? 'Clicking confirm will UNBAN this user and restore their access.'
                    : 'Clicking confirm will BAN this user and revoke their access.'}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            {/* ✅ Bonus: Disabled button while loading to prevent double submit */}
            <Button
              variant={actionType === 'delete' ? 'destructive' : 'default'}
              onClick={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Confirm Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: 'name',
    header: 'Name & Info',
    cell: ({ row }) => {
      const name = (row.getValue('name') as string) || 'Unknown'
      const email = row.original.email || 'No email'

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {name}
          </span>
          <span className="text-xs text-gray-500">{email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'studentId',
    header: 'Student ID',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('studentId')}</div>
    ),
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as UserRole

      let badgeColor =
        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      if (role === 'SUPER_ADMIN' || role === 'ADMIN')
        badgeColor = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      else if (role === 'EXECUTIVE' || role === 'SUB_EXECUTIVE')
        badgeColor =
          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      else if (role === 'MEMBER')
        badgeColor =
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'

      return (
        <Badge variant="outline" className={`font-semibold ${badgeColor}`}>
          {role.replace('_', ' ')}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'points',
    header: () => <div className="text-right">Points</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium text-amber-600">
          {row.getValue('points')}
        </div>
      )
    },
  },
  {
    accessorKey: 'banned',
    header: 'Status',
    cell: ({ row }) => {
      const banned = row.getValue('banned') as boolean
      return banned ? (
        <Badge
          variant="outline"
          className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
        >
          Banned
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
        >
          Active
        </Badge>
      )
    },
  },

  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => <DataTableRowActions user={row.original} />,
  },
]
