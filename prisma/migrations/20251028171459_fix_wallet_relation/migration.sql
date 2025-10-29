/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `platform_wallets` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "platform_wallets" DROP CONSTRAINT "platform_wallets_assignedTo_fkey";

-- DropIndex
DROP INDEX "platform_wallets_assignedTo_key";

-- DropIndex
DROP INDEX "users_assignedWallet_key";

-- AlterTable
ALTER TABLE "platform_wallets" DROP COLUMN "assignedTo";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_assignedWallet_fkey" FOREIGN KEY ("assignedWallet") REFERENCES "platform_wallets"("address") ON DELETE SET NULL ON UPDATE CASCADE;
