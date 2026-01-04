import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800',
        className
      )}
    >
      <div className="animate-shimmer pointer-events-none absolute inset-0 -translate-x-full">
        <div className="mx-auto h-full w-32 -skew-x-45 bg-linear-to-r from-transparent via-white/40 to-transparent blur-[10px] dark:via-white/5" />
      </div>
    </div>
  )
}
