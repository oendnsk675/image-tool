import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'
import { NextResponse } from 'next/server'

export const convertLimiter = new RateLimiterMemory({
  points: 30,
  duration: 600, // 10 minutes
})

export const removeBgLimiter = new RateLimiterMemory({
  points: 10,
  duration: 600,
})

export const historyGetLimiter = new RateLimiterMemory({
  points: 60,
  duration: 60, // 1 minute
})

export const historyDeleteLimiter = new RateLimiterMemory({
  points: 20,
  duration: 60,
})

/**
 * Checks rate limit for the given limiter + identifier.
 * Returns a 429 NextResponse if exceeded, or null if OK.
 */
export async function checkRateLimit(
  limiter: RateLimiterMemory,
  identifier: string
): Promise<NextResponse | null> {
  try {
    const result = await limiter.consume(identifier)
    return null // allowed
  } catch (e) {
    const res = e as RateLimiterRes
    const retryAfter = Math.ceil(res.msBeforeNext / 1000)
    const limit = limiter.points
    const reset = Math.ceil(Date.now() / 1000) + retryAfter

    return new NextResponse(
      JSON.stringify({ error: 'Rate limit exceeded', retryAfter }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(reset),
          'Retry-After': String(retryAfter),
        },
      }
    )
  }
}

/**
 * Attaches X-RateLimit-* headers to a response after a successful consume.
 */
export function applyRateLimitHeaders(
  response: NextResponse,
  result: RateLimiterRes,
  limiter: RateLimiterMemory
): NextResponse {
  const reset = Math.ceil((Date.now() + result.msBeforeNext) / 1000)
  response.headers.set('X-RateLimit-Limit', String(limiter.points))
  response.headers.set('X-RateLimit-Remaining', String(result.remainingPoints ?? 0))
  response.headers.set('X-RateLimit-Reset', String(reset))
  return response
}
