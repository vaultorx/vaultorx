"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, TrendingUp, TrendingDown } from "lucide-react"

interface NFTPurchaseCardProps {
  price: number
  currency: string
  floorPrice?: number
  isListed: boolean
  ownerAddress: string
}

export function NFTPurchaseCard({ price, currency, floorPrice, isListed, ownerAddress }: NFTPurchaseCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBuyNow = async () => {
    setIsProcessing(true)
    // Implement escrow purchase logic
    setTimeout(() => setIsProcessing(false), 2000)
  }

  const priceChange = floorPrice ? ((price - floorPrice) / floorPrice) * 100 : 0

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {price} {currency}
              </span>
              {priceChange !== 0 && (
                <Badge variant={priceChange > 0 ? "destructive" : "default"} className="gap-1">
                  {priceChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(priceChange).toFixed(1)}%
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">≈ ${(price * 2500).toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isListed ? (
          <>
            <Button className="w-full" size="lg" onClick={handleBuyNow} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Buy Now"}
            </Button>
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              Make Offer
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <Badge variant="secondary">Not Listed</Badge>
            <p className="text-sm text-muted-foreground mt-2">This item is not currently for sale</p>
          </div>
        )}

        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Floor Price</span>
            <span className="font-medium">
              {floorPrice} {currency}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Best Offer</span>
            <span className="font-medium">
              {(price * 0.8).toFixed(2)} {currency}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Owner</span>
            <span className="font-mono text-xs">
              {ownerAddress.slice(0, 6)}...{ownerAddress.slice(-4)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>Sale ends in 7 days</span>
      </CardFooter>
    </Card>
  )
}
