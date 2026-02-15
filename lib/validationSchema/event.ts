import * as z from 'zod'

export const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  fee: z.preprocess(
    (val) => (typeof val === 'string' ? Number(val) || 0 : val),
    z.number().min(0)
  ),
  isPaid: z.boolean().default(false),
  isActive: z.boolean().default(true),
  deadline: z.string().min(1, 'Deadline is required'),
  isPublic: z.boolean().default(false),
  image: z.string().url('Please enter a valid image URL'),
  description: z.string().min(20, 'Description is too short'),
})
