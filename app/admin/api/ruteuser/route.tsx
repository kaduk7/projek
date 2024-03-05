import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    const formData = await request.formData()
    await prisma.ruteUserTb.create({
        data: {
            userId: Number(formData.get('userId')),
            ruteId: Number(formData.get('ruteid')),
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })
}

export const GET = async () => {
    const user = await prisma.ruteUserTb.findMany({
        include:{
            ruteTb:true,
            userTb:true,
        },
    });
    return NextResponse.json(user, { status: 200 })
}