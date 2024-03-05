import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    const formData = await request.formData()
    await prisma.ruteTb.update({
        where: {
            id: Number(params.id)
        },
        data: {
            nama: String(formData.get('nama')),
            zonaId: Number(formData.get('zonaId')),
        }
    })
    return NextResponse.json({ status: 200, pesan: "berhasil" })
}

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {

    await prisma.ruteTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json({ status: 200 })
}

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    const karyawan = await prisma.ruteTb.findMany({
        where: {
            zonaId: Number(params.id)
        },
        orderBy: {
            nama: "asc"
        }
    });
    return NextResponse.json(karyawan, { status: 200 })

}