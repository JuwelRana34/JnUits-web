import { headers } from 'next/headers'

import { auth } from './auth/auth'

export async function verifyAdminAccess() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const role = session?.user.role

  if (
    role !== 'ADMIN' &&
    role !== 'SUPER_ADMIN' &&
    role !== 'SUB_EXECUTIVE' &&
    role !== 'EXECUTIVE'
  ) {
    throw new Error("Unauthorized access! You can't perform this Action.")
  }
}
export async function verifyOnlyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const role = session?.user.role

  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    throw new Error("Unauthorized access! You can't perform this Action.")
  }
}
