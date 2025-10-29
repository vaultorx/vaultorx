"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
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
import { Textarea } from "@/components/ui/textarea";
import { SUPPORTED_BLOCKCHAINS } from "@/lib/constants";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Info,
  ExternalLink,
  Copy,
} from "lucide-react";
import Link from "next/link";
// import toast from "sooner"

interface DepositRequest {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "approved" | "rejected" | "completed";
  transactionHash?: string;
  createdAt: string;
  approvedAt?: string;
}

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [transactionHash, setTransactionHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [depositComplete, setDepositComplete] = useState(false);
  const [currentDeposit, setCurrentDeposit] = useState<DepositRequest | null>(
    null
  );
  const [userWallet, setUserWallet] = useState("");

  useEffect(() => {
    fetchUserWallet();
  }, []);

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
  const platformWallet = userWallet || "";

  const handleSubmitDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0 || !transactionHash) {
      // toast({
      //   title: "Error",
      //   description: "Please fill all required fields",
      //   variant: "destructive",
      // });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          transactionHash,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentDeposit(data.data.depositRequest);
        setDepositComplete(true);
        // toast({
        //   title: "Deposit Submitted",
        //   description: "Your deposit is pending admin approval",
        // });
      } else {
        // toast({
        //   title: "Error",
        //   description: data.error || "Failed to submit deposit",
        //   variant: "destructive",
        // });
      }
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to submit deposit request",
      //   variant: "destructive",
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // toast({
    //   title: "Copied!",
    //   description: "Wallet address copied to clipboard",
    // });
  };

  if (depositComplete && currentDeposit) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto py-8 px-4 pt-24 sm:px-10">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Deposit Request Submitted!
                  </h2>
                  <p className="text-muted-foreground">
                    Your deposit is pending admin approval
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4 mb-6 text-left space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">
                        {currentDeposit.amount} {currentDeposit.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant={
                          currentDeposit.status === "pending"
                            ? "secondary"
                            : currentDeposit.status === "approved"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {currentDeposit.status.charAt(0).toUpperCase() +
                          currentDeposit.status.slice(1)}
                      </Badge>
                    </div>
                    {currentDeposit.transactionHash && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Transaction
                        </span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-background px-2 py-1 rounded">
                            {currentDeposit.transactionHash.slice(0, 10)}...
                            {currentDeposit.transactionHash.slice(-8)}
                          </code>
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={`https://etherscan.io/tx/${currentDeposit.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setDepositComplete(false);
                      setCurrentDeposit(null);
                      setAmount("");
                      setTransactionHash("");
                    }}
                  >
                    New Deposit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
            <CardHeader>
              <CardTitle>Deposit ETH</CardTitle>
              <CardDescription>
                Send ETH to the platform wallet and request approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Platform Wallet Address */}
              <div className="space-y-3">
                <Label>Platform Wallet Address</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={platformWallet}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(platformWallet)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Send ETH only to this address. Sending other tokens may result
                  in permanent loss.
                </p>
              </div>

              {/* Deposit Instructions */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Deposit Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Send ETH to the platform wallet address above</li>
                      <li>Wait for transaction confirmation</li>
                      <li>Fill out the form below with transaction details</li>
                      <li>Wait for admin approval (usually within 24 hours)</li>
                      <li>
                        Your wallet balance will be updated after approval
                      </li>
                    </ol>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    step="0.000001"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="space-y-2">
                <Label htmlFor="transactionHash">
                  Transaction Hash <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="transactionHash"
                  placeholder="0x..."
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the transaction hash from your wallet after sending ETH
                </p>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmitDeposit}
                disabled={isSubmitting || !amount || !transactionHash}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  "Submit Deposit Request"
                )}
              </Button>

              {/* Warning */}
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Only send ETH from networks we
                  support. Double-check the wallet address before sending.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
