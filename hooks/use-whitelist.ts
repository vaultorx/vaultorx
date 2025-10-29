import { useState, useEffect } from "react";
import { walletService } from "@/services/wallet-service";
import { WhitelistedAddress } from "@/lib/types";

export function useWhitelist() {
  const [addresses, setAddresses] = useState<WhitelistedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletService.getWhitelistedAddresses();
      if (response.success) {
        setAddresses(response.data);
      } else {
        setError(response.message || "Failed to fetch addresses");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (data: { address: string; label: string }) => {
    try {
      setError(null);
      const response = await walletService.addWhitelistedAddress(data);
      if (response.success) {
        setAddresses((prev) => [...prev, response.data]);
        return response.data;
      } else {
        setError(response.message || "Failed to add address");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add address");
      return null;
    }
  };

  const removeAddress = async (id: string) => {
    try {
      setError(null);
      const response = await walletService.removeWhitelistedAddress(id);
      if (response.success) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        return true;
      } else {
        setError(response.message || "Failed to remove address");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove address");
      return false;
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return {
    addresses,
    loading,
    error,
    addAddress,
    removeAddress,
    refetch: fetchAddresses,
  };
}
