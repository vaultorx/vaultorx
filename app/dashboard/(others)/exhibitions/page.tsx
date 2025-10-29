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
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  Image as ImageIcon,
  TrendingUp,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExhibitions, useExhibitionStats } from "@/hooks/use-exhibitions";
import CreateExhibitionModal from "@/components/exhibitions/create-exhibition-modal";
import EditExhibitionModal from "@/components/exhibitions/edit-exhibition-modal";
import DeleteExhibitionModal from "@/components/exhibitions/delete-exhibition-modal";

export default function ExhibitionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState<any>(null);

  const { exhibitions, loading, error, refetch } = useExhibitions({
    status: activeTab === "all" ? undefined : activeTab,
  });

  const { stats: exhibitionStats, loading: statsLoading } =
    useExhibitionStats();

  const handleEdit = (exhibition: any) => {
    setSelectedExhibition(exhibition);
    setEditModalOpen(true);
  };

  const handleDelete = (exhibition: any) => {
    setSelectedExhibition(exhibition);
    setDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    refetch();
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedExhibition(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500";
      case "upcoming":
        return "bg-blue-500/10 text-blue-500";
      case "ended":
        return "bg-gray-500/10 text-gray-500";
      case "draft":
        return "bg-yellow-500/10 text-yellow-500";
      case "cancelled":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "upcoming":
        return <Clock className="h-4 w-4" />;
      case "ended":
        return <XCircle className="h-4 w-4" />;
      case "draft":
        return <Edit className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Failed to load exhibitions
            </h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Exhibitions
              </h1>
              <p className="text-muted-foreground">
                Create and manage your NFT exhibitions and showcases
              </p>
            </div>
            <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Exhibition
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Exhibitions
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : exhibitionStats.totalExhibitions}
                  </p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : exhibitionStats.activeExhibitions}
                  </p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Views
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : exhibitionStats.totalViews}
                  </p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Likes
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : exhibitionStats.totalLikes}
                  </p>
                </div>
                <div className="p-2 bg-pink-500/10 rounded-lg">
                  <Heart className="h-6 w-6 text-pink-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid grid-cols-5 gap-3 md:max-w-lg">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{exhibitions.length} exhibitions</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="h-48 bg-muted"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-muted rounded w-16"></div>
                          <div className="h-6 bg-muted rounded w-20"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Exhibitions Grid */}
          {!loading && (
            <TabsContent value={activeTab} className="space-y-6">
              {exhibitions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exhibitions.map((exhibition) => (
                    <Card
                      key={exhibition.id}
                      className="group hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-0">
                        {/* Exhibition Image */}
                        <div className="relative h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 overflow-hidden">
                          {exhibition.image ? (
                            <img
                              src={exhibition.image}
                              alt={exhibition.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge
                              className={getStatusColor(exhibition.status)}
                            >
                              <span className="flex items-center gap-1">
                                {getStatusIcon(exhibition.status)}
                                {exhibition.status}
                              </span>
                            </Badge>
                          </div>

                          {/* Featured Badge */}
                          {exhibition.featured && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-yellow-500/10 text-yellow-500">
                                Featured
                              </Badge>
                            </div>
                          )}

                          {/* Actions Dropdown */}
                          <div className="absolute top-3 right-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(exhibition)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(exhibition)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Exhibition Details */}
                        <div className="p-6">
                          <div className="mb-4">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              {exhibition.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {exhibition.description}
                            </p>
                          </div>

                          {/* Exhibition Meta */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(
                                  exhibition.startDate
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  exhibition.endDate
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="capitalize">
                                {exhibition.locationType}
                                {exhibition.venueName &&
                                  ` • ${exhibition.venueName}`}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>
                                {exhibition?._count?.collections || 0}{" "}
                                collections • {exhibition._count?.nfts || 0}{" "}
                                NFTs
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span>{exhibition.views || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4 text-muted-foreground" />
                                <span>{exhibition.likes || 0}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={`/exhibitions/${exhibition.id}`}
                                  target="_blank"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(exhibition)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        No exhibitions found
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        {activeTab === "all"
                          ? "You haven't created any exhibitions yet. Start by creating your first exhibition to showcase your NFTs."
                          : `You don't have any ${activeTab} exhibitions.`}
                      </p>
                      <Button
                        onClick={() => setCreateModalOpen(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create Your First Exhibition
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Modals */}
      <CreateExhibitionModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleSuccess}
      />

      <EditExhibitionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        exhibition={selectedExhibition}
        onSuccess={handleSuccess}
      />

      <DeleteExhibitionModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        exhibition={selectedExhibition}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
