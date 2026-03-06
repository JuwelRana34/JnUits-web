import {
  getAllCommittees,
  getCommitteeWithMembers,
} from '@/actions/committeeActions/commiteeAction'

import AdminCommitteeTable from './AdminCommitteeTable'
import CommitteeList from './CommitteeSessionList'

interface Props {
  session?: string
}
export default async function AdminCommitteePage({ session }: Props) {
  const [committee, committees] = await Promise.all([
    getCommitteeWithMembers(session),
    getAllCommittees(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Manage Committee
          </h1>
          <p className="text-sm text-gray-500">
            Add, update, or remove committee members for different sessions.
          </p>
        </div>
      </div>

      <AdminCommitteeTable committee={committee} committees={committees} />

      <CommitteeList committees={committees} />
    </div>
  )
}
