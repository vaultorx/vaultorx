"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Eye,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock collection data
const mockCollections = [
  {
    id: "1",
    name: "Digital Dreams",
    description:
      "A collection of surreal digital artworks exploring consciousness",
    itemCount: 24,
    floorPrice: 1.2,
    totalVolume: 45.8,
    blockchain: "Ethereum",
    category: "Art",
    image: "/placeholder.svg",
    verified: true,
  },
  {
    id: "2",
    name: "Cosmic Evolution",
    description: "Generative art depicting the evolution of cosmic entities",
    itemCount: 50,
    floorPrice: 0.85,
    totalVolume: 32.1,
    blockchain: "Polygon",
    category: "Generative",
    image: "/placeholder.svg",
    verified: true,
  },
  {
    id: "3",
    name: "Urban Legends",
    description: "Street art and graffiti-inspired digital collectibles",
    itemCount: 12,
    floorPrice: 2.5,
    totalVolume: 18.9,
    blockchain: "Ethereum",
    category: "Photography",
    image: "/placeholder.svg",
    verified: false,
  },
];

const mockNFTs = [
  {
    id: "1",
    name: "Digital Dream #1",
    collection: "Digital Dreams",
    image: "/placeholder.svg",
    price: 1.5,
    lastSale: 1.2,
    rarity: "Legendary",
    likes: 142,
    views: 2450,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Cosmic Evolution #23",
    collection: "Cosmic Evolution",
    image: "/placeholder.svg",
    price: 0.9,
    lastSale: 0.85,
    rarity: "Rare",
    likes: 89,
    views: 1560,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Urban Legend #7",
    collection: "Urban Legends",
    image: "/placeholder.svg",
    price: 3.2,
    lastSale: 2.8,
    rarity: "Epic",
    likes: 203,
    views: 3210,
    createdAt: "2024-01-05",
  },
];

export default function CollectionPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen">

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            My Collection
          </h1>
          <p className="text-muted-foreground">
            Manage and view your NFT collections and individual assets
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Collections
                  </p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Grid3X3 className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total NFTs
                  </p>
                  <p className="text-2xl font-bold">86</p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <List className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Floor Value
                  </p>
                  <p className="text-2xl font-bold">4.55 ETH</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Eye className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Volume
                  </p>
                  <p className="text-2xl font-bold">96.8 ETH</p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Share2 className="h-4 w-4 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="collections" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full max-w-md grid-cols-2 gap-3">
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="nfts">All NFTs</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search collections..."
                  className="pl-10 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="generative">Generative</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-9 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-9 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Collection
              </Button>
            </div>
          </div>

          <TabsContent value="collections" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCollections.map((collection) => (
                <Card
                  key={collection.id}
                  className="group cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {collection.name}
                          {collection.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                          {collection.description}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Grid3X3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {collection.itemCount} items
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Floor</p>
                        <p className="font-semibold">
                          {collection.floorPrice} ETH
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Volume</p>
                        <p className="font-semibold">
                          {collection.totalVolume} ETH
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Blockchain</p>
                        <p className="font-semibold">{collection.blockchain}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Category</p>
                        <Badge variant="outline">{collection.category}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nfts">
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {mockNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className={viewMode === "list" ? "flex items-center p-4" : ""}
                >
                  {viewMode === "grid" ? (
                    <>
                      <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                        <div className="text-center">
                          <Eye className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            NFT Preview
                          </p>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{nft.name}</h3>
                          <Badge>{nft.rarity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {nft.collection}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-semibold">{nft.price} ETH</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Sale</p>
                            <p className="font-semibold">{nft.lastSale} ETH</p>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <Eye className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold truncate">
                              {nft.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {nft.collection}
                            </p>
                          </div>
                          <Badge className="ml-2">{nft.rarity}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="font-semibold">{nft.price} ETH</span>
                          <span className="text-muted-foreground">
                            Last: {nft.lastSale} ETH
                          </span>
                          <span className="text-muted-foreground">
                            {nft.likes} likes
                          </span>
                          <span className="text-muted-foreground">
                            {nft.views} views
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-4">
                        View Details
                      </Button>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
