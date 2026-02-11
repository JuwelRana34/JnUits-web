'use client'

import * as React from 'react'

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60,
      retry: false,
    },
  },
})

function AuthDataWrapper({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const res = await authClient.getSession()
      return res.data
    },
  })

  const value = React.useMemo(
    () => ({
      user: (data?.user as User) || null,
      session: (data?.session as Session) || null,
      isPending: isLoading,
    }),
    [data, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthDataWrapper>{children}</AuthDataWrapper>
    </QueryClientProvider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
