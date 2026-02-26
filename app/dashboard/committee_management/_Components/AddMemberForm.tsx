'use client'

import { useState } from 'react'

import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

import {
  addMemberAction,
  searchUsers,
} from '@/actions/committeeActions/commiteeAction'

interface AddMemberProps {
  committees: { id: string; session: string }[]
}

interface UserResult {
  id: string
  name: string
  email: string
}

export default function AddMemberForm({ committees }: AddMemberProps) {
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserResult[]>([])
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // 🔎 Search handler
  const handleSearch = async () => {
    if (query.trim().length < 2) {
      toast.error('Type at least 2 characters')
      return
    }

    setIsSearching(true)

    try {
      const users = await searchUsers(query.trim())
      setResults(users)
    } catch (error) {
      console.error(error)
      toast.error('Search failed')
    } finally {
      setIsSearching(false)
    }
  }

  // 📨 Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedUser) {
      toast.error('Please select a user')
      return
    }
    const form = e.currentTarget
    const formData = new FormData(e.currentTarget)

    setLoading(true)

    try {
      const res = await addMemberAction(formData)

      if (!res.success) {
        toast.error(res.message)
        return
      }

      toast.success('Member Added Successfully!')
      form.reset()
      setSelectedUser(null)
      setQuery('')
      setResults([])
    } catch (error: unknown) {
      console.error(error)

      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold">Add Committee Member</h3>
        <p className="text-muted-foreground text-sm">
          Assign a user to a specific committee with a role.
        </p>
      </div>

      <div className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Committee */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Committee</label>
            <select
              name="committeeId"
              required
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Select a session...</option>
              {committees.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.session}
                </option>
              ))}
            </select>
          </div>

          {/* Search User */}
          <div className="relative space-y-2">
            <label className="text-sm font-medium">Search User</label>

            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSearch()
                  }
                }}
                placeholder="Search by name or email..."
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              />

              <button
                type="button"
                onClick={handleSearch}
                className="rounded-md bg-black px-4 text-white"
              >
                {isSearching ? '...' : 'Search'}
              </button>
            </div>

            {results.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border bg-white shadow">
                {results.map((user) => (
                  <div
                    key={user.id}
                    className="cursor-pointer p-2 text-sm hover:bg-gray-100"
                    onClick={() => {
                      setSelectedUser(user)
                      setQuery(`${user.name} (${user.email})`)
                      setResults([])
                    }}
                  >
                    {user.name} ({user.email})
                  </div>
                ))}
              </div>
            )}

            {selectedUser && (
              <input type="hidden" name="userId" value={selectedUser.id} />
            )}
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Designation</label>
            <input
              type="text"
              name="designation"
              placeholder="e.g. President"
              required
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Add Member
          </button>
        </form>
      </div>
    </div>
  )
}
