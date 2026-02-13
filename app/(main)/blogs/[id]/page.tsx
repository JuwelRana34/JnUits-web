import { Suspense } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { format } from 'date-fns'
import { ArrowLeft, CalendarIcon } from 'lucide-react'

import { getPostById } from '@/actions/posts'
import CloudImage from '@/components/shared/CloudImage'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import prisma from '@/lib/prismadb'

import { PostSkeleton } from '../_components/BlogGridSkleton'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { id: true },
    take: 10,
    orderBy: { createdAt: 'desc' },
  })

  return posts.map((post) => ({
    id: post.id,
  }))
}

async function PostContent({ id }: { id: string }) {
  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <>
      <header className="mb-10 flex flex-col items-start space-y-6">
        <Badge variant="secondary" className="font-normal">
          Blog Post
        </Badge>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border ring-1 ring-blue-400">
              <CloudImage
                src={post.author.image}
                alt={post.author?.name ?? 'Author'}
                gravity="face"
                crop="fill"
                sizes="256px"
              />
              <AvatarFallback>
                {post.author?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">
              {post.author?.name || 'Unknown Author'}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <CalendarIcon className="h-4 w-4" />
            <time dateTime={post.createdAt?.toISOString()}>
              {post.createdAt
                ? format(new Date(post.createdAt), 'MMMM d, yyyy')
                : 'N/A'}
            </time>
          </div>
        </div>
      </header>

      {post.image && (
        <div className="bg-muted relative mb-12 aspect-video w-full overflow-hidden rounded-xl border shadow-sm">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-neutral prose-lg dark:prose-invert wrap-break-words max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </>
  )
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params

  return (
    <article className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
      <Link
        href="/blogs"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blogs
      </Link>

      <Suspense fallback={<PostSkeleton />}>
        <PostContent id={id} />
      </Suspense>
    </article>
  )
}
