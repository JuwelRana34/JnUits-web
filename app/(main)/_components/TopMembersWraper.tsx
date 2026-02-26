import { getTopActiveMembers } from '@/actions/getTopActiveMembers'

import { TopMembersScroller } from './TopMembersScroller'

export async function TopMembersWraper() {
  const topMembers = await getTopActiveMembers()

  return <TopMembersScroller members={topMembers} />
}
