import { Suspense } from 'react'

import BlogContent from './_components/BlogContent'
import { BlogGridSkeleton } from './_components/BlogGridSkleton'

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 space-y-2 text-center md:text-left">
        <h1 className="text-2xl font-medium tracking-tighter sm:text-3xl md:text-4xl">
          Latest Insights
        </h1>
        <p className="text-muted-foreground md:text-lg">
          Explore our latest thoughts, tutorials, and updates.
        </p>
      </div>

      <Suspense fallback={<BlogGridSkeleton />}>
        <BlogContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
