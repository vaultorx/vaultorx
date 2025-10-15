"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { Transaction } from "@/lib/types"

interface NFTDetailsTabsProps {
  description?: string
  attributes?: Record<string, any>
  contractAddress: string
  tokenId: string
  blockchain: string
  ipfsUri: string
  creatorEarnings: number
  transactions?: Transaction[]
}

export function NFTDetailsTabs({
  description,
  attributes,
  contractAddress,
  tokenId,
  blockchain,
  ipfsUri,
  creatorEarnings,
  transactions = [],
}: NFTDetailsTabsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
        <TabsTrigger
          value="details"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          Details
        </TabsTrigger>
        <TabsTrigger
          value="attributes"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          Attributes
        </TabsTrigger>
        <TabsTrigger
          value="history"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          Transaction History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="mt-6 space-y-6">
        {description && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Contract Address</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(contractAddress, "contract")}
                  >
                    {copiedField === "contract" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                    <a
                      href={`https://etherscan.io/address/${contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Token ID</span>
                <span className="font-mono text-sm">{tokenId}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Blockchain</span>
                <Badge variant="secondary">{blockchain}</Badge>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Token Standard</span>
                <span className="text-sm">ERC-721</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Creator Earnings</span>
                <span className="text-sm">{creatorEarnings}%</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Metadata</span>
                <Button variant="ghost" size="sm" className="h-6 gap-1" asChild>
                  <a href={ipfsUri} target="_blank" rel="noopener noreferrer">
                    <span className="text-xs">View on IPFS</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="attributes" className="mt-6">
        <Card>
          <CardContent className="pt-6">
            {attributes && Object.keys(attributes).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key} className="border border-border rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase mb-1">{key}</p>
                    <p className="font-semibold">{String(value)}</p>
                    <p className="text-xs text-muted-foreground mt-1">12% have this trait</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No attributes available</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{tx.transactionType}</Badge>
                      <div>
                        <p className="text-sm font-medium">{tx.price ? `${tx.price} ${tx.currency}` : "Transfer"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`https://etherscan.io/tx/${tx.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transaction history available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
