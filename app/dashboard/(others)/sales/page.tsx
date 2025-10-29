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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Target,
  Plus,
  Eye,
  Heart,
  Clock,
  Tag,
} from "lucide-react";
import { useSales, useSalesStats } from "@/hooks/use-sales";

export default function SalesPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const { salesRecords, activeListings, loading, error } = useSales({
    timeRange,
  });
  const { stats: salesStats, loading: statsLoading } = useSalesStats();

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Failed to load sales data
            </h3>
            <p className="text-muted-foreground">{error}</p>
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
            Sales & Listings
          </h1>
          <p className="text-muted-foreground">
            Manage your NFT sales, listings, and track performance
          </p>
        </div>

        {/* Sales Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Sales
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading
                      ? "..."
                      : `${salesStats.totalSales.toFixed(1)} ETH`}
                  </p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Sale Price
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading
                      ? "..."
                      : `${salesStats.avgSalePrice.toFixed(1)} ETH`}
                  </p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Royalties
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading
                      ? "..."
                      : `${salesStats.royaltyEarnings.toFixed(3)} ETH`}
                  </p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Target className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Listings
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : salesStats.activeListings}
                  </p>
                </div>
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="listings" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid grid-cols-4 gap-3 md:max-w-lg">
              <TabsTrigger value="listings">Active Listings</TabsTrigger>
              <TabsTrigger value="sales">Sales History</TabsTrigger>
              <TabsTrigger value="analytics">Sales Analytics</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-background"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>

              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Listing
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-32"></div>
                            <div className="h-3 bg-muted rounded w-24"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-20"></div>
                          <div className="h-3 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Active Listings */}
          {!loading && (
            <TabsContent value="listings" className="space-y-6">
              {/* Empty State for Active Listings */}
              {(!activeListings || activeListings.length === 0) && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Tag className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        No Active Listings
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        You don't have any NFTs listed for sale. Start by
                        listing your NFTs to reach potential buyers and grow
                        your collection value.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          List Your First NFT
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Browse Marketplace
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Listings Grid */}
              {activeListings && activeListings.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Your Active Listings ({activeListings.length})
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        NFTs currently listed for sale
                      </p>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      Auto-refresh in 30s
                    </Badge>
                  </div>

                  <div className="grid gap-4">
                    {activeListings.map((listing) => (
                      <Card
                        key={listing.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center border">
                                <ShoppingCart className="h-6 w-6 text-blue-500" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {listing.nftName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {listing.collection}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-sm">
                                      <div className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        <span>{listing.views || 0} views</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Heart className="h-3 w-3" />
                                        <span>{listing.likes || 0} likes</span>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="bg-green-500/10 text-green-500 border-green-200"
                                      >
                                        Active
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="text-right min-w-[120px] ml-4">
                              <div className="flex items-center gap-2 mb-2 justify-end">
                                <p className="text-2xl font-bold text-green-600">
                                  {listing.listPrice} ETH
                                </p>
                                <Badge
                                  className={
                                    listing.listPrice >
                                    (listing.floorPrice || 0)
                                      ? "bg-green-500/10 text-green-500"
                                      : "bg-blue-500/10 text-blue-500"
                                  }
                                >
                                  {listing.listPrice > (listing.floorPrice || 0)
                                    ? "Above Floor"
                                    : "At Floor"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Floor: {listing.floorPrice || "N/A"} ETH
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Listed {listing.duration || "recently"}
                              </p>
                            </div>

                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                              >
                                <TrendingUp className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <TrendingDown className="h-3 w-3" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Quick Stats for Active Listings */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {activeListings
                              .reduce(
                                (sum, listing) =>
                                  sum + (listing.listPrice || 0),
                                0
                              )
                              .toFixed(2)}{" "}
                            ETH
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total Listed Value
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {activeListings.length}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total Listings
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {activeListings.reduce(
                              (sum, listing) => sum + (listing.views || 0),
                              0
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total Views
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {activeListings.reduce(
                              (sum, listing) => sum + (listing.likes || 0),
                              0
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total Likes
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          )}

          {/* Sales History */}
          {!loading && (
            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle>Sales History</CardTitle>
                  <CardDescription>Your completed NFT sales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(salesRecords) && salesRecords.length > 0 ? (
                      salesRecords.map((sale) => (
                        <div
                          key={sale.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg flex items-center justify-center border">
                              <DollarSign className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{sale.nftName}</h4>
                              <p className="text-sm text-muted-foreground">
                                {sale.collection}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                To: {sale.buyer}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-1">
                              <p className="text-xl font-bold text-green-500">
                                {sale.salePrice} ETH
                              </p>
                              <Badge className="bg-green-500/10 text-green-500">
                                +
                                {(
                                  ((sale.salePrice - sale.previousPrice) /
                                    sale.previousPrice) *
                                  100
                                ).toFixed(1)}
                                %
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Previous: {sale.previousPrice} ETH
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Royalty: {sale.royalty} ETH
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {sale.saleDate}
                            </p>
                            <Badge variant="secondary">{sale.status}</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                          <DollarSign className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          No sales history
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't made any sales yet. Start listing your
                          NFTs to make your first sale!
                        </p>
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          List Your First NFT
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Sales Analytics */}
          {!loading && (
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Price Performance</CardTitle>
                    <CardDescription>
                      Your sales compared to floor prices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {salesRecords && salesRecords.length > 0 ? (
                      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                          <p>Price performance chart</p>
                          <p className="text-sm mt-2">
                            {salesRecords.length} sales analyzed
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed">
                        <div className="text-center text-muted-foreground">
                          <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                          <p>No data available</p>
                          <p className="text-sm mt-2">
                            Complete your first sale to see analytics
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sales Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of your sales by collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {salesRecords && salesRecords.length > 0 ? (
                      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                          <p>Sales distribution chart</p>
                          <p className="text-sm mt-2">
                            {
                              new Set(salesRecords.map((s) => s.collection))
                                .size
                            }{" "}
                            collections
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed">
                        <div className="text-center text-muted-foreground">
                          <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                          <p>No sales data</p>
                          <p className="text-sm mt-2">
                            Start selling to see distribution charts
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
