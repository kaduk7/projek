import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    const formData = await request.formData()
    const cekhp = await prisma.userTb.findUnique({
        where: {
            hp: String(formData.get('hp')),
        }
    })
    const cekwa = await prisma.userTb.findUnique({
        where: {
            wa: String(formData.get('wa')),
        }
    })
    if (cekhp) {
        return NextResponse.json({ pesan: "Nohp sudah ada" })
    }
    if (cekwa) {
        return NextResponse.json({ pesan: "Nowa sudah ada" })
    }
    await prisma.userTb.create({
        data: {
            nama: String(formData.get('nama')),
            jenis: String(formData.get('jenis')),
            hp: String(formData.get('hp')),
            wa: String(formData.get('wa')),
            foto: String(formData.get('namaunik')),
            password: await bcrypt.hash(String(formData.get('password')), 10),
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })
}

export const GET = async () => {
    const user = await prisma.userTb.findMany({
        where: {
            NOT: {
                jenis: 'Admin'
            }
        },
        orderBy: {
            nama: 'asc'
        }
    });
    const mandor = await prisma.userTb.findMany({
        where: {
            jenis: 'Mandor'
        },
        orderBy: {
            nama: 'asc'
        }
    });
    const pengawas = await prisma.userTb.findMany({
        where: {
            jenis: 'Pengawas'
        },
        orderBy: {
            nama: 'asc'
        }
    });
    return NextResponse.json([user, mandor, pengawas], { status: 200 })
}