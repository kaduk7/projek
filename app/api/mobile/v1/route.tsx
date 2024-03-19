import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encryptData } from "@/app/helper";
import * as bcrypt from "bcrypt";
import axios from "axios";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  const body: any = await request.json();
  const mapData = JSON.parse(decrypt(body.data));

  // =================================================================== Start Umum mantap

  if (mapData.jenis_req === "login") {
    const result = await Login(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_slide") {
    const result = await LoadSlide(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_event") {
    const result = await LoadEvent(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  // =================================================================== End User

  return NextResponse.json(false, { status: 200 });
};

// =================================================================== Start Umum

async function Login(data: any) {
  const users = await prisma.userTb.findMany({
    where: {
      hp: String(data.hp),
    },
  });

  if (users.length == 0) return { err: true, msg: "Nomor HP tidak terdaftar" };

  const isValid = await bcrypt.compare(
    String(data.password),
    String(users[0].password)
  );

  if (!isValid) return { err: true, msg: "Password salah" };

  return { err: false, msg: "Login berhasil", data: users[0] };
}

async function LoadSlide(data: any) {
  const xAllId = await prisma.slideTb.findMany();

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.slideTb.findMany({
    where: {
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function LoadEvent(data: any) {
  const xAllId = await prisma.eventTb.findMany();

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.eventTb.findMany({
    where: {
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}
