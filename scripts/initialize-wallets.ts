import { WalletService } from "@/lib/services/wallet-service";

async function initialize() {
  await WalletService.initializeWallets();
  console.log("Wallets initialized successfully");
}

initialize().catch(console.error);
