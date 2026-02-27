import { cacheLife } from 'next/cache'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'

import { getTopActiveMembers } from '@/actions/getTopActiveMembers'

import { TopMembersScroller } from './TopMembersScroller'

export async function TopMembersWraper() {
  'use cache'
  cacheTag('top-active-members')
  cacheLife('hours')

  const topMembers = await getTopActiveMembers()

  return <TopMembersScroller members={topMembers} />
}
