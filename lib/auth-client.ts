// React/Next.js-এর জন্য recommended
// অথবা "better-auth/client" যদি vanilla চাও

import { adminClient, twoFactorClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',

  plugins: [adminClient(), twoFactorClient()],
})
