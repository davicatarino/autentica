import { prisma } from "@/lib/prisma"; // Ajuste o caminho se for diferente
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

// Instancia o cliente da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Endpoint para processar mensagens de chat usando a Responses API da OpenAI.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Extrai os dados da requisição.
    // Os IDs no seu schema são Int, o JSON os tratará como number.
    const { chatId, content, assistantId }: { chatId: number; content: string; assistantId: number; } = await req.json();

    // Validação da entrada
    if (!chatId || !content || !assistantId) {
      return NextResponse.json(
        { error: "chatId, content, e assistantId são obrigatórios." },
        { status: 400 }
      );
    }

    // 2. Salva a mensagem do usuário no banco de dados.
    const userMessage = await prisma.message.create({
      data: {
        chatId: chatId,
        sender: "user",
        content: content,
      },
    });

    // 3. Busca a persona do assistente e o estado atual do chat em paralelo.
    const [assistant, chat] = await Promise.all([
      prisma.assistant.findUnique({ where: { id: assistantId } }),
      prisma.chat.findUnique({ where: { id: chatId } }),
    ]);

    // Valida se o assistente e o chat existem
    if (!assistant) {
      return NextResponse.json({ error: "Assistente não encontrado." }, { status: 404 });
    }
    if (!chat) {
      return NextResponse.json({ error: "Chat não encontrado." }, { status: 404 });
    }

    // 4. Chama a API Responses da OpenAI para gerar a resposta.
    const gptResponse = await openai.responses.create({
      model: "gpt-4o",
      input: content,
      instructions: assistant.persona || "Você é um assistente prestativo.",
      // A chave da memória: usa o ID da resposta anterior, que está salvo no nosso DB.
      previous_response_id: chat.lastResponseId || null,
      store: true,
    });

    // 5. Extrai o conteúdo de texto da resposta.
    const output = gptResponse.output?.[0];
    let assistantMessageContent = "Não foi possível gerar uma resposta.";
    if (output?.type === 'message' && output.content?.[0]?.type === 'output_text') {
      assistantMessageContent = output.content[0].text;
    }

    // 6. Salva a resposta do assistente no banco de dados.
    const assistantMessage = await prisma.message.create({
      data: {
        chatId: chatId,
        sender: "assistant",
        content: assistantMessageContent,
      },
    });

    // 7. ATUALIZA o chat com o ID da nova resposta. Essencial para a próxima interação.
    await prisma.chat.update({
      where: { id: chatId },
      data: { lastResponseId: gptResponse.id },
    });

    // 8. Retorna a confirmação para o frontend.
    return NextResponse.json({ userMessage, assistantMessage });

  } catch (error) {
    console.error("Erro no endpoint do chat:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}