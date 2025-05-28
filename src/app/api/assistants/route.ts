import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // ou como está seu import

export async function GET() {
  try {
    const assistants = await prisma.assistant.findMany()
    return NextResponse.json({ assistants })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load assistants' }, { status: 500 })
  }
}
