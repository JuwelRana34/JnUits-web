'use client'

import { useState } from 'react'

import { Event } from '@prisma/client'
import { Loader2 } from 'lucide-react'
// Adjust path if needed
import { toast } from 'sonner'

import { updateEvent } from '@/actions/EventsActions/EventsManagementAction'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface EditEventModalProps {
  event: Event
  isOpen: boolean
  onClose: () => void
}

// Helper to format Date for datetime-local input
const formatForInput = (date: Date | string) => {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export function EditEventModal({
  event,
  isOpen,
  onClose,
}: EditEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Local state for the form fields
  const [formData, setFormData] = useState({
    title: event.title,
    fee: event.fee,
    deadline: formatForInput(event.deadline),
    isActive: event.isActive,
    isPaid: event.isPaid,
    isFeatured: event.isFeatured,
    isPublic: event.isPublic,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'fee' ? Number(value) : value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Ensure the date is formatted correctly for the backend
    const submissionData = {
      ...formData,
      deadline: new Date(formData.deadline).toISOString(),
    }

    const res = await updateEvent(event.id, submissionData)

    if (res.success) {
      toast.success('Event updated successfully')
      onClose()
    } else {
      toast.error(res.error || 'Failed to update event')
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Fee */}
            <div className="space-y-2">
              <Label htmlFor="fee">Fee (৳)</Label>
              <Input
                id="fee"
                name="fee"
                type="number"
                min="0"
                value={formData.fee}
                onChange={handleChange}
                required
              />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Registration Deadline</Label>
              <Input
                id="deadline"
                name="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Toggles section */}
          <div className="bg-card/50 grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="isActive" className="flex-1 cursor-pointer">
                Active Event
              </Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(c) => handleSwitchChange('isActive', c)}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="isPaid" className="flex-1 cursor-pointer">
                Paid Event
              </Label>
              <Switch
                id="isPaid"
                checked={formData.isPaid}
                onCheckedChange={(c) => handleSwitchChange('isPaid', c)}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="isPublic" className="flex-1 cursor-pointer">
                Public Registration
              </Label>
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(c) => handleSwitchChange('isPublic', c)}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="isFeatured" className="flex-1 cursor-pointer">
                Featured Event
              </Label>
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(c) => handleSwitchChange('isFeatured', c)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
