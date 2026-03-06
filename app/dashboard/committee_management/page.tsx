import { Suspense } from 'react'

import AddMemberInCommittee from './_Components/AddMemberInCommittee'
import CreateCommitteeForm from './_Components/CreateCommitteeForm'
import ManageExistingMember from './_Components/ManageExistingMember'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function CommitteManagement({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const resolvedParams = await searchParams
  const session =
    typeof resolvedParams.session === 'string'
      ? resolvedParams.session
      : undefined

  return (
    <div className="container mx-auto space-y-8 px-1 py-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Committee Management
        </h1>
        <p className="text-muted-foreground">
          Create new sessions and manage executive committee members.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Side: Create New Session */}
        <div className="space-y-6">
          <CreateCommitteeForm />
        </div>

        {/* Right Side: Add Members to Session */}
        <Suspense fallback={<p>loading...</p>}>
          <AddMemberInCommittee />
        </Suspense>
      </div>

      {/* Right Side: Add Members to Session */}
      <Suspense fallback={<p>loading...</p>}>
        <ManageExistingMember session={session} />
      </Suspense>
    </div>
  )
}
