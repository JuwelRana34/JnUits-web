import * as z from 'zod'

const baseSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(11, 'number must be at least 11 characters'),
  trxId: z.string().optional(),
  provider: z.enum(['bKash', 'Nagad', 'Bank']).optional(),
})

const bccMetaSchema = z.object({
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Select gender' }),
  facebook: z.string().url('Enter a valid Facebook URL').optional(),
  basicSkills: z.string().min(3, 'Mention at least one skill'),
  coupon: z.string().optional(),
})

export const getRegistrationSchema = (options: {
  isGuest: boolean
  isPaid: boolean
  isBCC: boolean
  isFree: boolean
}) => {
  const phoneSchema = options.isGuest
    ? z.object({
        phone: z
          .string()
          .min(11)
          .regex(/^01[3-9]\d{8}$/, 'Enter a valid BD phone number'),
      })
    : z.object({ phone: z.string().optional() })

  const paymentSchema =
    options.isPaid && !options.isFree
      ? z.object({
          trxId: z
            .string()
            .min(5, 'Transaction ID must be at least 8 characters'),
          provider: z.enum(['bKash', 'Nagad', 'Bank'], {
            message: 'Please select a payment method',
          }),
        })
      : z.object({
          trxId: z.string().optional(),
          provider: z.enum(['bKash', 'Nagad', 'Bank']).optional(),
        })

  const bccSchema = options.isBCC
    ? bccMetaSchema
    : z.object({
        gender: z.string().optional(),
        facebook: z.string().optional(),
        basicSkills: z.string().optional(),
        coupon: z.string().optional(),
      })

  return baseSchema.merge(phoneSchema).merge(paymentSchema).merge(bccSchema)
}

export type BCCMetadata = z.infer<typeof bccMetaSchema>
