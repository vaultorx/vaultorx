"use client";

import {
  Sparkles,
  ArrowRight,
  Gamepad2,
  Palette,
  Camera,
  Zap,
  Users,
  Music,
  Shirt,
  Trophy,
  Cuboid,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { CompactNFTCard } from "./compact-card";
import { Button } from "@/components/ui/button";
import { useCategories, useCategoryNFTs } from "@/hooks/use-categories";
import Link from "next/link";

// Icon mapping for categories
const CATEGORY_ICONS: { [key: string]: any } = {
  gaming: Gamepad2,
  art: Palette,
  photography: Camera,
  "3d": Cuboid,
  animated: Zap,
  collectibles: Users,
  music: Music,
  pfps: Users,
  sports: Trophy,
  fashion: Shirt,
};

export function TrendingNFTs() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCategories, setVisibleCategories] = useState(6);

  const { categories, loading: categoriesLoading } = useCategories();
  const { nfts: categoryNFTs, loading: nftsLoading } = useCategoryNFTs(
    activeCategory === "all" ? "" : activeCategory,
    5
  );

  const showMoreCategories = () => {
    setVisibleCategories((prev) => Math.min(prev + 4, categories.length));
  };

  // Get categories to display based on active filter
  const displayCategories =
    activeCategory === "all"
      ? categories.slice(0, 4)
      : categories.filter((cat) => cat.id === activeCategory);

  // Get NFTs to display
  const displayNFTs =
    activeCategory === "all"
      ? displayCategories.flatMap((cat) => cat.nfts || []).slice(0, 5)
      : categoryNFTs;

  if (categoriesLoading) {
    return (
      <section className="py-20 bg-white px-8 pt-24 sm:px-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="h-12 w-12 border-4 border-gray-300 border-t-blue-600 rounded-full"
            />
          </div>
          <p className="text-gray-600 mt-4">Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white px-8 pt-24 sm:px-16 relative overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gray-50/50" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-blue-600 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">TRENDING BY CATEGORY</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore <span className="text-blue-600">Categories</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover trending NFTs across different categories and find your
            next digital asset
          </p>
        </motion.div>

        {/* Enhanced Category Filter Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.button
            key="all"
            className={`px-4 py-3 rounded-xl font-medium text-sm capitalize transition-all flex items-center gap-2 ${
              activeCategory === "all"
                ? "shadow-md"
                : "text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200"
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory("all")}
          >
            <Sparkles className="h-4 w-4" />
            All Categories
          </motion.button>

          {categories.slice(0, visibleCategories).map((category) => {
            return (
              <motion.button
                key={category.id}
                className={`px-4 py-3 rounded-xl font-medium text-sm capitalize transition-all flex items-center gap-2 ${
                  activeCategory === category.id
                    ? `shadow-md`
                    : "text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </motion.button>
            );
          })}

          {visibleCategories < categories.length && (
            <motion.button
              className="px-4 py-3 rounded-xl font-medium text-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={showMoreCategories}
            >
              <ArrowRight className="h-4 w-4" />
              More
            </motion.button>
          )}
        </motion.div>

        {/* Category Sections */}
        <div className="space-y-16">
          {displayCategories.map((category, categoryIndex) => {
            return (
              <motion.section
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-gray-600">
                        {category?.nftCount} NFTs available
                      </p>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link href={`/nft?category=${category.id}`}>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 gap-2"
                      >
                        View All
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>

                {/* NFT Grid for Category */}
                {nftsLoading && activeCategory === category.id ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {(activeCategory === "all" ? category.nfts : displayNFTs)
                      .slice(0, 5)
                      .map((nft, nftIndex) => (
                        <CompactNFTCard
                          key={nft.id}
                          nft={nft}
                          index={nftIndex}
                          categoryColor="bg-blue-600"
                        />
                      ))}
                  </div>
                )}
              </motion.section>
            );
          })}
        </div>

        {/* Show More Button for All Categories View */}
        {activeCategory === "all" && categories.length > 4 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 gap-3"
              onClick={() => setActiveCategory(categories[0]?.id || "art")}
            >
              Explore All Categories
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
