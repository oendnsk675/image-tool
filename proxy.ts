import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { auth } from '@/lib/auth'

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()
  const existingSession = req.cookies.get('_session_id')

  if (!existingSession) {
    res.cookies.set('_session_id', uuidv4(), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      path: '/',
    })
  }

  const { pathname } = req.nextUrl
  const session = await auth()

  const publicRoutes = ['/', '/signin', '/signup']
  const authRoutes = ['/signin', '/signup']
  const protectedRoutes = ['/converter', '/remove-bg', '/history', '/settings', '/bulk-resize', '/compressor', '/image-editor', '/templates', '/favorites', '/upgrade']

  if (session?.user && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!session?.user && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
