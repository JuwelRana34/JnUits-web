import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get('better-auth.session_token')

  if (request.nextUrl.pathname.startsWith('/profile') && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile'],
}
