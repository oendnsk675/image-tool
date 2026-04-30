import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.settings.findMany()
    const result: Record<string, string> = {}
    settings.forEach((s) => {
      result[s.key] = s.value
    })
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const entries = Object.entries(body) as [string, string][]

    await Promise.all(
      entries.map(([key, value]) =>
        prisma.settings.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings POST error:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
