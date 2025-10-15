"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NFTCard } from "@/components/nft-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { NFTItem } from "@/lib/types"

interface DashboardNFTGridProps {
  ownedNFTs: NFTItem[]
  listedNFTs: NFTItem[]
}

export function DashboardNFTGrid({ ownedNFTs, listedNFTs }: DashboardNFTGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My NFTs</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="owned">Owned ({ownedNFTs.length})</TabsTrigger>
            <TabsTrigger value="listed">Listed ({listedNFTs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="owned" className="mt-6">
            {ownedNFTs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ownedNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">You don't own any NFTs yet</p>
                <Button>Explore Marketplace</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="listed" className="mt-6">
            {listedNFTs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listedNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">You don't have any listed NFTs</p>
                <Button>List an NFT</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
