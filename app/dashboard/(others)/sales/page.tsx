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
} from "lucide-react";
import { activeListings, salesRecords } from "@/lib/mocks";



const salesStats = {
  totalSales: 2.4,
  totalVolume: 96.8,
  avgSalePrice: 1.2,
  royaltyEarnings: 0.12,
  activeListings: 2,
  soldThisMonth: 2,
};

export default function SalesPage() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="min-h-screen">
      {/* <Header /> */}

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
                    {salesStats.totalSales} ETH
                  </p>
                  <p className="text-sm text-green-500 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12.5% this month
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
                    {salesStats.avgSalePrice} ETH
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
                    {salesStats.royaltyEarnings} ETH
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
                    {salesStats.activeListings}
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

              <Button>Create Listing</Button>
            </div>
          </div>

          {/* Active Listings */}
          <TabsContent value="listings">
            <div className="grid gap-6">
              {activeListings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{listing.nftName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {listing.collection}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-sm">
                            <span>{listing.views} views</span>
                            <span>{listing.likes} likes</span>
                            <Badge variant="outline">{listing.status}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-2xl font-bold">
                            {listing.listPrice} ETH
                          </p>
                          <Badge
                            className={
                              listing.listPrice > listing.floorPrice
                                ? "bg-green-500/10 text-green-500"
                                : "bg-blue-500/10 text-blue-500"
                            }
                          >
                            {listing.listPrice > listing.floorPrice
                              ? "Above Floor"
                              : "At Floor"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Floor: {listing.floorPrice} ETH
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Duration: {listing.duration}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sales History */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Sales History</CardTitle>
                <CardDescription>Your completed NFT sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesRecords.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
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
                        <p className="text-sm font-medium">{sale.saleDate}</p>
                        <Badge variant="secondary">{sale.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Analytics */}
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
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                      <p>Price performance chart</p>
                    </div>
                  </div>
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
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                      <p>Sales distribution chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
