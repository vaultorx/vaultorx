-- CreateEnum
CREATE TYPE "ExhibitionStatus" AS ENUM ('draft', 'upcoming', 'active', 'ended', 'cancelled');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('virtual', 'physical', 'hybrid');

-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "exhibitionId" TEXT;

-- AlterTable
ALTER TABLE "nft_items" ADD COLUMN     "exhibitionId" TEXT;

-- CreateTable
CREATE TABLE "exhibitions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "bannerImage" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "ExhibitionStatus" NOT NULL DEFAULT 'upcoming',
    "category" TEXT,
    "tags" TEXT[],
    "locationType" "LocationType" NOT NULL DEFAULT 'virtual',
    "venueName" TEXT,
    "venueAddress" TEXT,
    "virtualUrl" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exhibitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exhibition_collections" (
    "id" TEXT NOT NULL,
    "exhibitionId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "exhibition_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exhibition_nfts" (
    "id" TEXT NOT NULL,
    "exhibitionId" TEXT NOT NULL,
    "nftItemId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "exhibition_nfts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exhibition_collections_exhibitionId_collectionId_key" ON "exhibition_collections"("exhibitionId", "collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "exhibition_nfts_exhibitionId_nftItemId_key" ON "exhibition_nfts"("exhibitionId", "nftItemId");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "exhibitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_items" ADD CONSTRAINT "nft_items_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "exhibitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibitions" ADD CONSTRAINT "exhibitions_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_collections" ADD CONSTRAINT "exhibition_collections_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "exhibitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_collections" ADD CONSTRAINT "exhibition_collections_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_nfts" ADD CONSTRAINT "exhibition_nfts_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "exhibitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_nfts" ADD CONSTRAINT "exhibition_nfts_nftItemId_fkey" FOREIGN KEY ("nftItemId") REFERENCES "nft_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
