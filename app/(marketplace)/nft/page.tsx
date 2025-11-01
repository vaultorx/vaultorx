"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { HomeFooter } from "@/components/home-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  Sparkles,
  TrendingUp,
  Clock,
  Heart,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Category data matching your existing structure
const CATEGORIES = [
  { id: "gaming", name: "Gaming", icon: "🎮" },
  { id: "art", name: "Digital Art", icon: "🎨" },
  { id: "photography", name: "Photography", icon: "📷" },
  { id: "music", name: "Music", icon: "🎵" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "fashion", name: "Fashion", icon: "👕" },
  { id: "3d", name: "3D Art", icon: "🔷" },
  { id: "animated", name: "Animated", icon: "⚡" },
  { id: "collectibles", name: "Collectibles", icon: "👥" },
  { id: "pfps", name: "Profile Pictures", icon: "👤" },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "most-liked", label: "Most Liked" },
  { value: "most-viewed", label: "Most Viewed" },
  { value: "rare", label: "Rarity" },
];

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  listPrice: number;
  currency: string;
  isListed: boolean;
  likes: number;
  views: number;
  rarity: string;
  category: string;
  collection: {
    id: string;
    name: string;
    verified: boolean;
  };
  owner: {
    id: string;
    username: string;
  };
  createdAt: string;
}

export default function NFTsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial category from URL params
  const initialCategory = searchParams.get("category") || "all";

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showListedOnly, setShowListedOnly] = useState(false);

  // Fetch NFTs based on filters
  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "all")
          params.append("category", selectedCategory);
        if (searchQuery) params.append("search", searchQuery);
        if (sortBy) params.append("sortBy", sortBy);
        if (showListedOnly) params.append("listed", "true");
        if (priceRange.min) params.append("minPrice", priceRange.min);
        if (priceRange.max) params.append("maxPrice", priceRange.max);

        const response = await fetch(`/api/nfts?${params}`);
        const data = await response.json();

        if (data.success) {
          setNfts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [selectedCategory, searchQuery, sortBy, showListedOnly, priceRange]);

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    const newUrl = params.toString() ? `/nft?${params.toString()}` : "/nft";
    router.replace(newUrl, { scroll: false });
  }, [selectedCategory, router]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("recent");
    setPriceRange({ min: "", max: "" });
    setShowListedOnly(false);
  };

  const formatPrice = (price: number) => {
    return `${price?.toFixed(2) || "0.00"} ETH`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case "legendary":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "epic":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "rare":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-10 pb-16">
        {/* Hero Section */}
        <section className="bg-slate-50 py-14">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Explore NFTs
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Discover unique digital assets across all categories. Find your
                next collectible, artwork, or investment.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search NFTs, collections, or creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <div className="lg:w-80 space-y-6">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden">
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full justify-between"
                    variant="outline"
                  >
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </span>
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Filters Panel */}
                <motion.div
                  className={`space-y-6 ${
                    showFilters ? "block" : "hidden lg:block"
                  }`}
                  initial={false}
                  animate={{ height: showFilters ? "auto" : "auto" }}
                >
                  {/* Categories */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Categories
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === "all"
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        All Categories
                      </button>
                      {CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                            selectedCategory === category.id
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span>{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Price Range
                    </h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min ETH"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              min: e.target.value,
                            }))
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Max ETH"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              max: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showListedOnly}
                        onChange={(e) => setShowListedOnly(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">
                        Listed for Sale Only
                      </span>
                    </label>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear All Filters
                  </Button>
                </motion.div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <p className="text-gray-600">
                      Showing{" "}
                      <span className="font-semibold text-gray-900">
                        {nfts.length}
                      </span>{" "}
                      results
                      {selectedCategory !== "all" && (
                        <span>
                          {" "}
                          in{" "}
                          <span className="font-semibold text-gray-900">
                            {
                              CATEGORIES.find((c) => c.id === selectedCategory)
                                ?.name
                            }
                          </span>
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {/* View Toggle */}
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 ${
                          viewMode === "grid"
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 ${
                          viewMode === "list"
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* NFTs Grid/List */}
                {!loading && (
                  <>
                    {nfts.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No NFTs found
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Try adjusting your filters or search terms
                        </p>
                        <Button onClick={clearFilters}>
                          Clear All Filters
                        </Button>
                      </div>
                    ) : viewMode === "grid" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {nfts.map((nft, index) => (
                          <motion.div
                            key={nft.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => router.push(`/nft/${nft.id}`)}
                          >
                            <div className="aspect-square relative overflow-hidden">
                              <img
                                src={nft.image || "/placeholder-nft.png"}
                                alt={nft.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-3 left-3">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getRarityColor(
                                    nft.rarity
                                  )}`}
                                >
                                  {nft.rarity || "Common"}
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {nft.name}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {nft.description}
                              </p>
                              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                <span>{nft.collection.name}</span>
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {nft.views}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    {nft.likes}
                                  </span>
                                </div>
                              </div>
                              {nft.isListed && nft.listPrice ? (
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      Price
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                      {formatPrice(nft.listPrice)}
                                    </p>
                                  </div>
                                  <Button size="sm">Buy Now</Button>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  Not listed
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {nfts.map((nft, index) => (
                          <motion.div
                            key={nft.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => router.push(`/nft/${nft.id}`)}
                          >
                            <div className="flex gap-4">
                              <img
                                src={nft.image || "/placeholder-nft.png"}
                                alt={nft.name}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">
                                      {nft.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {nft.collection.name}
                                      
                                    </p>
                                  </div>
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getRarityColor(
                                      nft.rarity
                                    )}`}
                                  >
                                    {nft.rarity || "Common"}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {nft.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Eye className="h-3 w-3" />
                                      {nft.views} views
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Heart className="h-3 w-3" />
                                      {nft.likes} likes
                                    </span>
                                  </div>
                                  {nft.isListed && nft.listPrice ? (
                                    <div className="text-right">
                                      <p className="text-sm text-gray-600">
                                        Price
                                      </p>
                                      <p className="font-semibold text-gray-900">
                                        {formatPrice(nft.listPrice)}
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500">
                                      Not listed
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
