// app/exhibitions/[id]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Eye, Heart, Share2 } from "lucide-react";
import { getCategoryDisplayName } from "@/lib/validations/exhibition";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getExhibition(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/exhibitions/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const data = await getExhibition(id);
  const exhibition = data?.data;

  if (!exhibition) {
    return {
      title: "Exhibition Not Found",
    };
  }

  return {
    title: `${exhibition.title} - NFT Exhibition`,
    description: exhibition.description,
    openGraph: {
      title: exhibition.title,
      description: exhibition.description,
      images: [exhibition.image],
    },
  };
}

export default async function ExhibitionPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getExhibition(id);
  const exhibition = data?.data;

  if (!exhibition) {
    notFound();
  }

  const isActive = exhibition.status === "active";
  const isUpcoming = exhibition.status === "upcoming";
  const isEnded = exhibition.status === "ended";

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative h-64 md:h-96 bg-linear-to-r from-purple-600 to-blue-600">
        {exhibition.bannerImage && (
          <Image
            src={exhibition.bannerImage}
            alt={exhibition.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-6 left-6 text-white">
          <Badge
            variant={
              isActive ? "default" : isUpcoming ? "secondary" : "destructive"
            }
            className="mb-2"
          >
            {exhibition.status.toUpperCase()}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold">{exhibition.title}</h1>
          <p className="text-lg opacity-90 mt-1">{exhibition.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Exhibition Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-card rounded-lg border">
              <div className="text-center">
                <Eye className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{exhibition.views}</p>
                <p className="text-sm text-muted-foreground">Views</p>
              </div>
              <div className="text-center">
                <Heart className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{exhibition.likes}</p>
                <p className="text-sm text-muted-foreground">Likes</p>
              </div>
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">
                  {exhibition._count?.collections || 0}
                </p>
                <p className="text-sm text-muted-foreground">Collections</p>
              </div>
              <div className="text-center">
                <div className="h-6 w-6 mx-auto mb-2 text-muted-foreground">
                  🎨
                </div>
                <p className="text-2xl font-bold">
                  {exhibition._count?.nfts || 0}
                </p>
                <p className="text-sm text-muted-foreground">NFTs</p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exhibition.startDate).toLocaleDateString()} -{" "}
                      {new Date(exhibition.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {exhibition.locationType === "virtual"
                        ? "Virtual Event"
                        : exhibition.venueName || "Physical Location"}
                    </p>
                    {exhibition.venueAddress && (
                      <p className="text-sm text-muted-foreground">
                        {exhibition.venueAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Category</p>
                  <Badge variant="outline" className="mt-1">
                    {getCategoryDisplayName(exhibition.category)}
                  </Badge>
                </div>

                {exhibition.virtualUrl && (
                  <div>
                    <p className="font-semibold">Virtual Access</p>
                    <Button asChild variant="outline" className="mt-1">
                      <a
                        href={exhibition.virtualUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Virtual Exhibition
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Featured NFTs/Collections would go here */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Featured Artworks</h3>
              {/* Add NFT grid component here */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Map through featured NFTs */}
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Creator Info */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border space-y-4">
              <Button className="w-full" size="lg" disabled={!isActive}>
                {isActive
                  ? "View Exhibition"
                  : isUpcoming
                  ? "Coming Soon"
                  : "Exhibition Ended"}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Creator Info */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Organized By</h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                  <span className="font-semibold">
                    {exhibition.creator.name?.[0] ||
                      exhibition.creator.username?.[0] ||
                      "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {exhibition.creator.name || exhibition.creator.username}
                  </p>
                  <p className="text-sm text-muted-foreground">Curator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
