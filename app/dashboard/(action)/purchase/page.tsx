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
  Gavel,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface NFTData {
  id: string;
  name: string;
  description?: string;
  image: string;
  collection: {
    name: string;
    verified: boolean;
  };
  owner: {
    username: string;
  };
  isListed: boolean;
  listPrice?: number;
  currency: string;
  rarity?: string;
  auctions?: Array<{
    id: string;
    type: string;
    status: string;
    startingPrice: number;
    minimumBid: number;
  }>;
}

interface PurchaseSession {
  id: string;
  status: string;
  amount: number;
  currency: string;
  expiresAt: string;
  nftItem: {
    id: string;
    name: string;
    image: string;
    collection: {
      name: string;
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

  const platformWallet = userWallet || "";

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      const nftParam = searchParams.get("nft");
      if (nftParam) {
        router.push(
          `/login?redirect=/dashboard/purchase&nft=${encodeURIComponent(
            nftParam
          )}`
        );
      } else {
        router.push("/login");
      }
      return;
    }

    initializePurchase();
  }, [status, searchParams, router]);

  const initializePurchase = async () => {
    try {
      setLoading(true);
      const nftParam = searchParams.get("nft");

      if (!nftParam) {
        throw new Error("No NFT data provided");
      }

      const decodedNft = JSON.parse(decodeURIComponent(nftParam));
      setNftData(decodedNft);

      console.log("Initializing purchase for NFT:", decodedNft.id);

      // Create purchase session
      const response = await fetch("/api/purchase-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nftItemId: decodedNft.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPurchaseSession(result.data);
        const expiresAt = new Date(result.data.expiresAt).getTime();
        setTimeLeft(Math.max(0, expiresAt - Date.now()));
        toast.success("Purchase session created");
      } else {
        throw new Error(result.error || "Failed to create purchase session");
      }
    } catch (error: any) {
      console.error("Purchase initialization error:", error);
      toast.error(error.message || "Failed to initialize purchase");
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

    if (!transactionHash.startsWith("0x") || transactionHash.length !== 66) {
      toast.error("Please enter a valid transaction hash (0x...)");
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
    } catch (error: any) {
      console.error("Transaction submission error:", error);
      toast.error(error.message || "Failed to submit transaction");
    } finally {
      setProcessing(false);
    }
  };

  // Determine purchase type and price
  const getPurchaseDetails = () => {
    if (!nftData) return null;

    const hasAuction = nftData.auctions && nftData.auctions.length > 0;
    const isDirectSale = nftData.isListed && nftData.listPrice;

    let purchaseType = "";
    let purchasePrice = 0;

    if (isDirectSale) {
      purchaseType = "Direct Sale";
      purchasePrice = nftData.listPrice!;
    } else if (hasAuction) {
      purchaseType = "Auction Buy Now";
      purchasePrice = nftData.auctions![0].startingPrice;
    }

    const platformFee = purchasePrice * 0.025;
    const totalAmount = purchasePrice + platformFee;

    return {
      purchaseType,
      purchasePrice,
      platformFee,
      totalAmount,
      hasAuction,
      isDirectSale,
    };
  };

  const purchaseDetails = getPurchaseDetails();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 px-4 sm:px-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing purchase...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!nftData || !purchaseSession || !purchaseDetails) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 px-4 sm:px-10 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Purchase Not Available
            </h3>
            <p className="text-gray-600 mb-6">
              {!nftData
                ? "The NFT data could not be loaded."
                : "This NFT is not available for purchase at the moment."}
            </p>
            <Button onClick={() => router.push("/marketplace")}>
              Browse Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
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
              className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <p className="text-amber-800 font-semibold">
                    Complete your purchase within {formatTime(timeLeft)}
                  </p>
                  <p className="text-amber-700 text-sm">
                    Your purchase session will expire after 30 minutes
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-amber-800 bg-amber-100 border-amber-300"
                >
                  {formatTime(timeLeft)}
                </Badge>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* NFT Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>NFT Preview</CardTitle>
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
                    <h2 className="text-2xl font-bold text-gray-900">
                      {nftData.name}
                    </h2>
                    <p className="text-gray-600">{nftData.collection.name}</p>
                    {nftData.collection.verified && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700"
                      >
                        Verified
                      </Badge>
                    )}
                    {purchaseDetails.hasAuction && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 flex items-center gap-1 w-fit"
                      >
                        <Gavel className="h-3 w-3" />
                        Auction
                      </Badge>
                    )}
                    <p className="text-sm text-gray-500">
                      Owned by {nftData.owner.username}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Wallet Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Platform Wallet
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Send payment to this secure platform wallet address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <code className="text-sm text-gray-900 font-mono flex-1 truncate">
                        {platformWallet || "Loading wallet address..."}
                      </code>
                      {platformWallet && (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(platformWallet)}
                            className="h-8 w-8 p-0 hover:bg-gray-200"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="h-3 w-3 text-green-600" />
                      <span>Verified platform wallet • Secure escrow</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Purchase</CardTitle>
                <CardDescription className="text-gray-600">
                  {purchaseDetails.purchaseType} • Send payment and confirm your
                  transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Summary */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Item Price</span>
                    <span className="text-gray-900 font-semibold">
                      {purchaseDetails.purchasePrice} {nftData.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Platform Fee (2.5%)</span>
                    <span className="text-gray-900 font-semibold">
                      {purchaseDetails.platformFee.toFixed(4)}{" "}
                      {nftData.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-300 pt-3">
                    <span className="text-gray-900 font-bold">
                      Total Amount
                    </span>
                    <span className="text-gray-900 font-bold text-lg">
                      {purchaseDetails.totalAmount.toFixed(4)}{" "}
                      {nftData.currency}
                    </span>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Wallet className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold mb-2">
                        Send exactly {purchaseDetails.totalAmount.toFixed(4)}{" "}
                        {nftData.currency} to the platform wallet
                      </p>
                      <p className="text-gray-600 text-sm">
                        Use the wallet address shown above. Make sure to send
                        the exact amount.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-amber-800 text-sm font-medium mb-1">
                        Important Payment Instructions
                      </p>
                      <ul className="text-amber-700 text-sm space-y-1">
                        <li>• Include the transaction hash after payment</li>
                        <li>• Do not send from exchanges</li>
                        <li>• Use only compatible wallets</li>
                        <li>• Double-check the wallet address</li>
                        <li>• Transaction must be confirmed on blockchain</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Transaction Hash Input */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-900">
                    Transaction Hash
                  </label>
                  <Input
                    placeholder="Enter your transaction hash (0x...)"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Paste the transaction hash from your wallet after sending
                    the payment
                  </p>
                </div>

                {/* Security Features */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Secure escrow protection</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Admin verified</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleTransactionSubmit}
                  disabled={
                    processing ||
                    !transactionHash.trim() ||
                    timeLeft <= 0 ||
                    !platformWallet
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 py-6 text-lg"
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
                <p className="text-xs text-gray-500 text-center">
                  By completing this purchase, you agree to our Terms of
                  Service. The NFT will be transferred to your wallet after
                  admin confirmation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
