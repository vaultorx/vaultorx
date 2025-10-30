"use client";

import { Collection } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, Users, Star, ExternalLink, Shield } from "lucide-react";
import Link from "next/link";

interface CollectionCardProps {
  collection: Collection;
  index: number;
  viewMode: "grid" | "list";
}

export function CollectionCard({
  collection,
  index,
  viewMode,
}: CollectionCardProps) {
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="p-6 pt-0 bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm">
          <div className="flex items-start gap-4">
            {/* Collection Image */}
            <div className="shrink-0">
              <img
                src={collection.image || "/placeholder.svg"}
                alt={collection.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
            </div>

            {/* Collection Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {collection.name}
                </h3>
                {collection.verified && (
                  <Shield className="h-4 w-4 text-blue-600" />
                )}
                {collection.symbol && (
                  <Badge variant="secondary" className="text-xs bg-gray-100">
                    {collection.symbol}
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {collection.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{collection?.totalVolume?.toFixed(1) || 0} ETH</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{collection?.totalItems || 0} items</span>
                </div>
                {collection.floorPrice && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>
                      {collection?.floorPrice?.toFixed(2) || 0} ETH floor
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Link href={`/collections/${collection.id}`}>
              <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                View
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group bg-white border-gray-200 pt-0 hover:border-blue-500 transition-all duration-300 overflow-hidden shadow-sm">
        {/* Collection Header */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={collection.image || "/placeholder.svg"}
            alt={collection.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link href={`/collections/${collection.id}`}>
              <Button className="gap-2 bg-white text-gray-900 hover:bg-gray-100">
                View Collection
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {collection.verified && (
              <Badge className="bg-blue-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {collection.symbol && (
              <Badge variant="secondary" className="bg-white/90 text-gray-700">
                {collection.symbol}
              </Badge>
            )}
          </div>
        </div>

        {/* Collection Info */}
        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
              {collection.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
              {collection.description}
            </p>
            <p className="text-gray-500 text-xs">
              by{" "}
              {collection.creator?.username ||
                collection.creator?.name ||
                "Unknown"}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-gray-900 font-semibold">
                {collection?.totalVolume?.toFixed(1) || 0}
              </div>
              <div className="text-gray-500">Volume</div>
            </div>
            <div className="text-center">
              <div className="text-gray-900 font-semibold">
                {collection?.totalItems || 0}
              </div>
              <div className="text-gray-500">Items</div>
            </div>
            <div className="text-center">
              <div className="text-gray-900 font-semibold">
                {collection.floorPrice
                  ? `${collection?.floorPrice?.toFixed(4)} ETH`
                  : "—"}
              </div>
              <div className="text-gray-500">Floor</div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
