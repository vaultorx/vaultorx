"use client";

import { useState } from "react";
import { walletService } from "@/services/wallet-service";
import { NFTItem, WhitelistedAddress } from "@/lib/types";

export function useWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const depositNFT = async (data: {
    selectedNetwork: string;
    nftContractAddress: string;
    tokenId: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletService.depositNFT(data);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Deposit failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const withdrawNFT = async (data: {
    selectedNFT: string;
    destinationNetwork: string;
    destinationAddress: string;
    verificationCode: string;
    useWhitelisted: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletService.withdrawNFT(data);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Withdrawal failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyNFT = async (data: {
    contractAddress: string;
    tokenId: string;
    network: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletService.verifyNFT(data);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Verification failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationCode = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletService.sendVerificationCode(email);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send code";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    depositNFT,
    withdrawNFT,
    verifyNFT,
    sendVerificationCode,
    loading,
    error,
  };
}
