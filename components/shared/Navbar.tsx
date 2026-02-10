import { getCachedSession } from '@/lib/auth/getSession'

import NavbarClient from './NavbarClient'

export default async function Navbar() {
  const session = await getCachedSession()

  return <NavbarClient session={session} />
}
