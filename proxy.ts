import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth/auth'

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const allowedRoles = ['EXECUTIVE', 'ADMIN', 'SUPER_ADMIN']

    if (!allowedRoles.includes(session.user.role ?? '')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (session && (pathname === '/login' || pathname === '/registration')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/registration'],
}
