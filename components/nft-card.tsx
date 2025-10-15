"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, TrendingUp } from "lucide-react"
import type { NFTItem } from "@/lib/types"

interface NFTCardProps {
  nft: NFTItem
  showCollection?: boolean
}

export function NFTCard({ nft, showCollection = true }: NFTCardProps) {
  return (
    <Link href={`/nft/${nft.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={nft.ipfsAssetUri || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(nft.name)}`}
            alt={nft.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault()
              // Handle favorite
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          {nft.isListed && <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur">Listed</Badge>}
        </div>
        <CardContent className="p-4">
          {showCollection && nft.collection && (
            <p className="text-xs text-muted-foreground mb-1 truncate">{nft.collection.name}</p>
          )}
          <h3 className="font-semibold text-base mb-2 truncate">{nft.name}</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="font-semibold">{nft.listPrice ? `${nft.listPrice} ${nft.currency}` : "Not listed"}</p>
            </div>
            {nft.collection?.floorPrice && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Floor</p>
                <p className="text-sm font-medium">{nft.collection.floorPrice} ETH</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Last sale: 2.5 ETH
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
