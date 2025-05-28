import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  console.log("Chegou na rota /api/chat/[id] com params:", params)
  const chatId = Number(params.id)
  if (isNaN(chatId)) {
    return NextResponse.json({ chat: null })
  }
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: true, assistant: true }
  })
  console.log("chat encontrado:", chat)
  return NextResponse.json({ chat: chat || null })
}
