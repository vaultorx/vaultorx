"use client"

import { NFTCard } from "@/components/nft-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { NFTItem } from "@/lib/types"

interface MoreFromCollectionProps {
  collectionName: string
  items: NFTItem[]
}

export function MoreFromCollection({ collectionName, items }: MoreFromCollectionProps) {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">More from {collectionName}</h2>
        <Button variant="ghost" className="gap-2">
          View Collection
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.slice(0, 4).map((item) => (
          <NFTCard key={item.id} nft={item} showCollection={false} />
        ))}
      </div>
    </section>
  )
}
