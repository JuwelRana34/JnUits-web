'use client'

import { CldImage } from 'next-cloudinary'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string | null
  email: string | null
  image?: string | null
}

interface CommitteeMember {
  id: string
  designation: string
  user: User
}

interface Committee {
  id: string
  session: string
  members: CommitteeMember[]
}

interface Props {
  committee: Committee | null
  committees: { id: string; session: string }[]
}

export default function CommitteeView({ committee, committees }: Props) {
  const router = useRouter()

  const handleChange = (session: string) => {
    router.push(`/committee?session=${session}`)
  }

  if (!committee) {
    return <p className="text-center text-gray-500">No committee found</p>
  }

  return (
    <div className="space-y-6 p-3">
      {/* Dropdown */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">
          Committee Session: {committee.session}
        </h2>

        <select
          value={committee.session}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm sm:w-auto"
        >
          {committees.map((c) => (
            <option key={c.id} value={c.session}>
              {c.session}
            </option>
          ))}
        </select>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {committee.members.map((m) => (
          <div
            key={m.id}
            className="flex flex-col items-center rounded-xl border bg-white p-4 text-center shadow-sm"
          >
            <div className="relative h-20 w-20 overflow-hidden rounded-full shadow-lg ring-2 ring-blue-200 md:h-24 md:w-24">
              <CldImage
                src={m.user.image || '/default-avatar.png'}
                alt={m.user.name || 'User Avatar'}
                fill
                sizes="(max-width: 768px) 96px, 112px"
                crop="fill"
                gravity="auto"
                quality="auto"
                className="object-cover"
              />
            </div>
            <p className="text-lg font-semibold">{m.user.name || 'N/A'}</p>
            <p className="mb-2 text-sm text-gray-500">
              {m.user.email || 'N/A'}
            </p>
            <p className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
              {m.designation}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
