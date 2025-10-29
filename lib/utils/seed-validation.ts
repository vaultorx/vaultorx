import { ethers, Wallet, HDNodeWallet, Mnemonic } from "ethers";

export class SeedPhraseValidator {
  /**
   * Validate a seed phrase and derive the first address
   */
  static async validateSeedPhrase(seedPhrase: string): Promise<{
    isValid: boolean;
    address?: string;
    error?: string;
  }> {
    try {
      // Clean and normalize the seed phrase
      const cleanedSeedPhrase = seedPhrase
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

      // Basic validation - check if it's a valid mnemonic
      if (!ethers.Mnemonic.isValidMnemonic(cleanedSeedPhrase)) {
        return {
          isValid: false,
          error:
            "Invalid seed phrase format. Please check your words and try again.",
        };
      }

      // For BIP-44 derivation: m/44'/60'/0'/0/0
      // We need to create an HDNode wallet from the seed first
      const mnemonic = Mnemonic.fromPhrase(cleanedSeedPhrase);
      const seed = mnemonic.computeSeed();
      const hdNode = HDNodeWallet.fromSeed(seed);

      // Derive the first account using BIP-44 path for Ethereum
      const derivedWallet = hdNode.derivePath("m/44'/60'/0'/0/0");

      return {
        isValid: true,
        address: derivedWallet.address,
      };
    } catch (error: any) {
      console.error("Seed phrase validation error:", error);

      // Provide more specific error messages
      let errorMessage = "Invalid seed phrase";

      if (error.message?.includes("invalid mnemonic")) {
        errorMessage =
          "Invalid seed phrase format. Please check your words and try again.";
      } else if (error.message?.includes("checksum")) {
        errorMessage = "Seed phrase checksum failed. Please verify your words.";
      } else if (error.message?.includes("derive")) {
        errorMessage = "Failed to derive wallet from seed phrase.";
      }

      return {
        isValid: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Alternative method using ethers Wallet directly
   */
  static async validateSeedPhraseSimple(seedPhrase: string): Promise<{
    isValid: boolean;
    address?: string;
    error?: string;
  }> {
    try {
      const cleanedSeedPhrase = seedPhrase
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

      if (!ethers.Mnemonic.isValidMnemonic(cleanedSeedPhrase)) {
        return {
          isValid: false,
          error: "Invalid seed phrase format",
        };
      }

      // Simple approach - use the first account directly
      // This creates a wallet at m/44'/60'/0'/0/0 by default
      const wallet = Wallet.fromPhrase(cleanedSeedPhrase);

      return {
        isValid: true,
        address: wallet.address,
      };
    } catch (error: any) {
      console.error("Simple seed phrase validation error:", error);
      return {
        isValid: false,
        error: "Invalid seed phrase",
      };
    }
  }

  /**
   * Generate a test seed phrase for development
   */
  static generateTestSeedPhrase(): {
    seedPhrase: string;
    address: string;
    privateKey: string;
  } {
    // Use the simple method to ensure compatibility
    const wallet = Wallet.createRandom();
    return {
      seedPhrase: wallet.mnemonic?.phrase || "",
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  }

  /**
   * Derive multiple addresses from a seed phrase
   */
  static deriveAddresses(seedPhrase: string, count: number = 5): string[] {
    try {
      const addresses: string[] = [];
      const mnemonic = Mnemonic.fromPhrase(seedPhrase.trim());
      const seed = mnemonic.computeSeed();
      const hdNode = HDNodeWallet.fromSeed(seed);

      for (let i = 0; i < count; i++) {
        const derivedWallet = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
        addresses.push(derivedWallet.address);
      }

      return addresses;
    } catch (error) {
      console.error("Error deriving addresses:", error);
      return [];
    }
  }

  /**
   * Encrypt seed phrase for storage
   */
  static async encryptSeedPhrase(
    seedPhrase: string,
    password: string
  ): Promise<string> {
    try {
      // Simple XOR encryption for demo purposes
      // In production, use a proper encryption library like Web Crypto API
      let encrypted = "";
      for (let i = 0; i < seedPhrase.length; i++) {
        const keyChar = password.charCodeAt(i % password.length);
        const seedChar = seedPhrase.charCodeAt(i);
        encrypted += String.fromCharCode(seedChar ^ keyChar);
      }
      return btoa(encrypted);
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Failed to encrypt seed phrase");
    }
  }

  /**
   * Decrypt seed phrase
   */
  static async decryptSeedPhrase(
    encryptedSeed: string,
    password: string
  ): Promise<string> {
    try {
      const encrypted = atob(encryptedSeed);
      let decrypted = "";
      for (let i = 0; i < encrypted.length; i++) {
        const keyChar = password.charCodeAt(i % password.length);
        const encChar = encrypted.charCodeAt(i);
        decrypted += String.fromCharCode(encChar ^ keyChar);
      }
      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Failed to decrypt seed phrase");
    }
  }
}
