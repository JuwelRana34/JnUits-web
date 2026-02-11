'use client'

import * as React from 'react'

import { authClient } from '@/lib/auth/auth-client'

export interface Session {
  id: string
  userId: string
  expiresAt: Date
  ipAddress?: string | null
  userAgent?: string | null
}

export interface User {
  id: string
  email: string
  emailVerified: boolean
  name: string
  image?: string | null
  role?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthContextType {
  user: User | null
  session: Session | null
  isPending: boolean
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  session: null,
  isPending: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession()
  return (
    <AuthContext.Provider
      value={{
        user: (data?.user as User) || null,
        session: data?.session || null,
        isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
