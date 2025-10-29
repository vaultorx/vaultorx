"use client";

import { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HomeFooter } from "@/components/home-footer";
import { CollectionGrid } from "./components/collection-grid";
import { useCollections } from "@/hooks/use-collections";
import { Search, Grid, List, TrendingUp, Zap, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CollectionFilters } from "./components/collection-filters";

const SORT_OPTIONS = [
  { value: "createdAt", label: "Recently Created", icon: Zap },
  { value: "totalVolume", label: "Highest Volume", icon: TrendingUp },
  { value: "floorPrice", label: "Highest Floor", icon: TrendingUp },
  { value: "totalItems", label: "Most Items", icon: Users },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "art", label: "Digital Art" },
  { value: "gaming", label: "Gaming" },
  { value: "photography", label: "Photography" },
  { value: "3d", label: "3D Art" },
  { value: "animated", label: "Animated" },
  { value: "collectibles", label: "Collectibles" },
  { value: "music", label: "Music" },
  { value: "pfps", label: "PFPs" },
  { value: "sports", label: "Sports" },
  { value: "fashion", label: "Fashion" },
];

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("totalVolume");
  const [category, setCategory] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  // Build filter params properly
  const filterParams = useMemo(() => {
    const params: any = {
      search: searchQuery || undefined,
      sortBy,
      sortOrder: "desc",
      page,
      limit: 12,
    };

    // Only add category if it's not "all"
    if (category !== "all") {
      params.category = category;
    }

    // Only add verified if it's true
    if (verifiedOnly) {
      params.verified = "true";
    }

    return params;
  }, [searchQuery, sortBy, category, verifiedOnly, page]);

  const { collections, loading, error, pagination, refetch } =
    useCollections(filterParams);

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label ||
    "Recently Created";

  const handleLoadMore = () => {
    if (pagination && page < pagination.pages) {
      setPage(page + 1);
    }
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page when searching
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setPage(1); // Reset to first page when changing category
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
    setPage(1); // Reset to first page when changing sort
  }, []);

  const handleVerifiedChange = useCallback((value: boolean) => {
    setVerifiedOnly(value);
    setPage(1); // Reset to first page when changing verified filter
  }, []);

  const stats = useMemo(() => {
    if (!collections.length) return null;

    const totalVolume = collections.reduce(
      (sum, col) => sum + (col.totalVolume || 0),
      0
    );
    const avgFloor =
      collections.reduce((sum, col) => sum + (col.floorPrice || 0), 0) /
      collections.length;
    const totalItems = collections.reduce(
      (sum, col) => sum + (col.totalItems || 0),
      0
    );

    return { totalVolume, avgFloor, totalItems };
  }, [collections]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="pt-24 px-4 sm:px-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Failed to load collections
            </h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
        <HomeFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <div className="pt-24 px-4 sm:px-10 min-h-screen">
        <div className="container mx-auto py-8">
          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Explore Collections
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Discover amazing NFT collections from talented creators and
              established artists
            </p>
          </motion.div>

          {/* Stats Bar */}
          {stats && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                <div className="text-2xl font-bold text-white">
                  {stats.totalVolume.toFixed(1)} ETH
                </div>
                <div className="text-slate-400 text-sm">Total Volume</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                <div className="text-2xl font-bold text-white">
                  {stats.avgFloor.toFixed(2)} ETH
                </div>
                <div className="text-slate-400 text-sm">Average Floor</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                <div className="text-2xl font-bold text-white">
                  {stats.totalItems}
                </div>
                <div className="text-slate-400 text-sm">Total Items</div>
              </div>
            </motion.div>
          )}

          {/* Search and Controls */}
          <motion.div
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 p-6 bg-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 h-12 bg-slate-800/50 border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 text-white placeholder-slate-400 rounded-xl"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <CollectionFilters
                sortBy={sortBy}
                setSortBy={handleSortChange}
                category={category}
                setCategory={handleCategoryChange}
                verifiedOnly={verifiedOnly}
                setVerifiedOnly={handleVerifiedChange}
                sortOptions={SORT_OPTIONS}
                categoryOptions={CATEGORY_OPTIONS}
                currentSortLabel={currentSortLabel}
              />

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 h-8 ${
                    viewMode === "grid"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400"
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
                      ? "bg-slate-700 text-white"
                      : "text-slate-400"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Debug Info */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-4 p-4 bg-slate-800/50 rounded-lg">
              <div className="text-sm text-slate-400">
                Debug: Loading: {loading.toString()}, Collections:{" "}
                {collections.length}, Params: {JSON.stringify(filterParams)}
              </div>
            </div>
          )}

          {/* Collections Grid */}
          <CollectionGrid
            collections={collections}
            loading={loading}
            viewMode={viewMode}
          />

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
                Load More Collections
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <HomeFooter />
    </div>
  );
}
