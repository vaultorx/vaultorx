"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Zap, Clock, TrendingUp, User } from "lucide-react";
import { useState } from "react";
import type { NFTItem } from "@/lib/types";

interface NFTCardProps {
  nft: NFTItem;
  showCollection?: boolean;
  showStats?: boolean;
  variant?: "default" | "compact" | "featured";
}

export function NFTCard({
  nft,
  showCollection = true,
  showStats = true,
  variant = "default",
}: NFTCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // const handleLike = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setIsLiked(!isLiked);
  //   // TODO: Add actual like functionality
  // };

  const getRarityColor = (rarity: string) => {
    const colors = {
      Common:
        "bg-gray-500/10 text-gray-900 border-gray-500/30",
      Rare: "bg-blue-500/10 text-blue-900 border-blue-500/30",
      Epic: "bg-purple-500/10 text-purple-900 border-purple-500/30",
      Legendary:
        "bg-orange-500/10 text-orange-900 border-orange-500/30",
    };
    return colors[rarity as keyof typeof colors] || colors.Common;
  };

  const formatPrice = (price: number) => {
    return price % 1 === 0 ? price.toString() : price.toFixed(3);
  };

  if (variant === "compact") {
    return (
      <Link href={`/nft/${nft.id}`}>
        <Card className="group overflow-hidden transition-all hover:shadow-md hover:border-primary/30 border-2">
          <div className="flex items-center p-3 gap-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={
                  nft.image ||
                  `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(
                    nft.name
                  )}`
                }
                alt={nft.name}
                fill
                className="object-cover"
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {showCollection && nft.collection && (
                <p className="text-xs text-muted-foreground mb-1 truncate font-medium">
                  {nft.collection.name}
                </p>
              )}
              <h3 className="font-semibold text-sm truncate mb-1">
                {nft.name}
              </h3>
              <div className="flex flex-1 items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs px-1.5 py-0 h-5 ${getRarityColor(
                    nft.rarity
                  )}`}
                >
                  {nft.rarity}
                </Badge>
                {nft.isListed && (
                  <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 text-xs px-1.5 py-0 h-5 border-0">
                    Listed
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              {nft.isListed ? (
                <div>
                  <p className="font-bold text-sm">
                    {formatPrice(nft.listPrice!)} ETH
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Floor: {nft.collection?.floorPrice} ETH
                  </p>
                </div>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Not listed
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/nft/${nft.id}`}>
        <Card className="group overflow-hidden transition-all hover:shadow-xl hover:border-primary/50 border-2 relative">
          {/* Featured Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
              <Zap className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
            <Image
              src={
                nft.image ||
                `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(
                  nft.name
                )}`
              }
              alt={nft.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Action Buttons */}
            {/* <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={handleLike}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
            </div> */}

            {/* Collection Badge */}
            {showCollection && nft.collection && (
              <div className="absolute bottom-3 left-3">
                <Badge
                  variant="secondary"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  {nft.collection.name}
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">
                  {nft.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {nft.description || "No description available"}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`ml-2 shrink-0 ${getRarityColor(nft.rarity)}`}
              >
                {nft.rarity}
              </Badge>
            </div>

            {showStats && (
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {nft.views.toLocaleString()}
                  </span>
                  {/* <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {nft.likes.toLocaleString()}
                  </span> */}
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(nft.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Current Price
                </p>
                <p className="text-xl font-bold text-primary">
                  {nft.isListed
                    ? `${formatPrice(nft.listPrice!)} ${nft.currency}`
                    : "Not Listed"}
                </p>
              </div>
              {nft.collection?.floorPrice && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Floor</p>
                  <p className="text-lg font-semibold">
                    {nft.collection.floorPrice.toFixed(4)} ETH
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          {nft.isListed && (
            <CardFooter className="p-4 pt-0">
              <div className="w-full bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  <span>
                    Listed {new Date(nft.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/nft/${nft.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 border pt-0 pb-1">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          <Image
            src={
              nft.image ||
              `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(
                nft.name
              )}`
            }
            alt={nft.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}

          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {nft.isListed && (
              <Badge className="bg-green-500/90 backdrop-blur text-white border-0 shadow-lg">
                Listed
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`backdrop-blur bg-background/80 ${getRarityColor(
                nft.rarity
              )}`}
            >
              {nft.rarity}
            </Badge>
          </div>

          {/* Action Buttons */}
          {/* <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleLike}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          </div> */}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              className="bg-background/90 backdrop-blur"
            >
              View Details
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {showCollection && nft.collection && (
            <div className="flex items-center gap-2 mb-2">
              <User className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium truncate">
                {nft.collection.name}
              </p>
            </div>
          )}

          <h3 className="font-semibold text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {nft.name}
          </h3>

          {nft.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {nft.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Price</p>
              <p
                className={`font-bold text-lg ${
                  nft.isListed ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {nft.isListed
                  ? `${formatPrice(nft.listPrice!)} ${nft.currency}`
                  : "Not listed"}
              </p>
            </div>

            {nft.collection?.floorPrice && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Floor</p>
                <p className="text-sm font-semibold">
                  {nft.collection.floorPrice?.toFixed(4)} ETH
                </p>
              </div>
            )}
          </div>

          {showStats && (
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{nft.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{nft.likes.toLocaleString()} likes</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>2.5 ETH</span>
              </div> */}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
