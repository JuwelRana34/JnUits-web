// app/actions/userActions.ts (ba apnar server actions file)
'use server'

import { v2 as cloudinary } from 'cloudinary'

// Cloudinary configuration (sudhu server environment e run hobe)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// URL theke public_id ber korar helper function
function getPublicIdFromUrl(url: string) {
  try {
    // Cloudinary URL format sadharonoto emon hoy:
    // https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/folder_name/image_name.jpg
    const parts = url.split('/')
    const uploadIndex = parts.findIndex((part) => part === 'upload')

    if (uploadIndex === -1) return null

    // 'upload' er porer version (v1234..) bad diye baki part tuku nite hobe
    const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/')

    // extension (.jpg, .png) bad dite hobe
    const publicId = publicIdWithExtension.split('.')[0]

    return publicId
  } catch (error) {
    console.error('Public ID extract korte prblm:', error)
    return null
  }
}

export async function deleteUser(userId: string, imageUrl: string | null) {
  try {
    // 1. Jodi user-er kono Cloudinary image thake, age seta delete korbo
    if (imageUrl) {
      const publicId = getPublicIdFromUrl(imageUrl)

      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId)
        if (result.result !== 'ok' && result.result !== 'not found') {
          console.error('Cloudinary deletion failed:', result)
        } else {
          console.log(`Successfully deleted image with ID: ${publicId}`)
        }
      }
    }

    // 2. Ebar apnar Database theke User delete korben
    // Example (Prisma): await prisma.user.delete({ where: { id: userId } })
    // Example (Mongoose): await User.findByIdAndDelete(userId)

    return {
      success: true,
      message: 'User ebong tar photo successfully delete hoyeche!',
    }
  } catch (error) {
    console.error('User deletion error:', error)
    return {
      success: false,
      message: 'Kono ekta somossa hoyeche, abar try korun.',
    }
  }
}
