import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import path from "path"
import fs from "fs/promises"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const data = await req.formData()
  const file = data.get('image') as File

  if (!file) return NextResponse.json({ error: 'Nenhuma imagem enviada' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const uploadDir = path.join(process.cwd(), 'public/images')
  await fs.mkdir(uploadDir, { recursive: true })
  const filePath = path.join(uploadDir, `user_${id}.jpg`)
  await fs.writeFile(filePath, buffer)

  await prisma.user.update({ where: { id }, data: { image: `/images/user_${id}.jpg` } })

  return NextResponse.json({ url: `/images/user_${id}.jpg` })
}
