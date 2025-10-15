"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { FileImage, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MintReviewStepProps {
  file: File | null
  preview: string | null
  name: string
  description: string
  attributes: Array<{ trait_type: string; value: string }>
  saleType: string
  price: string
  currency: string
  royalty: number
  isProcessing: boolean
  gasFee: string
  onMint: () => void
}

export function MintReviewStep({
  file,
  preview,
  name,
  description,
  attributes,
  saleType,
  price,
  currency,
  royalty,
  isProcessing,
  gasFee,
  onMint,
}: MintReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review & Mint</h2>
        <p className="text-muted-foreground">Review your NFT details before minting</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Preview */}
        <Card>
          <CardContent className="pt-6">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
              {preview ? (
                <Image
                  src={preview || "/placeholder.svg"}
                  alt={name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileImage className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1">{name || "Untitled"}</h3>
            {description && <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>}
          </CardContent>
        </Card>

        {/* Details */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold mb-3">NFT Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{name || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File</span>
                    <span className="font-medium">{file?.name || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attributes</span>
                    <span className="font-medium">{attributes.length}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Pricing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sale Type</span>
                    <Badge variant="secondary">
                      {saleType === "fixed" ? "Fixed Price" : saleType === "auction" ? "Auction" : "Not For Sale"}
                    </Badge>
                  </div>
                  {saleType !== "not-for-sale" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium">
                        {price} {currency}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creator Royalty</span>
                    <span className="font-medium">{royalty}%</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Gas Fees</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Gas</span>
                    <span className="font-medium">{gasFee} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network</span>
                    <span className="font-medium">Ethereum</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg" onClick={onMint} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              "Mint NFT"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By minting, you agree to our Terms of Service and confirm that you own the rights to this content.
          </p>
        </div>
      </div>
    </div>
  )
}
