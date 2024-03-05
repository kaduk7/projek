import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    const formData = await request.formData()
    await prisma.zonaTb.create({
        data: {
            nama: String(formData.get('nama')),
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })
}

export const GET = async () => {
    const user = await prisma.zonaTb.findMany({
        orderBy: {
            nama: 'asc'
        }
    });
    return NextResponse.json(user, { status: 200 })
}