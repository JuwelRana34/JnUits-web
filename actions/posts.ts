'use server'

import { cacheTag, revalidateTag } from 'next/cache'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { headers } from 'next/headers'

import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prismadb'

export type PostActionState = { success?: boolean; error?: string }

export async function createPost(
  _prev: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) return { error: 'You must be signed in.' }

  const title = formData.get('title')?.toString()?.trim()
  const content = formData.get('content')?.toString()?.trim() ?? ''

  if (!title || title.length < 2)
    return { error: 'Title must be at least 2 characters.' }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        points: {
          increment: 5,
        },
        posts: {
          create: {
            title,
            content,
          },
        },
      },
    })
    revalidateTag(`posts-user-${session.user.id}`, 'default')
    revalidateTag('blog-post', 'max')
    return { success: true }
  } catch {
    return { error: 'Failed to create post.' }
  }
}

export async function updatePost(
  _prev: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) return { error: 'You must be signed in.' }

  const id = formData.get('id')?.toString()
  const title = formData.get('title')?.toString()?.trim()
  const content = formData.get('content')?.toString()?.trim() ?? ''

  if (!id) return { error: 'Post ID required.' }
  if (!title || title.length < 2)
    return { error: 'Title must be at least 2 characters.' }

  try {
    await prisma.post.updateMany({
      where: { id, authorId: session.user.id },
      data: { title, content },
    })
    revalidateTag(`posts-user-${session.user.id}`, 'default')
    revalidateTag('blog-post', 'max')
    revalidateTag(`post-${id}`, 'max')

    return { success: true }
  } catch {
    return { error: 'Failed to update post.' }
  }
}

export async function deletePost(postId: string): Promise<PostActionState> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) return { error: 'You must be signed in.' }

  try {
    await prisma.post.deleteMany({
      where: { id: postId, authorId: session.user.id },
    })
    revalidateTag(`posts-user-${session.user.id}`, 'default')
    revalidateTag(`post-${postId}`, 'max')
    return { success: true }
  } catch {
    return { error: 'Failed to delete post.' }
  }
}

export async function getPosts(page: number = 1, limit: number = 6) {
  'use cache'
  cacheTag('blog-post')
  cacheLife('days')

  const skip = (page - 1) * limit

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        take: limit,
        skip: skip,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { name: true, image: true }, // Optimize payload
          },
        },
      }),
      prisma.post.count(),
    ])

    return {
      posts,
      metadata: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return {
      posts: [],
      metadata: {
        total: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }
}

export async function getPostById(id: string) {
  'use cache'
  cacheTag(`post-${id}`)
  cacheLife('days')

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    })

    return post
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return null
  }
}
