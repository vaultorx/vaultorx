"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ShoppingCart,
  Shield,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Wallet,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface NFTData {
  id: string;
  name: string;
  price: number;
  image: string;
  collectionName: string;
  currency: string;
  owner?: string;
  description?: string;
  rarity?: string;
  attributes?: any;
}

interface PurchaseSession {
  id: string;
  status: string;
  amount: number;
  currency: string;
  expiresAt: string;
  transactionHash?: string;
  nftItem: {
    id: string;
    name: string;
    image: string;
    collection: {
      name: string;
      contractAddress: string;
    };
    owner: {
      username: string;
    };
  };
}

export default function PurchasePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [nftData, setNftData] = useState<NFTData | null>(null);
  const [purchaseSession, setPurchaseSession] =
    useState<PurchaseSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [transactionHash, setTransactionHash] = useState("");

  const [userWallet, setUserWallet] = useState("");

  // Fetch user's assigned wallet
  useEffect(() => {
    if (session?.user?.email) {
      fetchUserWallet();
    }
  }, [session]);

  const fetchUserWallet = async () => {
    try {
      const response = await fetch("/api/user/wallet");
      const result = await response.json();

      if (result.success && result.data.assignedWallet) {
        setUserWallet(result.data.assignedWallet);
      }
    } catch (error) {
      console.error("Failed to fetch user wallet:", error);
    }
  };

  // Replace the platformWallet constant with:
  const platformWallet =
    userWallet || "";

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      const nftParam = searchParams.get("nft");
      if (nftParam) {
        router.push(`/login?redirect=/dashboard/purchase&nft=${nftParam}`);
      } else {
        router.push("/login");
      }
      return;
    }

    initializePurchase();
  }, [status, searchParams]);

  const initializePurchase = async () => {
    try {
      const nftParam = searchParams.get("nft");

      if (!nftParam) {
        throw new Error("No NFT data provided");
      }

      const decodedNft = JSON.parse(decodeURIComponent(nftParam));
      setNftData(decodedNft);

      // Create or get purchase session
      const response = await fetch("/api/purchase-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nftItemId: decodedNft.id,
          amount: decodedNft.price,
          currency: decodedNft.currency,
          nftData: decodedNft,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPurchaseSession(result.data);
        const expiresAt = new Date(result.data.expiresAt).getTime();
        setTimeLeft(Math.max(0, expiresAt - Date.now()));
      } else {
        throw new Error(result.error || "Failed to create purchase session");
      }
    } catch (error) {
      console.error("Purchase initialization error:", error);
      toast.error("Failed to initialize purchase");
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!purchaseSession || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          handleSessionExpired();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [purchaseSession, timeLeft]);

  const handleSessionExpired = () => {
    toast.error("Purchase session expired. Please start over.");
    router.push("/marketplace");
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleTransactionSubmit = async () => {
    if (!transactionHash.trim()) {
      toast.error("Please enter a transaction hash");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/purchase-sessions/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: purchaseSession?.id,
          transactionHash: transactionHash.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          "Transaction submitted! Admin will process your purchase."
        );
        router.push("/dashboard?purchase=pending");
      } else {
        throw new Error(result.error || "Failed to submit transaction");
      }
    } catch (error) {
      console.error("Transaction submission error:", error);
      toast.error("Failed to submit transaction");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="pt-24 px-4 sm:px-10 min-h-screen flex items-center justify-center">
          <div>Initializing purchase...</div>
        </div>
      </div>
    );
  }

  if (!nftData || !purchaseSession) {
    return (
      <div className="min-h-screen">
        <div className="pt-24 px-4 sm:px-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Purchase Not Found</h3>
            <p className="text-slate-900 mb-4">
              The purchase session could not be initialized.
            </p>
            <Button onClick={() => router.push("/marketplace")}>
              Browse Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = nftData.price * 1.025; // Including 2.5% platform fee

  return (
    <div className="min-h-screen">
      <div className="pt-6 px-4 sm:px-10">
        <div className="container mx-auto py-8 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/marketplace")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Button>

          {/* Timer Alert */}
          {timeLeft > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-amber-500/10 border border-amber-500/80 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-amber-500 font-semibold">
                    Complete your purchase within {formatTime(timeLeft)}
                  </p>
                  <p className="text-amber-500/80 text-sm">
                    Your purchase session will expire after 30 minutes
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-amber-500 border-amber-500/90"
                >
                  {formatTime(timeLeft)}
                </Badge>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* NFT Preview */}
            <div className="space-y-6">
              <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/80">
                <CardHeader>
                  <CardTitle className="text-white">NFT Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square rounded-lg overflow-hidden mb-4">
                    <img
                      src={nftData.image}
                      alt={nftData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">
                      {nftData.name}
                    </h2>
                    <p className="text-slate-400">{nftData.collectionName}</p>
                    {nftData.rarity && (
                      <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                        {nftData.rarity}
                      </div>
                    )}
                    {nftData.owner && (
                      <p className="text-sm text-slate-400">
                        Owned by {nftData.owner}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Platform Wallet Card */}
              <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/80">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-400" />
                    Platform Wallet
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Send payment to this secure platform wallet address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <code className="text-sm text-white font-mono flex-1 truncate">
                        {platformWallet}
                      </code>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(platformWallet)}
                          className="h-8 w-8 p-0 hover:bg-slate-700/50"
                        >
                          <Copy className="h-3.5 w-3.5 text-white" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Shield className="h-3 w-3 text-green-400" />
                      <span>Verified platform wallet • Secure escrow</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Instructions */}
            {/* Payment Details Card */}
            <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/80">
              <CardHeader>
                <CardTitle className="text-white">Complete Purchase</CardTitle>
                <CardDescription className="text-slate-400">
                  Send payment and confirm your transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Summary */}
                <div className="space-y-3 p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Item Price</span>
                    <span className="text-white font-semibold">
                      {nftData.price} {nftData.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Platform Fee (2.5%)</span>
                    <span className="text-white font-semibold">
                      {(nftData.price * 0.025).toFixed(4)} {nftData.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-700 pt-3">
                    <span className="text-white font-bold">Total Amount</span>
                    <span className="text-white font-bold text-lg">
                      {totalAmount.toFixed(4)} {nftData.currency}
                    </span>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Wallet className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-white font-semibold mb-2">
                        Send exactly {totalAmount.toFixed(4)} {nftData.currency}{" "}
                        to the platform wallet
                      </p>
                      <p className="text-slate-400 text-sm">
                        Use the wallet address shown above. Make sure to send
                        the exact amount.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-amber-400 text-sm font-medium mb-1">
                        Important Payment Instructions
                      </p>
                      <ul className="text-amber-400/80 text-sm space-y-1">
                        <li>• Include the transaction hash after payment</li>
                        <li>• Do not send from exchanges</li>
                        <li>• Use only compatible wallets</li>
                        <li>• Double-check the wallet address</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Transaction Hash Input */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">
                    Transaction Hash
                  </label>
                  <Input
                    placeholder="Enter your transaction hash (0x...)"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-400">
                    Paste the transaction hash from your wallet after sending
                    the payment
                  </p>
                </div>

                {/* Security Features */}
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span>Secure escrow protection</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Admin verified</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleTransactionSubmit}
                  disabled={
                    processing || !transactionHash.trim() || timeLeft <= 0
                  }
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white gap-2 py-6 text-lg transition-colors duration-200"
                >
                  {processing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting Transaction...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Confirm Purchase
                    </>
                  )}
                </Button>

                {/* Terms */}
                <p className="text-xs text-slate-500 text-center">
                  By completing this purchase, you agree to our Terms of
                  Service. The NFT will be transferred to your wallet after
                  admin confirmation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
