import {
  getAllCommittees,
  getCommitteeWithMembers,
} from '@/actions/committeeActions/commiteeAction'

import CommitteeView from '../_Components/CommitteeView'

export default async function CommitteePage({
  searchParams,
}: {
  searchParams?: { session?: string }
}) {
  const sessionRaw = await searchParams
  const session = sessionRaw?.session

  const committee = await getCommitteeWithMembers(session)
  const committees = await getAllCommittees()

  return <CommitteeView committee={committee} committees={committees} />
}
