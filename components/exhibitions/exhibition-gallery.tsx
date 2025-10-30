"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Eye,
  Heart,
  Filter,
} from "lucide-react";
import { getCategoryDisplayName } from "@/lib/validations/exhibition";
import Link from "next/link";

interface Exhibition {
  id: string;
  title: string;
  description: string;
  image: string;
  bannerImage?: string;
  status: string;
  startDate: string;
  endDate: string;
  category: string;
  locationType: string;
  venueName?: string;
  virtualUrl?: string;
  views: number;
  likes: number;
  featured: boolean;
  creator: {
    id: string;
    name?: string;
    username?: string;
  };
  _count: {
    collections: number;
    nfts: number;
  };
}

export function ExhibitionGallery() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("active");

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    try {
      const response = await fetch("/api/exhibitions/public");
      const result = await response.json();

      if (result.success) {
        setExhibitions(result.data);
      } else {
        console.error("Failed to fetch exhibitions:", result.message);
      }
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExhibitions = exhibitions.filter((exhibition) => {
    const matchesSearch =
      exhibition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibition.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || exhibition.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || exhibition.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const featuredExhibitions = filteredExhibitions.filter((ex) => ex.featured);
  const regularExhibitions = filteredExhibitions.filter((ex) => !ex.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-muted rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-slate-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover NFT Exhibitions
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Explore curated digital art galleries, virtual exhibitions, and
            immersive NFT experiences from creators worldwide.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="#exhibitions">Explore Exhibitions</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-purple-600"
              asChild
            >
              <Link href="/dashboard/exhibitions/participate">
                Participate as Artist
              </Link>
            </Button>
          </div> */}
        </div>
      </section>

      {/* Main Content */}
      <section id="exhibitions" className="container mx-auto px-4 py-16">
        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold">Current Exhibitions</h2>
              <p className="text-muted-foreground mt-2">
                Discover amazing NFT collections and digital artworks
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exhibitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Categories</option>
                <option value="gaming">Gaming</option>
                <option value="art">Digital Art</option>
                <option value="photography">Photography</option>
                <option value="3d">3D Art</option>
                <option value="animated">Animated</option>
                <option value="collectibles">Collectibles</option>
                <option value="music">Music</option>
                <option value="pfps">PFPs</option>
                <option value="sports">Sports</option>
                <option value="fashion">Fashion</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredExhibitions.length}
                </div>
                <p className="text-sm text-muted-foreground">Exhibitions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    filteredExhibitions.filter((e) => e.status === "active")
                      .length
                  }
                </div>
                <p className="text-sm text-muted-foreground">Active Now</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredExhibitions.reduce(
                    (sum, e) => sum + e._count.nfts,
                    0
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Total NFTs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredExhibitions.reduce((sum, e) => sum + e.views, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured Exhibitions */}
        {featuredExhibitions.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Featured Exhibitions</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredExhibitions.map((exhibition) => (
                <FeaturedExhibitionCard
                  key={exhibition.id}
                  exhibition={exhibition}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Exhibitions */}
        <div>
          <h3 className="text-2xl font-bold mb-6">
            {featuredExhibitions.length > 0
              ? "All Exhibitions"
              : "Current Exhibitions"}
          </h3>
          {regularExhibitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularExhibitions.map((exhibition) => (
                <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">
                No exhibitions found matching your criteria.
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FeaturedExhibitionCard({ exhibition }: { exhibition: Exhibition }) {
  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
      <Link href={`/exhibitions/${exhibition.id}`}>
        <div className="aspect-video relative bg-muted overflow-hidden">
          {exhibition.bannerImage ? (
            <img
              src={exhibition.bannerImage}
              alt={exhibition.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : exhibition.image ? (
            <img
              src={exhibition.image}
              alt={exhibition.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                Exhibition
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Badge
              variant="default"
              className="bg-white/20 backdrop-blur-sm text-white border-0"
            >
              Featured
            </Badge>
            <Badge
              variant={
                exhibition.status === "active"
                  ? "default"
                  : exhibition.status === "upcoming"
                  ? "secondary"
                  : "outline"
              }
              className="backdrop-blur-sm bg-black/20 text-white border-0"
            >
              {exhibition.status}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold mb-1">{exhibition.title}</h3>
            <p className="text-sm opacity-90 line-clamp-2">
              {exhibition.description}
            </p>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(exhibition.startDate).toLocaleDateString()}</span>
            </div>
            <Badge variant="outline">
              {getCategoryDisplayName(exhibition.category)}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{exhibition.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{exhibition.likes}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExhibitionCard({ exhibition }: { exhibition: Exhibition }) {
  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
      <Link href={`/exhibitions/${exhibition.id}`}>
        <div className="aspect-video relative bg-muted">
          {exhibition.image && (
            <img
              src={exhibition.image}
              alt={exhibition.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute top-3 right-3">
            <Badge
              variant={
                exhibition.status === "active"
                  ? "default"
                  : exhibition.status === "upcoming"
                  ? "secondary"
                  : "outline"
              }
            >
              {exhibition.status}
            </Badge>
          </div>
        </div>
      </Link>

      <CardHeader>
        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
          <Link href={`/exhibitions/${exhibition.id}`}>{exhibition.title}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {exhibition.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(exhibition.startDate).toLocaleDateString()}</span>
          </div>
          <Badge variant="outline">
            {getCategoryDisplayName(exhibition.category)}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{exhibition._count.collections} collections</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🎨</span>
            <span>{exhibition._count.nfts} NFTs</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            By{" "}
            <span className="font-medium">
              {exhibition.creator.name || exhibition.creator.username}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-1 text-xs">
              <Eye className="h-3 w-3" />
              <span>{exhibition.views}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Heart className="h-3 w-3" />
              <span>{exhibition.likes}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
