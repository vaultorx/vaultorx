/*
  Warnings:

  - A unique constraint covering the columns `[assignedWallet]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('available', 'assigned', 'maintenance', 'disabled');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "assignedWallet" TEXT,
ADD COLUMN     "walletAssignedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "platform_wallets" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "status" "WalletStatus" NOT NULL DEFAULT 'available',
    "assignedTo" TEXT,
    "assignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_wallets_address_key" ON "platform_wallets"("address");

-- CreateIndex
CREATE UNIQUE INDEX "platform_wallets_index_key" ON "platform_wallets"("index");

-- CreateIndex
CREATE UNIQUE INDEX "platform_wallets_assignedTo_key" ON "platform_wallets"("assignedTo");

-- CreateIndex
CREATE UNIQUE INDEX "users_assignedWallet_key" ON "users"("assignedWallet");

-- AddForeignKey
ALTER TABLE "platform_wallets" ADD CONSTRAINT "platform_wallets_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
