export const uploadImage = async (
  file: File,
  folder: string = 'general',
  maxSize: number
): Promise<string> => {
  if (file.size > maxSize * 1024 * 1024) {
    throw new Error(`File size exceeds ${maxSize}MB limit`)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  )
  formData.append('folder', folder)

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error?.message || 'Cloudinary upload failed')
    }

    const data = await res.json()
    return data.secure_url
  } catch (error) {
    console.error('Upload Logic Error:', error)
    throw error
  }
}
