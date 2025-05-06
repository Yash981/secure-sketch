import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/home'

  const token = request.cookies.get('token')?.value || ''
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/home', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/home',
    '/collaboration/:path*'
  ]
}