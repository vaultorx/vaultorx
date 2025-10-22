/*
  Warnings:

  - The `emailVerified` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('Common', 'Rare', 'Epic', 'Legendary');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('mint', 'sale', 'transfer', 'deposit', 'withdrawal', 'purchase');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'confirmed', 'failed', 'completed');

-- CreateEnum
CREATE TYPE "EscrowStatus" AS ENUM ('locked', 'released', 'refunded', 'disputed');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('pending', 'verified', 'processing', 'completed', 'failed');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "kycStatus" "KycStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "username" TEXT,
ADD COLUMN     "walletBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT,
    "description" TEXT,
    "creatorId" TEXT NOT NULL,
    "royaltyPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "floorPrice" DOUBLE PRECISION,
    "totalVolume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "listedItems" INTEGER NOT NULL DEFAULT 0,
    "blockchain" TEXT NOT NULL DEFAULT 'ethereum',
    "ipfsMetadataUri" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nft_items" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "ipfsMetadataUri" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "attributes" JSONB,
    "isListed" BOOLEAN NOT NULL DEFAULT false,
    "listPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'ETH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nft_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "nftItemId" TEXT NOT NULL,
    "fromUserId" TEXT,
    "toUserId" TEXT,
    "transactionType" "TransactionType" NOT NULL,
    "price" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'ETH',
    "gasFee" DOUBLE PRECISION,
    "platformFee" DOUBLE PRECISION,
    "royaltyFee" DOUBLE PRECISION,
    "blockchain" TEXT NOT NULL DEFAULT 'ethereum',
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "nftName" TEXT,
    "from" TEXT,
    "to" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escrow_transactions" (
    "id" TEXT NOT NULL,
    "nftItemId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "escrowContractAddress" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETH',
    "status" "EscrowStatus" NOT NULL DEFAULT 'locked',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "escrow_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawal_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nftItemId" TEXT NOT NULL,
    "destinationAddress" TEXT NOT NULL,
    "destinationNetwork" TEXT NOT NULL,
    "withdrawalFee" DOUBLE PRECISION,
    "verificationCode" TEXT,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "withdrawal_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whitelisted_addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockUntil" TIMESTAMP(3),

    CONSTRAINT "whitelisted_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collections_contractAddress_key" ON "collections"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "nft_items_collectionId_tokenId_key" ON "nft_items"("collectionId", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transactionHash_key" ON "transactions"("transactionHash");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_items" ADD CONSTRAINT "nft_items_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_items" ADD CONSTRAINT "nft_items_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_nftItemId_fkey" FOREIGN KEY ("nftItemId") REFERENCES "nft_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escrow_transactions" ADD CONSTRAINT "escrow_transactions_nftItemId_fkey" FOREIGN KEY ("nftItemId") REFERENCES "nft_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escrow_transactions" ADD CONSTRAINT "escrow_transactions_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escrow_transactions" ADD CONSTRAINT "escrow_transactions_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_nftItemId_fkey" FOREIGN KEY ("nftItemId") REFERENCES "nft_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whitelisted_addresses" ADD CONSTRAINT "whitelisted_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
