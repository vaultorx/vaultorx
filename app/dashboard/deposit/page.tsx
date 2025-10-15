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
import { SUPPORTED_BLOCKCHAINS } from "@/lib/constants"
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, Info } from "lucide-react"
import Link from "next/link"

export default function DepositPage() {
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const [nftContractAddress, setNftContractAddress] = useState("")
  const [tokenId, setTokenId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [depositComplete, setDepositComplete] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean
    nftName?: string
    collection?: string
  } | null>(null)

  const handleVerify = async () => {
    setIsVerifying(true)
    // Simulate NFT verification
    setTimeout(() => {
      setIsVerifying(false)
      setVerificationResult({
        valid: true,
        nftName: "Ethereal Dreams #1234",
        collection: "Ethereal Dreams Collection",
      })
    }, 2000)
  }

  const handleDeposit = async () => {
    setIsDepositing(true)
    // Simulate deposit process
    setTimeout(() => {
      setIsDepositing(false)
      setDepositComplete(true)
    }, 3000)
  }

  if (depositComplete) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-8 px-4 pt-24 sm:px-10">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Deposit Successful!</h2>
                  <p className="text-muted-foreground">Your NFT has been successfully deposited to Opuxvault</p>
                </div>

                <div className="bg-muted rounded-lg p-4 mb-6 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NFT</span>
                      <span className="font-medium">{verificationResult?.nftName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network</span>
                      <span className="font-medium">{selectedNetwork}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge>Confirmed</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent" asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setDepositComplete(false)
                      setVerificationResult(null)
                      setNftContractAddress("")
                      setTokenId("")
                      setSelectedNetwork("")
                    }}
                  >
                    Deposit Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
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
              <CardTitle>Deposit NFT</CardTitle>
              <CardDescription>Transfer your NFT from an external wallet to Opuxvault</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Network Warning */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Ensure you select the correct network. Sending NFTs from the wrong network
                  will result in permanent loss of your asset.
                </AlertDescription>
              </Alert>

              {/* Network Selection */}
              <div className="space-y-2">
                <Label htmlFor="network">
                  Origin Network <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                  <SelectTrigger id="network">
                    <SelectValue placeholder="Select the network your NFT is on" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_BLOCKCHAINS.map((blockchain) => (
                      <SelectItem key={blockchain.id} value={blockchain.id}>
                        {blockchain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the blockchain network where your NFT currently exists
                </p>
              </div>

              {/* Contract Address */}
              <div className="space-y-2">
                <Label htmlFor="contract">
                  NFT Contract Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contract"
                  placeholder="0x..."
                  value={nftContractAddress}
                  onChange={(e) => setNftContractAddress(e.target.value)}
                />
              </div>

              {/* Token ID */}
              <div className="space-y-2">
                <Label htmlFor="tokenId">
                  Token ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tokenId"
                  placeholder="e.g. 1234"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                />
              </div>

              {/* Verify Button */}
              {!verificationResult && (
                <Button
                  className="w-full"
                  onClick={handleVerify}
                  disabled={!selectedNetwork || !nftContractAddress || !tokenId || isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying NFT...
                    </>
                  ) : (
                    "Verify NFT"
                  )}
                </Button>
              )}

              {/* Verification Result */}
              {verificationResult && (
                <>
                  {verificationResult.valid ? (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <p className="font-medium">NFT Verified Successfully</p>
                          <p className="text-sm">
                            {verificationResult.nftName} from {verificationResult.collection}
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Unable to verify NFT. Please check the contract address and token ID.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Deposit Instructions */}
                  {verificationResult.valid && (
                    <>
                      <div className="bg-muted rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="text-sm space-y-2">
                            <p className="font-medium">Deposit Instructions:</p>
                            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                              <li>Click "Initiate Deposit" below</li>
                              <li>Approve the transaction in your wallet</li>
                              <li>Wait for blockchain confirmation (1-2 minutes)</li>
                              <li>Your NFT will appear in your Opuxvault dashboard</li>
                            </ol>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full" size="lg" onClick={handleDeposit} disabled={isDepositing}>
                        {isDepositing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Deposit...
                          </>
                        ) : (
                          "Initiate Deposit"
                        )}
                      </Button>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
