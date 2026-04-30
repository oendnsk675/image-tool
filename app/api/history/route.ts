import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, historyGetLimiter, historyDeleteLimiter } from '@/lib/rate-limit'
import { getIdentifier } from '@/lib/get-identifier'

export async function GET(req: NextRequest) {
  const rateLimitRes = await checkRateLimit(historyGetLimiter, getIdentifier(req))
  if (rateLimitRes) return rateLimitRes

  try {
    const data = await prisma.conversionHistory.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data })
  } catch (error) {
    console.error('History GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const rateLimitRes = await checkRateLimit(historyDeleteLimiter, getIdentifier(req))
  if (rateLimitRes) return rateLimitRes

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      await prisma.conversionHistory.delete({ where: { id } })
    } else {
      await prisma.conversionHistory.deleteMany()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('History DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 })
  }
}
