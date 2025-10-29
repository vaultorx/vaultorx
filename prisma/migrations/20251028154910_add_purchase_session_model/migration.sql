-- CreateEnum
CREATE TYPE "PurchaseSessionStatus" AS ENUM ('pending', 'processing', 'completed', 'expired', 'cancelled', 'failed');

-- CreateTable
CREATE TABLE "purchase_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nftItemId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETH',
    "status" "PurchaseSessionStatus" NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "transactionHash" TEXT,
    "adminNotified" BOOLEAN NOT NULL DEFAULT false,
    "nftData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_sessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "purchase_sessions" ADD CONSTRAINT "purchase_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_sessions" ADD CONSTRAINT "purchase_sessions_nftItemId_fkey" FOREIGN KEY ("nftItemId") REFERENCES "nft_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
