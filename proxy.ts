import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export function proxy(req: NextRequest) {
  const res = NextResponse.next()
  const existingSession = req.cookies.get('_session_id')

  if (!existingSession) {
    res.cookies.set('_session_id', uuidv4(), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
