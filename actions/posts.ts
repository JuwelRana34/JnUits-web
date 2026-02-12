'use server'

import { revalidateTag } from 'next/cache'
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
    await prisma.post.create({
      data: { title, content, authorId: session.user.id },
    })
    revalidateTag(`posts-user-${session.user.id}`, 'default')
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
    return { success: true }
  } catch {
    return { error: 'Failed to delete post.' }
  }
}
