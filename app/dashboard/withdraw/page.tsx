"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { SUPPORTED_BLOCKCHAINS } from "@/lib/constants"
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, Shield, Clock, Plus } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface WhitelistedAddress {
  id: string
  address: string
  label: string
  addedAt: Date
  lockUntil?: Date
}

export default function WithdrawPage() {
  const [selectedNFT, setSelectedNFT] = useState("")
  const [destinationNetwork, setDestinationNetwork] = useState("")
  const [destinationAddress, setDestinationAddress] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [withdrawalFee, setWithdrawalFee] = useState("0.005")
  const [isProcessing, setIsProcessing] = useState(false)
  const [withdrawalComplete, setWithdrawalComplete] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [useWhitelisted, setUseWhitelisted] = useState(false)
  const [twoFactorEnabled] = useState(true)

  // Mock whitelisted addresses
  const [whitelistedAddresses] = useState<WhitelistedAddress[]>([
    {
      id: "1",
      address: "0x1234567890abcdef1234567890abcdef12345678",
      label: "My Hardware Wallet",
      addedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: "2",
      address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      label: "Cold Storage",
      addedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      lockUntil: new Date(Date.now() + 12 * 60 * 60 * 1000), // Locked for 12 more hours
    },
  ])

  const handleSendCode = () => {
    setCodeSent(true)
    // Simulate sending verification code
  }

  const handleWithdraw = async () => {
    setIsProcessing(true)
    // Simulate withdrawal process
    setTimeout(() => {
      setIsProcessing(false)
      setWithdrawalComplete(true)
    }, 3000)
  }

  const isAddressLocked = (address: WhitelistedAddress) => {
    return address.lockUntil && address.lockUntil > new Date()
  }

  if (withdrawalComplete) {
    return (
      <div className="min-h-screen">
        <Header />
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
                    Your NFT withdrawal is being processed. This may take a few
                    minutes.
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4 mb-6 text-left">
                  <div className="space-y-2 text-sm">
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
                      <span className="font-medium">{withdrawalFee} ETH</span>
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
      <Header />

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
              <CardTitle>Withdraw NFT</CardTitle>
              <CardDescription>Transfer your NFT from Opuxvault to an external wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Enabled:</strong> This withdrawal requires email verification
                  {twoFactorEnabled && " and 2FA authentication"} to protect your assets.
                </AlertDescription>
              </Alert>

              {/* Select NFT */}
              <div className="space-y-2">
                <Label htmlFor="nft">
                  Select NFT to Withdraw <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedNFT} onValueChange={setSelectedNFT}>
                  <SelectTrigger id="nft">
                    <SelectValue placeholder="Choose an NFT from your collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nft-1">Ethereal Dreams #1234</SelectItem>
                    <SelectItem value="nft-2">Cosmic Vision #567</SelectItem>
                    <SelectItem value="nft-3">Digital Horizon #89</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Destination Network */}
              <div className="space-y-2">
                <Label htmlFor="dest-network">
                  Destination Network <span className="text-destructive">*</span>
                </Label>
                <Select value={destinationNetwork} onValueChange={setDestinationNetwork}>
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

              {/* Use Whitelisted Address */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-whitelist"
                  checked={useWhitelisted}
                  onCheckedChange={(checked) => setUseWhitelisted(checked as boolean)}
                />
                <Label htmlFor="use-whitelist" className="cursor-pointer">
                  Use whitelisted address
                </Label>
              </div>

              {/* Whitelisted Addresses */}
              {useWhitelisted && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Whitelisted Addresses</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Plus className="h-3 w-3" />
                          Add Address
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Whitelisted Address</DialogTitle>
                          <DialogDescription>
                            New addresses will be locked for 24 hours before they can be used for withdrawals.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label>Address Label</Label>
                            <Input placeholder="e.g. My Ledger Wallet" />
                          </div>
                          <div className="space-y-2">
                            <Label>Wallet Address</Label>
                            <Input placeholder="0x..." />
                          </div>
                          <Button className="w-full">Add to Whitelist</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    {whitelistedAddresses.map((addr) => {
                      const locked = isAddressLocked(addr)
                      return (
                        <button
                          key={addr.id}
                          onClick={() => !locked && setDestinationAddress(addr.address)}
                          disabled={locked}
                          className={`w-full p-4 border border-border rounded-lg text-left transition-colors ${
                            locked
                              ? "opacity-50 cursor-not-allowed"
                              : destinationAddress === addr.address
                                ? "bg-primary/10 border-primary"
                                : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium mb-1">{addr.label}</p>
                              <p className="text-xs font-mono text-muted-foreground truncate">{addr.address}</p>
                            </div>
                            {locked && (
                              <Badge variant="secondary" className="gap-1 flex-shrink-0">
                                <Clock className="h-3 w-3" />
                                Locked
                              </Badge>
                            )}
                          </div>
                          {locked && addr.lockUntil && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Available in {Math.ceil((addr.lockUntil.getTime() - Date.now()) / (1000 * 60 * 60))} hours
                            </p>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Manual Address Entry */}
              {!useWhitelisted && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="dest-address">
                      Destination Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="dest-address"
                      placeholder="0x..."
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the wallet address where you want to receive your NFT
                    </p>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Double-check the destination address. Sending to an incorrect address will result in permanent
                      loss of your NFT.
                    </AlertDescription>
                  </Alert>
                </>
              )}

              {/* Withdrawal Fee */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Withdrawal Fee</span>
                  <span className="font-medium">{withdrawalFee} ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estimated Time</span>
                  <span className="font-medium">2-5 minutes</span>
                </div>
              </div>

              {/* Email Verification */}
              {selectedNFT && destinationNetwork && destinationAddress && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification">
                      Email Verification Code <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="verification"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                      />
                      <Button variant="outline" onClick={handleSendCode} disabled={codeSent} className="bg-transparent">
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
                    disabled={!verificationCode || verificationCode.length !== 6 || isProcessing}
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
  )
}
