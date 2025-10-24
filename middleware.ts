import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let cookie = request.cookies.get('traveler_session')?.value

  if (pathname.startsWith('/dashboard')) {
    if (request.cookies.has('traveler_session') && cookie?.split('--')[1] !== 'admin') {
      return NextResponse.redirect(new URL('/@me', request.url))
    }
  }

  if (pathname.startsWith('/@me')) {
    if (request.cookies.has('traveler_session') && cookie?.split('--')[1] == 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  if (!request.cookies.has('traveler_session')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/@me/:path*', '/request/restaurant', '/dashboard/:path*', '/me/:path*', '/leaderboard'],
}