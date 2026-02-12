'use client'

import { startTransition, useActionState, useState } from 'react'

import { useRouter } from 'next/navigation'

import { FilePenLine, Loader2, Plus } from 'lucide-react'

import { type PostActionState, createPost, updatePost } from '@/actions/posts'
import TiptapEditor from '@/components/editor/tiptap-editor'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface PostEditorDialogProps {
  post?: { id: string; title: string; content: string } | null
  variant?: 'create' | 'edit'
}

export default function PostEditorDialog({
  post,
  variant = 'create',
}: PostEditorDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const initialContent = variant === 'edit' && post ? post.content : '<p></p>'
  const [content, setContent] = useState(initialContent)

  const handleAction = async (
    prevState: PostActionState,
    formData: FormData
  ) => {
    const action = variant === 'create' ? createPost : updatePost
    const result = await action(prevState, formData)

    if (result?.success) {
      setOpen(false)
      startTransition(() => {
        router.refresh()
      })
    }
    return result
  }

  const [state, formAction, isPending] = useActionState(handleAction, {
    success: false,
  } as PostActionState)

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setContent(initialContent)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {variant === 'create' ? (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <FilePenLine className="h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {variant === 'create' ? 'Create Blog Post' : 'Edit Post'}
          </DialogTitle>
          <DialogDescription>
            {variant === 'create'
              ? 'Write a new blog post with rich text formatting.'
              : 'Update your blog post.'}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {variant === 'edit' && post && (
            <input type="hidden" name="id" value={post.id} />
          )}

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  defaultValue={post?.title ?? ''}
                  placeholder="Post title"
                  required
                  disabled={isPending}
                  className="font-medium"
                />
              </Field>

              <Field>
                <FieldLabel>Content</FieldLabel>
                <TiptapEditor
                  content={content}
                  onChange={(html) => setContent(html)}
                  placeholder="Write your post content..."
                  minHeight="min-h-[220px]"
                  // ৩. Type Error ফিক্স: immediatelyRender প্রপটি আপনার কাস্টম কম্পোনেন্টে সাপোর্ট করে না, তাই সরিয়ে দেওয়া হয়েছে।
                />
                <input type="hidden" name="content" value={content} />
              </Field>
            </FieldGroup>
          </FieldSet>

          {state?.error && (
            <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
              {state.error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {variant === 'create' ? 'Creating...' : 'Saving...'}
                </>
              ) : variant === 'create' ? (
                'Create Post'
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
