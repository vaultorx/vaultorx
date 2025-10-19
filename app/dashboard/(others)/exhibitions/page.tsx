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
  Calendar,
  MapPin,
  Users,
  Eye,
  Clock,
  Plus,
  Settings,
  Share2,
} from "lucide-react";

// Mock exhibitions data
const mockExhibitions = [
  {
    id: "ex1",
    title: "Digital Renaissance",
    description:
      "Exploring the intersection of classical art and digital technology",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-03-01",
    location: "Virtual Gallery",
    visitors: 12450,
    featuredNFTs: 15,
    totalNFTs: 45,
    curator: "Your Profile",
    image: "/placeholder.svg",
  },
  {
    id: "ex2",
    title: "Metaverse Art Week",
    description: "A showcase of groundbreaking metaverse-native artworks",
    status: "upcoming",
    startDate: "2024-03-15",
    endDate: "2024-04-15",
    location: "Decentraland & Spatial",
    visitors: 0,
    featuredNFTs: 8,
    totalNFTs: 25,
    curator: "Your Profile",
    image: "/placeholder.svg",
  },
  {
    id: "ex3",
    title: "Generative Art Symposium",
    description: "Celebrating the art of code and algorithmic creativity",
    status: "ended",
    startDate: "2024-01-10",
    endDate: "2024-01-25",
    location: "Online Exhibition",
    visitors: 8560,
    featuredNFTs: 12,
    totalNFTs: 30,
    curator: "Your Profile",
    image: "/placeholder.svg",
  },
];

export default function ExhibitionsPage() {
  const [activeTab, setActiveTab] = useState("active");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/10 text-green-500">Live Now</Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-blue-500/10 text-blue-500">Coming Soon</Badge>
        );
      case "ended":
        return <Badge variant="secondary">Ended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredExhibitions = mockExhibitions.filter(
    (ex) => activeTab === "all" || ex.status === activeTab
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Exhibitions
          </h1>
          <p className="text-muted-foreground">
            Create and manage your virtual art exhibitions
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Exhibitions
                  </p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Visitors
                  </p>
                  <p className="text-2xl font-bold">21K</p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Users className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Featured NFTs
                  </p>
                  <p className="text-2xl font-bold">35</p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Eye className="h-4 w-4 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Now
                  </p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Clock className="h-4 w-4 text-orange-500" />
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
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="ended">Past</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Exhibition
            </Button>
          </div>

          {/* Exhibitions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExhibitions.map((exhibition) => (
              <Card
                key={exhibition.id}
                className="group cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">
                      {exhibition.title}
                    </CardTitle>
                    {getStatusBadge(exhibition.status)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {exhibition.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Exhibition Image */}
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Eye className="h-8 w-8 mx-auto mb-2" />
                      <p>Exhibition Preview</p>
                    </div>
                  </div>

                  {/* Exhibition Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {new Date(exhibition.startDate).toLocaleDateString()}{" "}
                          - {new Date(exhibition.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{exhibition.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Visitors</p>
                        <p className="font-semibold">
                          {exhibition.visitors.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">NFTs</p>
                        <p className="font-semibold">{exhibition.totalNFTs}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-muted-foreground">
                        Curated by {exhibition.curator}
                      </div>

                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExhibitions.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No exhibitions found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === "active" &&
                      "You don't have any active exhibitions right now."}
                    {activeTab === "upcoming" &&
                      "You don't have any upcoming exhibitions scheduled."}
                    {activeTab === "ended" &&
                      "You don't have any past exhibitions."}
                    {activeTab === "all" &&
                      "You haven't created any exhibitions yet."}
                  </p>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Exhibition
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
