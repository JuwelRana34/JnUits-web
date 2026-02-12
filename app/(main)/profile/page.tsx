import { Suspense } from 'react'

import { CalendarCheck, Megaphone } from 'lucide-react'

import Skeleton from '@/components/shared/Skeleton'

import ProfileContent from './_components/profile-content'
import ProfilePostsSection from './_components/profile-posts-section'
import RegistrationList from './_components/registration-list'

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-10 px-4 py-8 sm:py-10">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>

      <Suspense fallback={<PostsSkeleton />}>
        <ProfilePostsSection />
      </Suspense>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-semibold tracking-tight">
              Applied Events
            </h2>
          </div>

          <Suspense fallback={<ListSkeleton />}>
            <RegistrationList />
          </Suspense>
        </section>

        <aside className="space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-semibold tracking-tight">Notice</h3>
          </div>
          <div className="bg-muted/50 rounded-xl border p-5 dark:bg-zinc-900/50">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
              IT Society
            </h4>
            <p className="text-muted-foreground mt-2 text-sm">
              Keep your profile updated to earn more points and unlock member
              benefits.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid gap-6 sm:grid-cols-2">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-20 w-full rounded-xl" />
    </div>
  )
}

function PostsSkeleton() {
  return <Skeleton className="h-64 w-full rounded-xl" />
}
