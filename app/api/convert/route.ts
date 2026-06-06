import { NextRequest, NextResponse } from 'next/server'
import { convertImage, getImageMetadata, type OutputFormat } from '@/lib/sharp'
import { checkRateLimit, convertLimiter } from '@/lib/rate-limit'
import { getIdentifier } from '@/lib/get-identifier'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  const rateLimitRes = await checkRateLimit(convertLimiter, getIdentifier(req))
  if (rateLimitRes) return rateLimitRes

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const outputFormat = formData.get('outputFormat') as OutputFormat | null
    const quality = formData.get('quality') ? Number(formData.get('quality')) : 85
    const width = formData.get('width') ? Number(formData.get('width')) : undefined
    const height = formData.get('height') ? Number(formData.get('height')) : undefined
    const maintainAspectRatio = formData.get('maintainAspectRatio') !== 'false'

    if (!file || !outputFormat) {
      return NextResponse.json({ error: 'file and outputFormat are required' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 413 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)
    const meta = await getImageMetadata(inputBuffer)

    const outputBuffer = await convertImage(inputBuffer, {
      outputFormat,
      quality,
      width,
      height,
      maintainAspectRatio,
    })

    return new NextResponse(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        'Content-Type': `image/${outputFormat}`,
        'Content-Length': outputBuffer.length.toString(),
        'Content-Disposition': `attachment; filename="converted.${outputFormat}"`,
      },
    })
  } catch (error) {
    console.error('Convert error:', error)
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 })
  }
}
