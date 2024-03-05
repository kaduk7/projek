import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    const formData = await request.formData()
    await prisma.tpsTb.create({
        data: {
            nama: String(formData.get('nama')),
            alamat: String(formData.get('alamat')),
            ruteId: Number(formData.get('ruteId')),
            jamOperasional: String(formData.get('jamOperasional')),
            koordinat: String(formData.get('koordinat')),
            foto: String(formData.get('namaunik')),
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })
}

export const GET = async () => {
    const user = await prisma.tpsTb.findMany({
        include:{
            ruteTb:true
        },
        orderBy: {
            nama: 'asc'
        }
    });
    return NextResponse.json(user, { status: 200 })
}