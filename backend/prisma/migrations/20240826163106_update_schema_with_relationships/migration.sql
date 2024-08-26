/*
  Warnings:

  - The values [MEDICAL_DATA_ENTRY,USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Store` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'MEDICAL_STORE', 'DATA_ENTRY');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_userId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "createdAt",
DROP COLUMN "storeId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "address" TEXT,
ALTER COLUMN "role" DROP DEFAULT;

-- DropTable
DROP TABLE "Store";

-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "billNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentType" TEXT NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
