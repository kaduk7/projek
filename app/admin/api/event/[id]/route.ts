import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    const formData = await request.formData()
    const newfoto = formData.get('newfoto')
    await prisma.eventTb.update({
        where: {
            id: Number(params.id)
        },
        data: {
            userId: Number(formData.get('userId')),
            tanggalMulai: String(formData.get('tanggalMulai')),
            tanggalSelesai: String(formData.get('tanggalSelesai')),
            nama: String(formData.get('nama')),
            keterangan: String(formData.get('keterangan')),
            alamatLokasi: String(formData.get('alamatLokasi')),
            koordinat: String(formData.get('koordinat')),
        }
    })
    if (newfoto === 'yes') {
        await prisma.eventTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                foto: String(formData.get('namaunik')),
            }
        })
    }
    return NextResponse.json({ status: 200, pesan: "berhasil" })
}

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {

    await prisma.eventTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json({ status: 200 })
}