import { apiClient } from "@/lib/api-client";
import { WhitelistedAddress, ApiResponse, NFTItem } from "@/lib/types";

export interface DepositData {
  selectedNetwork: string;
  nftContractAddress: string;
  tokenId: string;
}

export interface WithdrawalData {
  selectedNFT: string;
  destinationNetwork: string;
  destinationAddress: string;
  verificationCode: string;
  useWhitelisted: boolean;
}

export interface WhitelistAddressData {
  address: string;
  label: string;
  lockUntil?: string;
}

export interface VerificationResult {
  valid: boolean;
  nftName?: string;
  collection?: string;
  image?: string;
  owner?: string;
}

export class WalletService {
  // Deposit NFT
  async depositNFT(data: DepositData): Promise<
    ApiResponse<{
      transaction: any;
      nft: NFTItem;
    }>
  > {
    return apiClient.post<{
      transaction: any;
      nft: NFTItem;
    }>("/wallet/deposit-nft", data);
  }

  // Withdraw NFT
  async withdrawNFT(data: WithdrawalData): Promise<
    ApiResponse<{
      transaction: any;
      withdrawalRequest: any;
      fee: number;
    }>
  > {
    return apiClient.post<{
      transaction: any;
      withdrawalRequest: any;
      fee: number;
    }>("/wallet/withdraw-nft", data);
  }

  // Verify NFT for deposit
  async verifyNFT(data: {
    contractAddress: string;
    tokenId: string;
    network: string;
  }): Promise<ApiResponse<VerificationResult>> {
    return apiClient.post<VerificationResult>("/wallet/verify-nft", data);
  }

  // Send verification code
  async sendVerificationCode(
    email: string
  ): Promise<ApiResponse<{ sent: boolean }>> {
    return apiClient.post<{ sent: boolean }>("/wallet/send-verification-code", {
      email,
    });
  }

  // Get user's NFTs for withdrawal selection
  async getUserNFTs(): Promise<ApiResponse<NFTItem[]>> {
    return apiClient.get<NFTItem[]>("/wallet/user-nfts");
  }

  // Get whitelisted addresses
  async getWhitelistedAddresses(): Promise<ApiResponse<WhitelistedAddress[]>> {
    return apiClient.get<WhitelistedAddress[]>("/wallet/whitelist");
  }

  // Add whitelisted address
  async addWhitelistedAddress(
    data: WhitelistAddressData
  ): Promise<ApiResponse<WhitelistedAddress>> {
    return apiClient.post<WhitelistedAddress>("/wallet/whitelist", data);
  }

  // Remove whitelisted address
  async removeWhitelistedAddress(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/wallet/whitelist/${id}`);
  }

  // Get withdrawal fee estimate
  async getWithdrawalFee(
    network: string
  ): Promise<ApiResponse<{ fee: number }>> {
    return apiClient.get<{ fee: number }>("/wallet/withdrawal-fee", {
      network,
    });
  }
}

export const walletService = new WalletService();
