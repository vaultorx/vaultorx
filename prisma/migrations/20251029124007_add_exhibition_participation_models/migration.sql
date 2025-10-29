-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');

-- CreateTable
CREATE TABLE "exhibition_participations" (
    "id" TEXT NOT NULL,
    "exhibitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ParticipationStatus" NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exhibition_participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exhibition_participation_nfts" (
    "id" TEXT NOT NULL,
    "participationId" TEXT NOT NULL,
    "nftItemId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "exhibition_participation_nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exhibition_participation_collections" (
    "id" TEXT NOT NULL,
    "participationId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "exhibition_participation_collections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exhibition_participations_exhibitionId_userId_key" ON "exhibition_participations"("exhibitionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "exhibition_participation_nfts_participationId_nftItemId_key" ON "exhibition_participation_nfts"("participationId", "nftItemId");

-- CreateIndex
CREATE UNIQUE INDEX "exhibition_participation_collections_participationId_collec_key" ON "exhibition_participation_collections"("participationId", "collectionId");

-- AddForeignKey
ALTER TABLE "exhibition_participations" ADD CONSTRAINT "exhibition_participations_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "exhibitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_participations" ADD CONSTRAINT "exhibition_participations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_participation_nfts" ADD CONSTRAINT "exhibition_participation_nfts_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "exhibition_participations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_participation_nfts" ADD CONSTRAINT "exhibition_participation_nfts_nftItemId_fkey" FOREIGN KEY ("nftItemId") REFERENCES "nft_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_participation_collections" ADD CONSTRAINT "exhibition_participation_collections_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "exhibition_participations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_participation_collections" ADD CONSTRAINT "exhibition_participation_collections_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
