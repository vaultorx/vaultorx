// app/collections/[id]/components/collection-header.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Share2, Heart, Users, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface CollectionHeaderProps {
  collection: any;
}

export function CollectionHeader({ collection }: CollectionHeaderProps) {
  return (
    <motion.div
      className="flex flex-col lg:flex-row gap-8 mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Collection Image */}
      <div className="shrink-0">
        <div className="w-full lg:w-80 h-80 rounded-2xl overflow-hidden border-2 border-slate-700/50 bg-slate-800">
          <img
            src={collection.image || "/placeholder.svg"}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Collection Info */}
      <div className="flex-1 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {collection.name}
            </h1>
            {collection.verified && (
              <Badge className="bg-blue-500 gap-1">
                <Shield className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {collection.symbol && (
              <Badge variant="secondary" className="text-sm">
                {collection.symbol}
              </Badge>
            )}
          </div>

          <p className="text-lg text-slate-300 leading-relaxed">
            {collection.description}
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                By{" "}
                {collection.creator?.username ||
                  collection.creator?.name ||
                  "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="capitalize">{collection.blockchain}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex flex-wrap gap-3">
          <Button className="gap-2">
            <Heart className="h-4 w-4" />
            Like Collection
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-slate-600 text-slate-300"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          {collection.ipfsMetadataUri && (
            <Button
              variant="outline"
              className="gap-2 border-slate-600 text-slate-300"
            >
              <Globe className="h-4 w-4" />
              View on IPFS
            </Button>
          )}
        </div> */}

        {/* Royalty Info */}
        {collection.royaltyPercentage > 0 && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 w-fit">
            <div className="text-sm text-slate-400">
              Creator Royalty:{" "}
              <span className="text-green-400 font-semibold">
                {collection.royaltyPercentage}%
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
