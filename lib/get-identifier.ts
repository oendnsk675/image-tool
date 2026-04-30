/**
 * Resolves a unique identifier for rate limiting.
 * Priority: _session_id cookie → CF-Connecting-IP → X-Forwarded-For → fallback
 */
export function getIdentifier(req: Request): string {
  const cookie = req.headers.get('cookie') ?? ''
  const sessionId = parseCookie(cookie)['_session_id']
  if (sessionId) return `cookie_${sessionId}`

  const cfIp = req.headers.get('CF-Connecting-IP')
  if (cfIp) return `ip_${cfIp}`

  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return `ip_${forwarded.split(',')[0].trim()}`

  return 'unknown'
}

function parseCookie(cookieStr: string): Record<string, string> {
  return Object.fromEntries(
    cookieStr
      .split(';')
      .map((s) => s.trim().split('='))
      .filter(([k]) => k)
      .map(([k, ...v]) => [k.trim(), decodeURIComponent(v.join('=').trim())])
  )
}
