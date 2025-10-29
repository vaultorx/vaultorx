import { SeedPhraseValidator } from "@/lib/utils/seed-validation";

function generateTestSeeds(count: number = 5) {
  console.log("=== Generating Test Seed Phrases ===\n");

  for (let i = 0; i < count; i++) {
    const testWallet = SeedPhraseValidator.generateTestSeedPhrase();

    console.log(`Wallet ${i + 1}:`);
    console.log(`Seed Phrase: ${testWallet.seedPhrase}`);
    console.log(`Address: ${testWallet.address}`);
    console.log(`Private Key: ${testWallet.privateKey}`);
    console.log("---");
  }

  console.log("\n=== Security Notice ===");
  console.log("These are TEST seed phrases for development only.");
  console.log("NEVER use these in production or with real funds.");
  console.log("NEVER commit real seed phrases to version control.");
}

// Run if this file is executed directly
if (require.main === module) {
  generateTestSeeds(5);
}

export { generateTestSeeds };
