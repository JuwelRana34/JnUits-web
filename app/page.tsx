'use client'
import Skeleton from '@/components/shared/Skeleton'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
        Welcome to Next.js! statter template💥💬
      </h1>
      <br />
      <div>
        <Skeleton className="m-4 h-30 w-48 rounded-md" />
      </div>
    </div>
  )
}
