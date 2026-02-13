'use client'

import { CldImage, CldImageProps } from 'next-cloudinary'

import { User } from 'lucide-react'

import { cn } from '@/lib/utils'

interface CloudImageProps extends Omit<CldImageProps, 'src' | 'alt'> {
  src?: string | null
  alt?: string | null
  fallbackIcon?: React.ReactNode
}

export default function CloudImage({
  src,
  alt,
  className,
  fill = true,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  crop = 'fill',
  gravity = 'auto',
  format = 'auto',
  quality = 'auto',
  fallbackIcon = <User className="h-1/2 w-1/2 text-slate-400" />,
  ...props
}: CloudImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-slate-800',
          className
        )}
      >
        {fallbackIcon}
      </div>
    )
  }

  return (
    <CldImage
      src={src}
      alt={alt ?? 'Image'}
      fill={fill}
      sizes={sizes}
      crop={crop}
      gravity={gravity}
      format={format}
      quality={quality}
      className={cn('object-cover', className)}
      {...props}
    />
  )
}
