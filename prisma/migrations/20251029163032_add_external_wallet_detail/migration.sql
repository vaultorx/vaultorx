-- AlterTable
ALTER TABLE "users" ADD COLUMN     "externalWalletConfigured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "externalWalletSeed" TEXT,
ADD COLUMN     "seedPhraseConfiguredAt" TIMESTAMP(3);
