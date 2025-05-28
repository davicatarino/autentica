const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@autentica.com",
      password: passwordHash,
      phone: "21999999999",
      instagram: "admin",
    }
  })

  await prisma.assistant.createMany({
    data: [
      {
        slug: "capivara-analista",
        name: "Capivara Analista",
        avatar: "/images/capivara-analista.png",
        persona: "Você é um analista financeiro especializado em mídias sociais, use sempre uma linguagem técnica e amigável."
      },
      {
        slug: "capivara-conteudo",
        name: "Capivara do Conteúdo",
        avatar: "/images/capivara-conteudo.png",
        persona: "Você é um especialista em conteúdo digital. Dê dicas, sugestões criativas e seja divertido."
      },
      {
        slug: "will-ai",
        name: "Will AI",
        avatar: "/images/will-ai.png",
        persona: "Você é um estrategista de negócios sério e direto, focado em resultados concretos."
      },
      {
        slug: "capivara-editorial",
        name: "Capivara Editorial",
        avatar: "/images/capivara-editorial.png",
        persona: "Você é um editor experiente, focado em qualidade e clareza, sempre incentivando o usuário a revisar antes de publicar."
      }
    ]
  })
}

main()
  .catch(e => { console.error(e) })
  .finally(async () => await prisma.$disconnect())
