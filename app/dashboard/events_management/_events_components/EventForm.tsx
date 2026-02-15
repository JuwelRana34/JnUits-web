'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import Image from 'next/image'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import * as z from 'zod'

import { deleteImageAction } from '@/actions/cloudinary'
import { createEvent } from '@/actions/event'
import TiptapEditor from '@/components/editor/tiptap-editor'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { uploadImage } from '@/lib/cloudinary/PhotoUpload'
import getErrorMessage from '@/lib/errorTypeCheck'
import { eventSchema } from '@/lib/validationSchema/event'

type EventInput = z.input<typeof eventSchema>
type EventOutput = z.output<typeof eventSchema>
export default function EventCreationForm() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<EventInput, unknown, EventOutput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      fee: 0,
      isPaid: false,
      isActive: true,
      isPublic: false,
      image: '',
      description: '',
      deadline: '',
    },
  })

  // const editor = useEditor({
  //   extensions: [StarterKit],
  //   content: '',
  //   immediatelyRender: false,
  //   onUpdate: ({ editor }) => {
  //     form.setValue('description', editor.getHTML())
  //   },
  // })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))

    form.setValue('image', 'https://temp-url.com', { shouldValidate: true })
  }

  const onSubmit = async (values: EventOutput) => {
    if (!imageFile) return toast.warning('Please select an image')

    setIsUploading(true)

    let uploadedUrl = ''

    try {
      uploadedUrl = await uploadImage(imageFile, 'jnuIts_events', 8)

      const result = await createEvent({
        ...values,
        image: uploadedUrl,
      })

      if (!result.success) {
        throw new Error(result.message || 'Event creation failed')
      }

      toast.success('Event created successfully!')
      form.reset()
      setImageFile(null)
      setImagePreview('')
    } catch (err) {
      console.error(err)

      if (uploadedUrl) {
        try {
          await deleteImageAction(uploadedUrl)
          console.log('Orphaned image deleted')
        } catch (deleteErr) {
          console.error('Failed to delete orphaned image:', deleteErr)
        }
      }

      toast.error(getErrorMessage(err) || 'Failed to create event')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Create New Event</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Workshop on cv writing..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Fee</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value as number | '' | undefined}
                      onChange={(e) => {
                        const val = e.target.value.trim()
                        field.onChange(val === '' ? '' : Number(val))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-6">
            <FormField
              control={form.control}
              name="isPaid"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Is Paid Event?</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Public Event (Guest allowed)?</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-y-0 space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer font-medium text-indigo-600">
                    Active Status
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormLabel>Event Image</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </FormControl>
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 rounded object-cover"
                  width={500}
                  height={500}
                />
              </div>
            )}
          </div>
          {/* Tiptap Description Editor */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Provide a detailed description of the event..."
                      minHeight="min-h-[250px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
              </span>
            ) : (
              'Publish Event'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
