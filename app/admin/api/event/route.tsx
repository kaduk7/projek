import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    const formData = await request.formData()
    await prisma.eventTb.create({
        data: {
            userId: Number(formData.get('userId')),
            tanggalMulai: String(formData.get('tanggalMulai')),
            tanggalSelesai: String(formData.get('tanggalSelesai')),
            nama: String(formData.get('nama')),
            keterangan: String(formData.get('keterangan')),
            alamatLokasi: String(formData.get('alamatLokasi')),
            koordinat: String(formData.get('koordinat')),
            foto: String(formData.get('namaunik')),
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })
}

export const GET = async () => {
    const user = await prisma.eventTb.findMany({
        orderBy: {
            nama: 'asc'
        }
    });
    return NextResponse.json(user, { status: 200 })
}