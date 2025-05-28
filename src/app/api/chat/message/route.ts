import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  const { chatId, sender, content, assistantId } = await req.json()

  // Salva a mensagem do usuário
  const userMessage = await prisma.message.create({
    data: { chatId, sender, content }
  })

  // Busca persona do assistente
  const assistant = await prisma.assistant.findUnique({ where: { id: assistantId } })

  // Busca TODO o histórico de mensagens desse chat
  const history = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' } // importante para manter ordem correta
  })

  // Monta o array para o OpenAI (system, user, assistant...)
  const openaiMessages = [
    { role: "system" as const, content: assistant?.persona ?? "" },
    ...history.map(msg => ({
      role: msg.sender === "user" ? ("user" as const) : ("assistant" as const),
      content: msg.content
    })),
    // NÃO inclua novamente a mensagem recém salva, pois ela já estará no history
  ]

  // Faz a requisição pro GPT usando o histórico completo
  const gptResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: openaiMessages,
    max_tokens: 200,
    temperature: 0.7
  })
  const assistantMessageContent = gptResponse.choices[0].message.content?.trim() || "Não entendi."

  // Salva resposta do assistente
  const assistantMessage = await prisma.message.create({
    data: { chatId, sender: "assistant", content: assistantMessageContent }
  })

  return NextResponse.json({ userMessage, assistantMessage })
}
