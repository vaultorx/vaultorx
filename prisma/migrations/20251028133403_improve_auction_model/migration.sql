/*
  Warnings:

  - The values [english,dutch,vickrey] on the enum `AuctionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('pending', 'approved', 'rejected', 'completed');

-- AlterEnum
BEGIN;
CREATE TYPE "AuctionType_new" AS ENUM ('STANDARD', 'RESERVE', 'TIMED', 'DUTCH', 'BLIND', 'LOTTERY', 'BUY_NOW', 'MULTI_TOKEN');
ALTER TABLE "auctions" ALTER COLUMN "type" TYPE "AuctionType_new" USING ("type"::text::"AuctionType_new");
ALTER TYPE "AuctionType" RENAME TO "AuctionType_old";
ALTER TYPE "AuctionType_new" RENAME TO "AuctionType";
DROP TYPE "AuctionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "blockchain" TEXT NOT NULL DEFAULT 'ethereum',
ADD COLUMN     "buyNowPrice" DOUBLE PRECISION,
ADD COLUMN     "contractAddress" TEXT,
ADD COLUMN     "maxTickets" INTEGER,
ADD COLUMN     "ticketPrice" DOUBLE PRECISION,
ADD COLUMN     "tokenStandard" TEXT NOT NULL DEFAULT 'ERC721';

-- CreateTable
CREATE TABLE "lottery_tickets" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "tickets" INTEGER NOT NULL DEFAULT 1,
    "txHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lottery_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposit_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionHash" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETH',
    "status" "DepositStatus" NOT NULL DEFAULT 'pending',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "deposit_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lottery_tickets_auctionId_buyerId_key" ON "lottery_tickets"("auctionId", "buyerId");

-- CreateIndex
CREATE UNIQUE INDEX "deposit_requests_transactionHash_key" ON "deposit_requests"("transactionHash");

-- AddForeignKey
ALTER TABLE "lottery_tickets" ADD CONSTRAINT "lottery_tickets_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lottery_tickets" ADD CONSTRAINT "lottery_tickets_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_requests" ADD CONSTRAINT "deposit_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
