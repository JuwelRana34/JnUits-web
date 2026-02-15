// 'use client'

// import { useEffect } from 'react'

// import Placeholder from '@tiptap/extension-placeholder'
// import { EditorContent, useEditor } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
// import {
//   Bold,
//   Heading2,
//   Heading3,
//   Italic,
//   List,
//   ListOrdered,
//   Minus,
//   Quote,
// } from 'lucide-react'

// import { cn } from '@/lib/utils'

// interface TiptapEditorProps {
//   content: string
//   onChange: (html: string) => void
//   placeholder?: string
//   editable?: boolean
//   className?: string
//   minHeight?: string
// }

// function ToolbarButton({
//   onClick,
//   active,
//   disabled,
//   children,
//   title,
// }: {
//   onClick: () => void
//   active?: boolean
//   disabled?: boolean
//   children: React.ReactNode
//   title: string
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       title={title}
//       className={cn(
//         'rounded p-1.5 transition-colors',
//         active
//           ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
//           : 'text-muted-foreground hover:bg-muted hover:text-foreground',
//         disabled && 'cursor-not-allowed opacity-50'
//       )}
//     >
//       {children}
//     </button>
//   )
// }

// export default function TiptapEditor({
//   content,
//   onChange,
//   placeholder = 'Write your content here...',
//   editable = true,
//   className,
//   minHeight = 'min-h-[180px]',
// }: TiptapEditorProps) {
//   const editor = useEditor({
//     immediatelyRender: false,
//     extensions: [
//       StarterKit.configure({
//         heading: { levels: [1, 2, 3] },
//       }),
//       Placeholder.configure({ placeholder }),
//     ],
//     content,
//     editable,
//     editorProps: {
//       attributes: {
//         class:
//           'prose prose-sm dark:prose-invert max-w-none focus:outline-none px-3 py-2',
//       },
//     },
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML())
//     },
//   })

//   useEffect(() => {
//     if (editor && content !== editor.getHTML()) {
//       editor.commands.setContent(content)
//     }
//   }, [content, editor])

//   if (!editor) return null

//   return (
//     <div
//       className={cn(
//         'bg-background overflow-hidden rounded-lg border',
//         editable &&
//           'ring-offset-background focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2',
//         className
//       )}
//     >
//       {editable && (
//         <div className="bg-muted/30 flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
//           <ToolbarButton
//             onClick={() => editor.chain().focus().toggleBold().run()}
//             active={editor.isActive('bold')}
//             title="Bold"
//           >
//             <Bold className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().toggleItalic().run()}
//             active={editor.isActive('italic')}
//             title="Italic"
//           >
//             <Italic className="h-4 w-4" />
//           </ToolbarButton>
//           <div className="bg-border mx-1 h-5 w-px" />
//           <ToolbarButton
//             onClick={() =>
//               editor.chain().focus().toggleHeading({ level: 2 }).run()
//             }
//             active={editor.isActive('heading', { level: 2 })}
//             title="Heading 2"
//           >
//             <Heading2 className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() =>
//               editor.chain().focus().toggleHeading({ level: 3 }).run()
//             }
//             active={editor.isActive('heading', { level: 3 })}
//             title="Heading 3"
//           >
//             <Heading3 className="h-4 w-4" />
//           </ToolbarButton>
//           <div className="bg-border mx-1 h-5 w-px" />
//           <ToolbarButton
//             onClick={() => editor.chain().focus().toggleBulletList().run()}
//             active={editor.isActive('bulletList')}
//             title="Bullet list"
//           >
//             <List className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().toggleOrderedList().run()}
//             active={editor.isActive('orderedList')}
//             title="Ordered list"
//           >
//             <ListOrdered className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().toggleBlockquote().run()}
//             active={editor.isActive('blockquote')}
//             title="Quote"
//           >
//             <Quote className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().setHorizontalRule().run()}
//             title="Horizontal rule"
//           >
//             <Minus className="h-4 w-4" />
//           </ToolbarButton>
//         </div>
//       )}
//       <div className={cn('overflow-auto', minHeight)}>
//         <EditorContent editor={editor} />
//       </div>
//     </div>
//   )
// }

// 'use client'

// import React, { useCallback, useEffect } from 'react'

// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
// import { Color } from '@tiptap/extension-color'
// import Link from '@tiptap/extension-link'
// import Placeholder from '@tiptap/extension-placeholder'
// import TextAlign from '@tiptap/extension-text-align'
// import {TextStyle} from '@tiptap/extension-text-style'
// import Underline from '@tiptap/extension-underline'
// import { EditorContent, useEditor } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
// import { common, createLowlight } from 'lowlight'
// import {
//   AlignCenter,
//   AlignLeft,
//   AlignRight,
//   Bold,
//   Code,
//   Italic,
//   Link as LinkIcon,
//   List,
//   ListOrdered,
//   Minus,
//   Quote,
//   Redo,
//   Underline as UnderlineIcon,
//   Undo,
// } from 'lucide-react'

// import { cn } from '@/lib/utils'

// const lowlight = createLowlight(common)

// interface TiptapEditorProps {
//   content: string
//   onChange: (html: string) => void
//   placeholder?: string
//   editable?: boolean
//   className?: string
//   minHeight?: string
// }

// function ToolbarButton({
//   onClick,
//   active,
//   disabled,
//   children,
//   title,
// }: {
//   onClick: () => void
//   active?: boolean
//   disabled?: boolean
//   children: React.ReactNode
//   title: string
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       title={title}
//       className={cn(
//         'rounded p-1.5 transition-colors',
//         active
//           ? 'bg-indigo-100 text-indigo-700'
//           : 'text-muted-foreground hover:bg-muted',
//         disabled && 'cursor-not-allowed opacity-50'
//       )}
//     >
//       {children}
//     </button>
//   )
// }

// export default function TiptapEditor({
//   content,
//   onChange,
//   placeholder = 'Write your content here...',
//   editable = true,
//   className,
//   minHeight = 'min-h-[180px]',
// }: TiptapEditorProps) {
//   const editor = useEditor({
//     immediatelyRender: false,
//     extensions: [
//       StarterKit.configure({
//         heading: { levels: [1, 2, 3] },
//         codeBlock: false, // ডিফল্ট কোডব্লক অফ করে lowlight অন করছি
//       }),
//       Underline,
//       TextStyle,
//       Color,
//       CodeBlockLowlight.configure({ lowlight }),
//       Link.configure({
//         openOnClick: false,
//         HTMLAttributes: { class: 'text-indigo-600 underline cursor-pointer' },
//       }),
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//       Placeholder.configure({ placeholder }),
//     ],
//     content,
//     editable,
//     editorProps: {
//       attributes: {
//         class: cn(
//           'prose prose-sm dark:prose-invert max-w-none focus:outline-none px-3 py-2',
//           minHeight
//         ),
//       },
//     },
//     onUpdate: ({ editor }) => onChange(editor.getHTML()),
//   })

//   const setLink = useCallback(() => {
//     const previousUrl = editor?.getAttributes('link').href
//     const url = window.prompt('URL', previousUrl)
//     if (url === null) return
//     if (url === '') {
//       editor?.chain().focus().extendMarkRange('link').unsetLink().run()
//       return
//     }
//     editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
//   }, [editor])

//   useEffect(() => {
//     if (editor && content !== editor.getHTML()) {
//       editor.commands.setContent(content, false)
//     }
//   }, [content, editor])

//   if (!editor) return null

//   return (
//     <div
//       className={cn(
//         'bg-background overflow-hidden rounded-lg border',
//         editable &&
//           'ring-border ring-1 focus-within:ring-2 focus-within:ring-indigo-500',
//         className
//       )}
//     >
//       {editable && (
//         <div className="bg-muted/30 flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
//           <ToolbarButton
//             onClick={() => editor.chain().focus().undo().run()}
//             disabled={!editor.can().undo()}
//             title="Undo"
//           >
//             <Undo className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().redo().run()}
//             disabled={!editor.can().redo()}
//             title="Redo"
//           >
//             <Redo className="h-4 w-4" />
//           </ToolbarButton>

//           <div className="bg-border mx-1 h-5 w-px" />

//           <ToolbarButton
//             onClick={() => editor.chain().focus().toggleBold().run()}
//             active={editor.isActive('bold')}
//             title="Bold"
//           >
//             <Bold className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().toggleItalic().run()}
//             active={editor.isActive('italic')}
//             title="Italic"
//           >
//             <Italic className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().toggleUnderline().run()}
//             active={editor.isActive('underline')}
//             title="Underline"
//           >
//             <UnderlineIcon className="h-4 w-4" />
//           </ToolbarButton>

//           {/* Text Color Picker */}
//           <input
//             type="color"
//             onInput={(event: any) =>
//               editor.chain().focus().setColor(event.target.value).run()
//             }
//             value={editor.getAttributes('textStyle').color || '#000000'}
//             className="h-6 w-6 cursor-pointer border-none bg-transparent p-0"
//             title="Text Color"
//           />

//           <ToolbarButton
//             onClick={setLink}
//             active={editor.isActive('link')}
//             title="Add Link"
//           >
//             <LinkIcon className="h-4 w-4" />
//           </ToolbarButton>

//           <div className="bg-border mx-1 h-5 w-px" />

//           <ToolbarButton
//             onClick={() => editor.chain().focus().setTextAlign('left').run()}
//             active={editor.isActive({ textAlign: 'left' })}
//             title="Left"
//           >
//             <AlignLeft className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().setTextAlign('center').run()}
//             active={editor.isActive({ textAlign: 'center' })}
//             title="Center"
//           >
//             <AlignCenter className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().setTextAlign('right').run()}
//             active={editor.isActive({ textAlign: 'right' })}
//             title="Right"
//           >
//             <AlignRight className="h-4 w-4" />
//           </ToolbarButton>

//           <div className="bg-border mx-1 h-5 w-px" />

//           <ToolbarButton
//             onClick={() => editor.chain().focus().toggleBulletList().run()}
//             active={editor.isActive('bulletList')}
//             title="Bullets"
//           >
//             <List className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().toggleOrderedList().run()}
//             active={editor.isActive('orderedList')}
//             title="Numbered"
//           >
//             <ListOrdered className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//             active={editor.isActive('codeBlock')}
//             title="Code Block"
//           >
//             <Code className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().toggleBlockquote().run()}
//             active={editor.isActive('blockquote')}
//             title="Quote"
//           >
//             <Quote className="h-4 w-4" />
//           </ToolbarButton>
//           <ToolbarButton
//             onClick={() => editor.chain().focus().setHorizontalRule().run()}
//             title="Divider"
//           >
//             <Minus className="h-4 w-4" />
//           </ToolbarButton>
//         </div>
//       )}
//       <div className="overflow-auto bg-white">
//         <EditorContent editor={editor} />
//       </div>
//     </div>
//   )
// }

'use client'

import React, { ChangeEvent, useCallback, useEffect } from 'react'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Color } from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Underline as UnderlineIcon,
  Undo,
} from 'lucide-react'

import { cn } from '@/lib/utils'

// Lowlight instance creation with proper common languages
const lowlight = createLowlight(common)

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  editable?: boolean
  className?: string
  minHeight?: string
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'rounded p-1.5 transition-colors',
        active
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-muted-foreground hover:bg-muted',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  )
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = 'Write your content here...',
  editable = true,
  className,
  minHeight = 'min-h-[180px]',
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Underline,
      TextStyle,
      Color,
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-indigo-600 underline cursor-pointer' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none px-3 py-2',
          minHeight
        ),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  // Color picker change handler with React.ChangeEvent
  const handleColorInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!editor) return
      editor.chain().focus().setColor(event.target.value).run()
    },
    [editor]
  )

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div
      className={cn(
        'bg-background overflow-hidden rounded-lg border',
        editable &&
          'ring-border ring-1 focus-within:ring-2 focus-within:ring-indigo-500',
        className
      )}
    >
      {editable && (
        <div className="bg-muted/30 flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>

          <div className="bg-border mx-1 h-5 w-px" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>

          {/* Type-safe Color Picker */}
          <input
            type="color"
            onInput={handleColorInput}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="h-6 w-6 cursor-pointer border-none bg-transparent p-0"
            title="Text Color"
          />

          <ToolbarButton
            onClick={setLink}
            active={editor.isActive('link')}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>

          <div className="bg-border mx-1 h-5 w-px" />

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Left"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Center"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Right"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>

          <div className="bg-border mx-1 h-5 w-px" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullets"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Divider"
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
        </div>
      )}
      <div className="overflow-auto bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
