"use client";

import { CompactNFTCard } from "@/components/compact-card";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface CollectionNFTsProps {
  collection: any;
}

export function CollectionNFTs({ collection }: CollectionNFTsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  //   const [sortBy, setSortBy] = useState("recent");

  const nfts = collection.nfts || [];

  if (nfts.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No NFTs in this collection yet
        </h3>
        <p className="text-gray-600">
          This collection doesn't have any NFTs listed for sale.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-gray-600">Showing {nfts.length} items</div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          {/* <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 h-8 ${
                viewMode === "grid"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 h-8 ${
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </div>

      {/* NFT Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-4"
          }
          layout
        >
          {nfts.map((nft: any, index: number) => (
            <CompactNFTCard
              key={nft.id}
              nft={nft}
              index={index}
              //   viewMode={viewMode}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
