"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { SUPPORTED_CURRENCIES } from "@/lib/constants"
import { Info } from "lucide-react"

interface MintPricingStepProps {
  saleType: "fixed" | "auction" | "not-for-sale"
  price: string
  currency: string
  royalty: number
  onSaleTypeChange: (type: "fixed" | "auction" | "not-for-sale") => void
  onPriceChange: (price: string) => void
  onCurrencyChange: (currency: string) => void
  onRoyaltyChange: (royalty: number) => void
}

export function MintPricingStep({
  saleType,
  price,
  currency,
  royalty,
  onSaleTypeChange,
  onPriceChange,
  onCurrencyChange,
  onRoyaltyChange,
}: MintPricingStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Pricing & Royalties</h2>
        <p className="text-muted-foreground">Set your pricing and royalty preferences</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <Label>Sale Type</Label>
            <RadioGroup value={saleType} onValueChange={(value: any) => onSaleTypeChange(value)}>
              <div className="flex items-center space-x-2 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Fixed Price</p>
                    <p className="text-sm text-muted-foreground">List your NFT at a fixed price</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="auction" id="auction" />
                <Label htmlFor="auction" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Timed Auction</p>
                    <p className="text-sm text-muted-foreground">Auction your NFT to the highest bidder</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="not-for-sale" id="not-for-sale" />
                <Label htmlFor="not-for-sale" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Not For Sale</p>
                    <p className="text-sm text-muted-foreground">Mint without listing for sale</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {saleType !== "not-for-sale" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  {saleType === "auction" ? "Starting Price" : "Price"} <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => onPriceChange(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={currency} onValueChange={onCurrencyChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_CURRENCIES.map((curr) => (
                        <SelectItem key={curr.id} value={curr.id}>
                          {curr.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {price && (
                  <p className="text-sm text-muted-foreground">
                    ≈ ${(Number.parseFloat(price) * 2500).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Creator Royalty</Label>
              <span className="text-sm font-medium">{royalty}%</span>
            </div>
            <Slider value={[royalty]} onValueChange={(value) => onRoyaltyChange(value[0])} max={10} step={0.5} />
            <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                You'll receive {royalty}% of the sale price every time this NFT is resold on secondary markets.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
