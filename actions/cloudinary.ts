'use server'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function deleteImageAction(ImageUrl: string) {
  const parts = ImageUrl.split('/')
  const uploadIndex = parts.indexOf('upload')

  const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/')
  const publicId = publicIdWithExtension.split('.')[0]

  if (!publicId) {
    return { success: false, error: 'Public ID is required' }
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === 'ok') {
      return { success: true }
    } else {
      return { success: false, error: 'Image not found or already deleted' }
    }
  } catch (error) {
    console.error('Cloudinary Delete Error:', error)
    return { success: false, error: error || 'Failed to delete image' }
  }
}
