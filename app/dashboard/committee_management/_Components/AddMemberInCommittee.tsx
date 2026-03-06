import { getAllCommittees } from '@/actions/committeeActions/commiteeAction'

import AddMemberForm from './AddMemberForm'

export default async function AddMemberInCommittee() {
  const Committees = await getAllCommittees()
  return (
    <div className="space-y-6">
      <AddMemberForm committees={Committees} />
    </div>
  )
}
