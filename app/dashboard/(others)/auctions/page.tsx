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
  Gavel,
  Clock,
  Users,
  TrendingUp,
  Plus,
  Eye,
  Timer,
  Award,
} from "lucide-react";
import { useAuctions, useAuctionStats } from "@/hooks/use-auctions";

export default function AuctionsPage() {
  const [activeTab, setActiveTab] = useState("live");
  const { auctions, loading, error } = useAuctions({
    status: activeTab === "all" ? undefined : activeTab,
  });
  const { stats: auctionStats, loading: statsLoading } = useAuctionStats();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-red-500/10 text-red-500">Live</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500/10 text-blue-500">Upcoming</Badge>;
      case "ended":
        return <Badge variant="secondary">Ended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Failed to load auctions
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Auctions</h1>
          <p className="text-muted-foreground">
            Manage your NFT auctions and bidding activity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Auctions
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : auctionStats.totalAuctions}
                  </p>
                </div>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Gavel className="h-4 w-4 text-red-500" />
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
                    {statsLoading
                      ? "..."
                      : `${auctionStats.totalVolume.toFixed(1)} ETH`}
                  </p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Bidders
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : auctionStats.activeBidders}
                  </p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading
                      ? "..."
                      : `${auctionStats.successRate.toFixed(0)}%`}
                  </p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Award className="h-4 w-4 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 gap-3 md:max-w-lg">
                <TabsTrigger value="live">Live Auctions</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="ended">Completed</TabsTrigger>
                <TabsTrigger value="all">All Auctions</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Auction
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

          {/* Auctions Grid */}
          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <Card
                  key={auction.id}
                  className="group cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">
                        {auction.nftName}
                      </CardTitle>
                      {getStatusBadge(auction.status)}
                    </div>
                    <CardDescription>{auction.collection}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Auction Image */}
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative">
                      <div className="text-center text-muted-foreground">
                        <Eye className="h-8 w-8 mx-auto mb-2" />
                        <p>NFT Preview</p>
                      </div>

                      {auction.status === "live" && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-red-500/10 text-red-500 gap-1">
                            <Timer className="h-3 w-3" />
                            {getTimeRemaining(auction.endTime)}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Auction Details */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Auction Type</p>
                          <p className="font-semibold capitalize">
                            {auction.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            {auction.status === "ended"
                              ? "Final Bid"
                              : "Current Bid"}
                          </p>
                          <p className="font-semibold text-lg">
                            {auction.currentBid || auction.finalBid || 0} ETH
                          </p>
                        </div>
                      </div>

                      {auction.status === "live" && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Minimum Bid</p>
                            <p className="font-semibold">
                              {auction.minimumBid || 0} ETH
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Bid Increment
                            </p>
                            <p className="font-semibold">
                              {auction.bidIncrement || 0} ETH
                            </p>
                          </div>
                        </div>
                      )}

                      {auction.status === "upcoming" && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Starting Price
                            </p>
                            <p className="font-semibold">
                              {auction.startingPrice || 0} ETH
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Reserve Price
                            </p>
                            <p className="font-semibold">
                              {auction.reservePrice || 0} ETH
                            </p>
                          </div>
                        </div>
                      )}

                      {auction.status === "ended" && (
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Winning Bidder
                            </p>
                            <p className="font-semibold">
                              {auction.winningBidder || "Unknown"}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{auction.bidders} bidders</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{auction.views} views</span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant={
                            auction.status === "live"
                              ? "default"
                              : auction.status === "upcoming"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {auction.status === "live" && "Place Bid"}
                          {auction.status === "upcoming" && "View Details"}
                          {auction.status === "ended" && "View Results"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && auctions.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No auctions found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === "live" &&
                      "You don't have any live auctions right now."}
                    {activeTab === "upcoming" &&
                      "You don't have any upcoming auctions scheduled."}
                    {activeTab === "ended" &&
                      "You don't have any completed auctions."}
                    {activeTab === "all" &&
                      "You haven't created any auctions yet."}
                  </p>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Auction
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
