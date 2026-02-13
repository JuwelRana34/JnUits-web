import { getPosts } from '@/actions/posts'

import { PaginationControls } from './pagination-controls'
import { PostCard } from './post-card'

type Props = {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogContent({ searchParams }: Props) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1

  const { posts, metadata } = await getPosts(currentPage)

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold">No posts found</h2>
        <p className="text-muted-foreground">Check back later for updates.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <PaginationControls metadata={metadata} />
    </>
  )
}
