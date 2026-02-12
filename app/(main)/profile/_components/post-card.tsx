'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Trash2 } from 'lucide-react'

import { deletePost } from '@/actions/posts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import PostEditorDialog from './post-editor-dialog'

interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    createdAt?: Date | null
  }
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    setDeleting(true)
    const result = await deletePost(post.id)
    setDeleting(false)
    if (result?.success) router.refresh()
    else if (result?.error) alert(result.error)
  }

  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null

  return (
    <Card
      className={cn(
        'overflow-hidden transition-shadow hover:shadow-md',
        deleting && 'opacity-60'
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {post.title}
          </h3>
          {dateStr && (
            <p className="text-muted-foreground mt-0.5 text-xs">{dateStr}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <PostEditorDialog post={post} variant="edit" />
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-8 w-8"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          className="prose prose-sm dark:prose-invert text-muted-foreground line-clamp-3 max-w-none [&_blockquote]:border-l-indigo-500 [&_blockquote]:pl-4 [&_ol]:pl-5 [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: post.content || '<p></p>' }}
        />
      </CardContent>
    </Card>
  )
}
