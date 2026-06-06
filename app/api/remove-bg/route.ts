import { NextRequest, NextResponse } from 'next/server'
import { removeBg } from '@/lib/remove-bg'
import { checkRateLimit, removeBgLimiter } from '@/lib/rate-limit'
import { getIdentifier } from '@/lib/get-identifier'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(req: NextRequest) {
  const rateLimitRes = await checkRateLimit(removeBgLimiter, getIdentifier(req))
  if (rateLimitRes) return rateLimitRes

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 413 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)

    const outputBuffer = await removeBg(inputBuffer, file.type || 'image/png')

    return new NextResponse(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': outputBuffer.length.toString(),
        'Content-Disposition': 'attachment; filename="removed-bg.png"',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Remove BG error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
