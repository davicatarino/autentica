import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { assistantId, userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  }

  const chat = await prisma.chat.create({
    data: {
      assistantId: Number(assistantId),
      userId: Number(userId),
    },
    include: { messages: true, assistant: true }
  })
  return NextResponse.json({ chat })
}
