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
  Filter,
  ExternalLink,
} from "lucide-react";
import { getCategoryDisplayName } from "@/lib/validations/exhibition";
import { toast } from "sonner";
import ParticipationModal from "@/components/exhibitions/participation-modal";

interface Exhibition {
  id: string;
  title: string;
  description: string;
  image: string;
  status: string;
  startDate: string;
  endDate: string;
  category: string;
  locationType: string;
  venueName?: string;
  virtualUrl?: string;
  views: number;
  likes: number;
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

export default function ParticipateExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [selectedExhibition, setSelectedExhibition] =
    useState<Exhibition | null>(null);
  const [participationModalOpen, setParticipationModalOpen] = useState(false);
  const [userParticipations, setUserParticipations] = useState<
    Record<string, any>
  >({});

  useEffect(() => {
    fetchExhibitions();
    fetchUserParticipations();
  }, []);

  const fetchExhibitions = async () => {
    try {
      const response = await fetch("/api/exhibitions/public");
      const result = await response.json();

      if (result.success) {
        setExhibitions(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
      toast.error("Failed to load exhibitions");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserParticipations = async () => {
    try {
      const response = await fetch("/api/user/exhibition-participations");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const participationsMap: Record<string, any> = {};
          result.data.forEach((participation: any) => {
            participationsMap[participation.exhibitionId] = participation;
          });
          setUserParticipations(participationsMap);
        }
      }
    } catch (error) {
      console.error("Error fetching participations:", error);
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

  const handleParticipate = (exhibition: Exhibition) => {
    setSelectedExhibition(exhibition);
    setParticipationModalOpen(true);
  };

  const handleParticipationSuccess = () => {
    fetchUserParticipations();
    fetchExhibitions();
  };

  const getParticipationStatus = (exhibitionId: string) => {
    const participation = userParticipations[exhibitionId];
    if (!participation) return null;

    const statusColors = {
      pending: "bg-yellow-500",
      approved: "bg-green-500",
      rejected: "bg-red-500",
      withdrawn: "bg-gray-500",
    };

    return (
      <Badge
        className={`${
          statusColors[participation.status as keyof typeof statusColors]
        } text-white`}
      >
        {participation.status.charAt(0).toUpperCase() +
          participation.status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Participate in Exhibitions</h1>
        <p className="text-muted-foreground">
          Discover and join exciting NFT exhibitions to showcase your
          collections and artworks.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exhibitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
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
        </CardContent>
      </Card>

      {/* Exhibition Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExhibitions.map((exhibition) => (
          <Card key={exhibition.id} className="overflow-hidden">
            <div className="aspect-video relative bg-muted">
              {exhibition.image && (
                <img
                  src={exhibition.image}
                  alt={exhibition.title}
                  className="object-cover w-full h-full"
                />
              )}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
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
                {getParticipationStatus(exhibition.id)}
              </div>
            </div>

            <CardHeader>
              <CardTitle className="line-clamp-1">{exhibition.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {exhibition.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(exhibition.startDate).toLocaleDateString()}
                  </span>
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
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/exhibitions/${exhibition.id}`} target="_blank">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleParticipate(exhibition)}
                    disabled={
                      exhibition.status !== "active" ||
                      userParticipations[exhibition.id]
                    }
                  >
                    {userParticipations[exhibition.id]
                      ? "Submitted"
                      : "Participate"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExhibitions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            No exhibitions found matching your criteria.
          </div>
        </div>
      )}

      {/* Participation Modal */}
      <ParticipationModal
        open={participationModalOpen}
        onOpenChange={setParticipationModalOpen}
        exhibition={selectedExhibition!}
        onSuccess={handleParticipationSuccess}
      />
    </div>
  );
}
