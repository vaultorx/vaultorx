"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { SUPPORTED_BLOCKCHAINS, WITHDRAWAL_FEES } from "@/lib/constants";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Shield,
  Wallet,
  Key,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { SeedPhraseConfiguration } from "@/components/seed-phrase-configuration";

interface UserWallet {
  walletBalance: number;
  assignedWallet?: string;
}

export default function WithdrawPage() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [destinationNetwork, setDestinationNetwork] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [withdrawalFee, setWithdrawalFee] = useState("0.005");
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawalComplete, setWithdrawalComplete] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const [userWallet, setUserWallet] = useState<UserWallet>({
    walletBalance: 0,
    assignedWallet: "",
  });

  const [seedPhraseConfigured, setSeedPhraseConfigured] = useState(false);
  const [showSeedPhraseDialog, setShowSeedPhraseDialog] = useState(false);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingSetup, setCheckingSetup] = useState(true);

  // Check if user has setup external wallet on component mount
  useEffect(() => {
    checkRequirements();
  }, []);

  const checkRequirements = async () => {
    try {
      setCheckingSetup(true);
      const [walletResponse, seedPhraseResponse] = await Promise.all([
        fetch("/api/user/wallet"),
        fetch("/api/user/seed-phrase"),
      ]);

      if (walletResponse.ok) {
        const walletData = await walletResponse.json();
        if (walletData.success) {
          setUserWallet(walletData.data);
        }
      }

      if (seedPhraseResponse.ok) {
        const seedPhraseData = await seedPhraseResponse.json();
        if (seedPhraseData.success) {
          setSeedPhraseConfigured(seedPhraseData.data.configured);

          // If seed phrase is not configured, show setup dialog immediately
          if (!seedPhraseData.data.configured) {
            setShowSetupDialog(true);
          }
        }
      }
    } catch (error) {
      console.error("Failed to check requirements:", error);
    } finally {
      setLoading(false);
      setCheckingSetup(false);
    }
  };

  const checkSeedPhraseConfiguration = async () => {
    try {
      const response = await fetch("/api/user/seed-phrase");
      const result = await response.json();

      if (result.success) {
        setSeedPhraseConfigured(result.data.configured);
        return result.data.configured;
      }
      return false;
    } catch (error) {
      console.error("Failed to check seed phrase configuration:", error);
      return false;
    }
  };

  useEffect(() => {
    // Calculate withdrawal fee based on network and amount
    if (destinationNetwork && amount) {
      const numericAmount = parseFloat(amount);
      const baseFee = WITHDRAWAL_FEES.ethereum || "0.005";

      // You can implement more complex fee calculation here
      // For now, using base fee + percentage of amount
      const calculatedFee = (
        parseFloat(baseFee) +
        numericAmount * 0.001
      ).toFixed(6);
      setWithdrawalFee(calculatedFee);
    }
  }, [destinationNetwork, amount]);

  const handleSendCode = async () => {
    if (!session?.user?.email) return;

    try {
      // Call your verification code API
      const response = await fetch("/api/user/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email, type: "withdrawal" }),
      });

      if (response.ok) {
        setCodeSent(true);
      } else {
        throw new Error("Failed to send verification code");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
    }
  };

  const handleWithdraw = async () => {
    if (
      !amount ||
      !destinationNetwork ||
      !destinationAddress ||
      !verificationCode
    ) {
      return;
    }

    // Double-check seed phrase configuration before proceeding
    const isConfigured = await checkSeedPhraseConfiguration();

    if (!isConfigured) {
      setShowSeedPhraseDialog(true);
      return;
    }

    // Validate amount
    const numericAmount = parseFloat(amount);
    const numericFee = parseFloat(withdrawalFee);
    const totalAmount = numericAmount + numericFee;

    if (totalAmount > userWallet.walletBalance) {
      alert("Insufficient balance including withdrawal fee");
      return;
    }

    if (numericAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: numericAmount,
          currency,
          destinationNetwork,
          destinationAddress,
          verificationCode,
          withdrawalFee: numericFee,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setWithdrawalComplete(true);
        // Update local wallet balance
        setUserWallet((prev) => ({
          ...prev,
          walletBalance: prev.walletBalance - totalAmount,
        }));
      } else {
        throw new Error(result.error || "Failed to process withdrawal");
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to process withdrawal"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getMaxAmount = () => {
    const numericFee = parseFloat(withdrawalFee);
    const maxAmount = Math.max(0, userWallet.walletBalance - numericFee);
    return maxAmount.toFixed(6);
  };

  const setMaxAmount = () => {
    setAmount(getMaxAmount());
  };

  const handleSeedPhraseConfigured = () => {
    setSeedPhraseConfigured(true);
    setShowSetupDialog(false);
    setShowSeedPhraseDialog(false);
  };

  // Show loading state
  if (loading || checkingSetup) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mr-2" />
                  <span>Checking withdrawal requirements...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show setup required state
  if (!seedPhraseConfigured && showSetupDialog) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Button variant="ghost" className="mb-6 gap-2" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                  <Key className="h-8 w-8 text-yellow-500" />
                </div>
                <CardTitle>External Wallet Setup Required</CardTitle>
                <CardDescription>
                  You need to configure your external wallet before making
                  withdrawals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    For security reasons, you must configure your external
                    wallet seed phrase to enable fund withdrawals. This ensures
                    you have full control over your funds.
                  </AlertDescription>
                </Alert>

                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">Why this is required:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Secure fund transfers to your external wallets</li>
                    <li>• Full control over your withdrawal destinations</li>
                    <li>• Enhanced security for your assets</li>
                    <li>• One-time setup for all future withdrawals</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  {/* <Button
                    onClick={() => setShowSetupDialog(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Maybe Later
                  </Button> */}
                  <Button
                    onClick={() => {
                      // setShowSetupDialog(false);
                      window.location.href = "/dashboard/settings?tab=wallet-security";
                    }}
                    className="w-full"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Configure External Wallet Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (withdrawalComplete) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 pt-24 sm:px-10 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Withdrawal Initiated!
                  </h2>
                  <p className="text-muted-foreground">
                    Your funds withdrawal is being processed. This may take a
                    few minutes.
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4 mb-6 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">
                        {amount} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination</span>
                      <span className="font-mono text-xs">
                        {destinationAddress.slice(0, 10)}...
                        {destinationAddress.slice(-8)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network</span>
                      <span className="font-medium">{destinationNetwork}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fee</span>
                      <span className="font-medium">
                        {withdrawalFee} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge>Processing</Badge>
                    </div>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Seed Phrase Required Dialog */}
      <Dialog
        open={showSeedPhraseDialog}
        onOpenChange={setShowSeedPhraseDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>External Wallet Required</DialogTitle>
            <DialogDescription>
              You need to configure your external wallet seed phrase before
              making withdrawals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please configure your seed phrase to enable fund withdrawals.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSeedPhraseDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowSeedPhraseDialog(false);
                  window.location.href =
                    "/dashboard/settings?tab=wallet-security";
                }}
                className="flex-1"
              >
                Configure Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Setup</DialogTitle>
            <DialogDescription>
              Set up your external wallet to enable withdrawals
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <SeedPhraseConfiguration
              onConfigured={handleSeedPhraseConfigured}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" className="mb-6 gap-2" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Withdraw Funds</CardTitle>
                  <CardDescription>
                    Transfer funds from your platform wallet to an external
                    wallet
                  </CardDescription>
                </div>
                {seedPhraseConfigured && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Wallet Configured
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wallet Balance */}
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Available Balance
                    </p>
                    <p className="text-2xl font-bold">
                      {userWallet.walletBalance?.toFixed(6) || "0.000000"} ETH
                    </p>
                  </div>
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
              </div>

              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Enabled:</strong> This withdrawal requires
                  email verification and external wallet configuration to
                  protect your funds.
                </AlertDescription>
              </Alert>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount to Withdraw <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    step="0.000001"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    max={userWallet.walletBalance}
                  />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">ETH</SelectItem>
                      {/* <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Available: {userWallet.walletBalance?.toFixed(6) || 0} ETH
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={setMaxAmount}
                    className="h-6 text-xs"
                  >
                    Max
                  </Button>
                </div>
              </div>

              {/* Destination Network */}
              <div className="space-y-2">
                <Label htmlFor="dest-network">
                  Destination Network{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={destinationNetwork}
                  onValueChange={setDestinationNetwork}
                >
                  <SelectTrigger id="dest-network">
                    <SelectValue placeholder="Select destination blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_BLOCKCHAINS.map((blockchain) => (
                      <SelectItem key={blockchain.id} value={blockchain.id}>
                        {blockchain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destination Address */}
              <div className="space-y-2">
                <Label htmlFor="dest-address">
                  Destination Address{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dest-address"
                  placeholder="0x..."
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the wallet address where you want to receive your funds
                </p>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Double-check the destination address. Sending to an incorrect
                  address will result in permanent loss of your funds.
                </AlertDescription>
              </Alert>

              {/* Withdrawal Fee & Summary */}
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    {parseFloat(amount) || 0} {currency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Withdrawal Fee
                  </span>
                  <span className="font-medium">
                    {parseFloat(withdrawalFee) || 0} {currency}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">Total Deducted</span>
                  <span className="font-medium text-destructive">
                    {(
                      (parseFloat(amount) || 0) + parseFloat(withdrawalFee)
                    ).toFixed(6) || 0}{" "}
                    {currency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Estimated Time
                  </span>
                  <span className="font-medium">2-15 minutes</span>
                </div>
              </div>

              {/* Email Verification */}
              {amount && destinationNetwork && destinationAddress && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification">
                      Email Verification Code{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="verification"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                      />
                      <Button
                        variant="outline"
                        onClick={handleSendCode}
                        disabled={codeSent}
                        className="bg-transparent"
                      >
                        {codeSent ? "Code Sent" : "Send Code"}
                      </Button>
                    </div>
                    {codeSent && (
                      <p className="text-xs text-muted-foreground">
                        Verification code sent to your email. Check your inbox.
                      </p>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleWithdraw}
                    disabled={
                      !verificationCode ||
                      verificationCode.length !== 6 ||
                      isProcessing
                    }
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Withdrawal...
                      </>
                    ) : (
                      "Confirm Withdrawal"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
