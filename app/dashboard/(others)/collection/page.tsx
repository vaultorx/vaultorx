"use client";

import { useState } from "react";
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
import { useNFTs } from "@/hooks/use-nfts";
import Link from "next/link";
import {
  useUserCollections,
  useUserCollectionsStats,
} from "@/hooks/use-user-collections";
import { CreateCollectionDialog } from "@/components/collection-create-dialog";
import { CollectionActions } from "@/components/collection-actions";

export default function CollectionPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    collections,
    loading: collectionsLoading,
    error: collectionsError,
  } = useUserCollections();

  const { stats: collectionStats, loading: statsLoading } =
    useUserCollectionsStats();
  const { nfts: userNFTs, loading: nftsLoading } = useNFTs({
    search: searchQuery,
    limit: 100,
  });

  // Calculate stats from actual data
  const totalCollections = collections.length;
  const totalNFTs = userNFTs.length;
  const floorValue = collectionStats.reduce(
    (sum, stat) => sum + stat.floorPrice,
    0
  );
  const totalVolume = collectionStats.reduce(
    (sum, stat) => sum + stat.totalVolume,
    0
  );

  if (collectionsError) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Grid3X3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Failed to load collections
            </h3>
            <p className="text-muted-foreground">{collectionsError}</p>
          </div>
        </div>
      </div>
    );
  }

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
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : totalCollections}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {nftsLoading ? "..." : totalNFTs}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : `${floorValue.toFixed(2)} ETH`}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : `${totalVolume.toFixed(1)} ETH`}
                  </p>
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
              <CreateCollectionDialog />
            </div>
          </div>

          <TabsContent value="collections" className="space-y-6">
            {/* Loading State */}
            {collectionsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-32 bg-muted rounded"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-muted rounded"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Collections Grid */}
            {!collectionsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
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
                        <CollectionActions collection={collection} />
                      </div>
                    </CardHeader>
                    <Link href={`/collections/${collection.id}`}>
                      <CardContent className="space-y-4">
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          {collection.image ? (
                            <img
                              src={collection.image}
                              alt={collection.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <Grid3X3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                {collection?.totalItems || 0} items
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Floor</p>
                            <p className="font-semibold">
                              {collection?.floorPrice?.toFixed(4) || 0} ETH
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Volume</p>
                            <p className="font-semibold">
                              {collection?.totalVolume?.toFixed(4) || 0} ETH
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Blockchain</p>
                            <p className="font-semibold capitalize">
                              {collection.blockchain || "ethereum"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Category</p>
                            <Badge variant="outline">
                              {collection.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}

            {!collectionsLoading && collections.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Grid3X3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No collections found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? "Try adjusting your search terms"
                        : "You haven't created any collections yet"}
                    </p>
                    <CreateCollectionDialog
                      trigger={
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Create Your First Collection
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="nfts">
            {/* Loading State */}
            {nftsLoading && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {[...Array(8)].map((_, i) => (
                  <Card
                    key={i}
                    className={
                      viewMode === "list"
                        ? "flex items-center p-4 animate-pulse"
                        : "animate-pulse"
                    }
                  >
                    <div className="space-y-3">
                      <div className="h-32 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* NFTs Grid */}
            {!nftsLoading && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {userNFTs.map((nft) => (
                  <Link href={`/nft/${nft.id}`}>
                    <Card
                      key={nft.id}
                      className={
                        viewMode === "list" ? "flex items-center p-4" : ""
                      }
                    >
                      {viewMode === "grid" ? (
                        <>
                          <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                            {nft.image ? (
                              <img
                                src={nft.image}
                                alt={nft.name}
                                className="w-full h-full object-cover rounded-t-lg"
                              />
                            ) : (
                              <div className="text-center">
                                <Eye className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  NFT Preview
                                </p>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold">{nft.name}</h3>
                              <Badge>{nft.rarity}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {nft.collection?.name}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Price</p>
                                <p className="font-semibold">
                                  {nft.listPrice?.toFixed(4) || 0} ETH
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Views</p>
                                <p className="font-semibold">{nft.views}</p>
                              </div>
                            </div>
                          </CardContent>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mr-4 shrink-0">
                            {nft.image ? (
                              <img
                                src={nft.image}
                                alt={nft.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Eye className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold truncate">
                                  {nft.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {nft.collection?.name}
                                </p>
                              </div>
                              <Badge className="ml-2">{nft.rarity}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="font-semibold">
                                {nft.listPrice?.toFixed(4) || 0} ETH
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
                  </Link>
                ))}
              </div>
            )}

            {!nftsLoading && userNFTs.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No NFTs found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? "Try adjusting your search terms"
                        : "You don't own any NFTs yet"}
                    </p>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Mint Your First NFT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
