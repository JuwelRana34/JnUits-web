import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export function getPublicIdFromUrl(url: string) {
  try {
    const parts = url.split('/')
    const uploadIndex = parts.findIndex((part) => part === 'upload')
    if (uploadIndex === -1) return null
    return parts
      .slice(uploadIndex + 2)
      .join('/')
      .split('.')[0]
  } catch {
    return null
  }
}
