import { redirect } from 'next/navigation'

import { FileText, PenSquare } from 'lucide-react'

import PostCard from '@/app/(main)/profile/_components/post-card'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getCachedSession } from '@/lib/auth/getSession'

import { getCachedPosts } from './get-posts'
import PostEditorDialog from './post-editor-dialog'

export default async function ProfilePostsSection() {
  const session = await getCachedSession()
  if (!session?.user) redirect('/login')

  let posts: Awaited<ReturnType<typeof getCachedPosts>> = []
  try {
    posts = await getCachedPosts(session.user.id)
  } catch {
    posts = []
  }

  const hasPosts = Array.isArray(posts) && posts.length > 0

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2 text-lg">
            <PenSquare className="h-5 w-5 text-indigo-500" />
            Blog Posts
          </CardTitle>
          <CardDescription>
            Create and manage your blog posts with rich text formatting.
          </CardDescription>
        </div>
        <PostEditorDialog variant="create" />
      </CardHeader>
      <CardContent>
        {!hasPosts ? (
          <div className="bg-muted/20 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 dark:border-zinc-800">
            <FileText className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-sm font-medium text-zinc-500">No posts yet</p>
            <p className="text-muted-foreground mt-1 mb-4 text-xs">
              Create your first blog post to get started
            </p>
            <PostEditorDialog variant="create" />
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
