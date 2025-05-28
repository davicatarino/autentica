import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const user = await prisma.user.findUnique({ where: { id } })
  return NextResponse.json({ user })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const data = await req.json()
  const user = await prisma.user.update({ where: { id }, data })
  return NextResponse.json({ user })
}
