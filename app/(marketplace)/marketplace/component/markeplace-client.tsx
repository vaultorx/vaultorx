"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  SortAsc,
  Search,
} from "lucide-react";
import { CompactNFTCard } from "@/components/compact-card";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useNFTs } from "@/hooks/use-nfts";

const SORT_OPTIONS = [
  { value: "recent", label: "Recently Listed" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "most-liked", label: "Most Liked" },
  { value: "most-viewed", label: "Most Viewed" },
  { value: "rare", label: "Rarity" },
];

export default function MarketplaceClient() {
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();

  const { nfts, loading, error, pagination, refetch } = useNFTs({
    search: searchQuery,
    sortBy,
    sortOrder: sortBy === "price-low" ? "asc" : "desc",
    page,
    limit: 12,
  });

  // Read search query from URL on component mount
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(decodeURIComponent(search));
    }
  }, [searchParams]);

  // Filter and sort NFTs
  const filteredNFTs = useMemo(() => {
    let filtered = nfts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.collection?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.listPrice || 0) - (b.listPrice || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.listPrice || 0) - (a.listPrice || 0));
        break;
      case "most-liked":
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "most-viewed":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "rare":
        const rarityOrder = { Legendary: 4, Epic: 3, Rare: 2, Common: 1 };
        filtered.sort(
          (a, b) =>
            (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) -
            (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0)
        );
        break;
      default: // recent
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return filtered;
  }, [searchQuery, sortBy]);

 
  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label ||
    "Recently Listed";

  const handleLoadMore = () => {
    if (pagination && page < pagination.pages) {
      setPage(page + 1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 pt-24 sm:px-10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Failed to load NFTs
          </h3>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-950 px-4 pt-24 sm:px-10">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Marketplace Header */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Explore Marketplace
            </h1>
            <p className="text-lg text-slate-400">
              {loading
                ? "Loading..."
                : `Discover ${filteredNFTs.length} unique digital assets across all categories`}
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search NFTs, collections, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-12 bg-slate-800/50 border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 text-white placeholder-slate-400 rounded-xl"
            />
          </div>
        </motion.div>

        {/* Stats and Controls Bar */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 p-6 bg-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center gap-6 text-sm text-slate-400 mb-4 lg:mb-0">
            <div>
              <span className="text-white font-semibold">
                {loading ? "..." : filteredNFTs.length}
              </span>{" "}
              items
            </div>
            <div>
              <span className="text-white font-semibold">
                {loading
                  ? "..."
                  : filteredNFTs.filter((nft) => nft.isListed).length}
              </span>{" "}
              listed
            </div>
            <div>
              <span className="text-green-400 font-semibold">
                {loading
                  ? "..."
                  : Math.round(
                      (filteredNFTs.filter((nft) => nft.isListed).length /
                        Math.max(filteredNFTs.length, 1)) *
                        100
                    )}
                %
              </span>{" "}
              available
            </div>
          </div>

          <div className="relative flex items-center gap-3 flex-wrap">
            {/* Sort Dropdown */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  <SortAsc className="h-4 w-4" />
                  {currentSortLabel}
                </Button>
              </motion.div>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-lg pointer-events-auto z-9999"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                          sortBy === option.value
                            ? "bg-blue-500/20 text-blue-400"
                            : "text-slate-300 hover:bg-slate-700/50"
                        }`}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortDropdown(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <div className="relative flex gap-6">
          {/* NFT Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {filteredNFTs.length === 0 ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No NFTs found
                  </h3>
                  <p className="text-slate-400">
                    Try adjusting your filters or search terms
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  className={
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  }
                  layout
                >
                  {filteredNFTs.map((nft, index) => (
                    <CompactNFTCard key={nft.id} nft={nft} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load More */}
            {!loading && pagination && page < pagination.pages && (
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8"
                  onClick={handleLoadMore}
                >
                  Load More NFTs
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
