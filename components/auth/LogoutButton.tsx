'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import { authClient } from '@/lib/auth/auth-client'

import { Button } from '../ui/button'

export default function LogoutButton() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          setIsLoggingOut(true)
        },
        onSuccess: () => {
          queryClient.setQueryData(['auth-session'], null)
          setIsLoggingOut(false)
          router.push('/login')
          router.refresh()
        },
        onError: (ctx) => {
          setIsLoggingOut(false)
          alert(ctx.error.message)
        },
      },
    })
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 active:scale-95 disabled:opacity-50 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
    >
      {isLoggingOut ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></span>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      )}
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </Button>
  )
}
