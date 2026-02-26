'use client'

import { useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { Loader2, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

import { createCommitteeAction } from '@/actions/committeeActions/commiteeAction'

export default function CreateCommitteeForm() {
  const [loading, startTransaction] = useTransition()
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    startTransaction(async () => {
      const session = formData.get('session') as string
      const regex = /^\d{4}-\d{4}$/
      if (!regex.test(session)) {
        toast.error('Invalid Format! Use 2026-2027')
        return
      }
      await createCommitteeAction(formData)
      router.refresh()
      toast.success('Committee Session Created!')
    })
  }

  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl leading-none font-semibold tracking-tight">
          Create New Session
        </h3>
        <p className="text-muted-foreground text-sm">
          Start a new committee term (e.g. 2026-27)
        </p>
      </div>
      <div className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Session Name
            </label>
            <input
              type="text"
              name="session"
              pattern="^\d{4}-\d{4}$"
              title="Format must be like 2026-2027"
              placeholder="e.g. 2026-2027"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isCurrent"
              id="isCurrent"
              className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor="isCurrent"
              className="cursor-pointer text-sm leading-none font-medium"
            >
              Set as Current Active Committee
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            Create Session
          </button>
        </form>
      </div>
    </div>
  )
}
