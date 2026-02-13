'use client'

import { useRef, useState } from 'react'

import { CldImage } from 'next-cloudinary'
import Image from 'next/image'

import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { processAvatarUpload } from '@/actions/profile'
import { useAuth } from '@/components/features/AuthProvider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface AvatarUploaderProps {
  initialImage: string | null
  name: string | null
}

export default function AvatarUploader({
  initialImage,
  name,
}: AvatarUploaderProps) {
  const initials = name?.slice(0, 2).toUpperCase() ?? '?'
  const { user } = useAuth()
  const userId = user?.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(initialImage)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // File Size Validation: Max 1MB
    if (file.size > 1.5 * 1024 * 1024) {
      toast.warning(' please upload File size max 1 MB or bellow! ')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Optimistic Preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewImage(objectUrl)
    setIsUploading(true)

    try {
      // FormData baniye Server Action a pathano
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)

      // Directly Server Action call kora hocche
      const result = await processAvatarUpload(formData)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success('Profile photo upload successfully! ')
      setPreviewImage(result.newImageUrl!)
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Photo upload kote somossa hoyeche!')
      setPreviewImage(initialImage)
    } finally {
      setIsUploading(false)
      URL.revokeObjectURL(objectUrl)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div
      className="group relative shrink-0 cursor-pointer rounded-full"
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <Avatar className="relative h-24 w-24 overflow-hidden border-4 border-white/20 shadow-lg ring-2 ring-white/10 transition-all duration-300 group-hover:border-white/40 sm:h-28 sm:w-28">
        {previewImage ? (
          previewImage.includes('cloudinary') ? (
            <CldImage
              src={previewImage}
              alt={name ?? 'Profile'}
              fill
              sizes="(max-width: 768px) 96px, 112px"
              crop="fill"
              gravity="face"
              format="auto"
              quality="auto"
              className="object-cover"
              priority
            />
          ) : (
            <Image
              src={previewImage}
              alt="Preview"
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <AvatarFallback className="bg-indigo-500/80 text-2xl font-bold text-white">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>

      <div
        className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/40 transition-opacity duration-300 ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        ) : (
          <Camera className="h-8 w-8 text-white" />
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
    </div>
  )
}
