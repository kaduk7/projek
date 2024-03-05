/*
  Warnings:

  - You are about to drop the column `status` on the `UserTb` table. All the data in the column will be lost.
  - You are about to drop the column `usernama` on the `UserTb` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hp]` on the table `UserTb` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wa]` on the table `UserTb` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `foto` to the `UserTb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp` to the `UserTb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jenis` to the `UserTb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `UserTb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wa` to the `UserTb` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserTb_usernama_key";

-- AlterTable
ALTER TABLE "UserTb" DROP COLUMN "status",
DROP COLUMN "usernama",
ADD COLUMN     "foto" TEXT NOT NULL,
ADD COLUMN     "hp" TEXT NOT NULL,
ADD COLUMN     "jenis" TEXT NOT NULL,
ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "wa" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ZonaTb" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZonaTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuteTb" (
    "id" SERIAL NOT NULL,
    "zonaId" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RuteTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TpsTb" (
    "id" SERIAL NOT NULL,
    "ruteId" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "jamOperasional" TEXT NOT NULL,
    "koordinat" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TpsTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuteUserTb" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ruteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RuteUserTb_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTb_hp_key" ON "UserTb"("hp");

-- CreateIndex
CREATE UNIQUE INDEX "UserTb_wa_key" ON "UserTb"("wa");

-- AddForeignKey
ALTER TABLE "RuteTb" ADD CONSTRAINT "RuteTb_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "ZonaTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TpsTb" ADD CONSTRAINT "TpsTb_ruteId_fkey" FOREIGN KEY ("ruteId") REFERENCES "RuteTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuteUserTb" ADD CONSTRAINT "RuteUserTb_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuteUserTb" ADD CONSTRAINT "RuteUserTb_ruteId_fkey" FOREIGN KEY ("ruteId") REFERENCES "RuteTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;
