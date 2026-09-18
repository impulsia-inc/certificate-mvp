import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('fyn_session')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/login'

  if (isAdminRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|demo|uploads).*)'],
}
