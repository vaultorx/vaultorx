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
  Ticket,
  Shirt,
  Trophy,
  Badge,
  Cuboid,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { CompactNFTCard } from "./compact-card";
import { Button } from "@/components/ui/button";
import { nftCatgories } from "@/lib/mocks";


export function TrendingNFTs() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCategories, setVisibleCategories] = useState(4);

  const filteredCategories =
    activeCategory === "all"
      ? nftCatgories
      : nftCatgories.filter((cat) => cat.id === activeCategory);

  const showMoreCategories = () => {
    setVisibleCategories((prev) => Math.min(prev + 4, nftCatgories.length));
  };

  return (
    <section className="py-20 bg-gradient-to-b px-8 pt-24 sm:px-16 from-slate-950 to-slate-700 relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-cyan-400 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">TRENDING BY CATEGORY</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
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
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                : "text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50"
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory("all")}
          >
            <Sparkles className="h-4 w-4" />
            All Categories
          </motion.button>

          {nftCatgories.slice(0, visibleCategories).map((category) => (
            <motion.button
              key={category.id}
              className={`px-4 py-3 rounded-xl font-medium text-sm capitalize transition-all flex items-center gap-2 ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg shadow-blue-500/25`
                  : "text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50"
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </motion.button>
          ))}

          {visibleCategories < nftCatgories.length && (
            <motion.button
              className="px-4 py-3 rounded-xl font-medium text-sm text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all flex items-center gap-2"
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
          {filteredCategories
            .slice(0, activeCategory === "all" ? 4 : 10)
            .map((category, categoryIndex) => (
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
                      <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {category.name}
                      </h3>
                      <p className="text-slate-400">
                        Trending in {category.name}
                      </p>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
                    >
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>

                {/* NFT Grid for Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {category.nfts.map((nft, nftIndex) => (
                    <CompactNFTCard
                      key={nft.id}
                      nft={nft}
                      index={nftIndex}
                      categoryColor={category.color}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
        </div>

        {/* Show More Button for All Categories View */}
        {activeCategory === "all" && nftCatgories.length > 4 && (
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
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-3"
              onClick={() => setActiveCategory("art")} // Or implement a different view
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
