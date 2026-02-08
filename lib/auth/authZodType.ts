import z from 'zod'

import { DEPARTMENTS } from '@/app/constants'

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
    studentId: z
      .string()
      .trim()
      .regex(/^B\d{9}$/, {
        message:
          "Student ID must start with 'B' followed by 9 digits (e.g., B220104032)",
      }),

    phoneNumber: z
      .string()
      .trim()
      .min(11, 'Phone number must be at least 11 digits.'),
    department: z
      .string()
      .refine(
        (val) => DEPARTMENTS.includes(val as (typeof DEPARTMENTS)[number]),
        {
          message: 'Please select a department.',
        }
      ),
    email: z.string().trim().email('Invalid email address.'),
    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),

    gender: z
      .enum(['Male', 'Female', 'Other'])
      .refine((val) => val.length > 0, {
        message: 'Please select a gender',
      }),

    batch: z
      .string()
      .min(1, 'Batch is required')
      .regex(/^\d+(th)$/, {
        message: "Format must be like '18th' (only numbers followed by (th) )",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type RegisterValues = z.infer<typeof registerSchema>
