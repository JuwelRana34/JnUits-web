import Skeleton from '@/components/shared/Skeleton'

export function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function PostSkeleton() {
  return (
    <div className="space-y-8 pt-2">
      <Skeleton className="h-6 w-24" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-full max-w-2xl" />
        <Skeleton className="h-12 w-3/4" />
      </div>
      <div className="flex items-center gap-4 pt-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}
