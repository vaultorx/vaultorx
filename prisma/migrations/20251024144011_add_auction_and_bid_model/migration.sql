-- CreateEnum
CREATE TYPE "AuctionType" AS ENUM ('english', 'dutch', 'vickrey');

-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('live', 'upcoming', 'ended', 'cancelled');

-- CreateTable
CREATE TABLE "auctions" (
    "id" TEXT NOT NULL,
    "nftItemId" TEXT NOT NULL,
    "type" "AuctionType" NOT NULL,
    "status" "AuctionStatus" NOT NULL DEFAULT 'upcoming',
    "startingPrice" DOUBLE PRECISION,
    "reservePrice" DOUBLE PRECISION,
    "minimumBid" DOUBLE PRECISION,
    "bidIncrement" DOUBLE PRECISION,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "bidders" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bids" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "bidderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_nftItemId_fkey" FOREIGN KEY ("nftItemId") REFERENCES "nft_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
