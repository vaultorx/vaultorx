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

const NFT_CATEGORIES = [
  {
    id: "gaming",
    name: "Gaming",
    icon: Gamepad2,
    color: "from-green-500 to-emerald-500",
    nfts: Array.from({ length: 10}, (_, i) => ({
      id: `gaming-${i + 1}`,
      name: `Game Asset #${i + 1}`,
      collection: "Metaverse Games",
      price: `${(0.5 + i * 0.3).toFixed(1)} ETH`,
      likes: 150 + i * 50,
      image: "/placeholder.svg",
      timeLeft: `${i + 1}h ${30 - i * 5}m`,
      gradient: "from-green-500 to-emerald-500",
      creator: "GameStudio",
      rarity: i === 0 ? "Legendary" : i === 1 ? "Epic" : "Rare",
      views: `${1.2 + i * 0.3}K`,
    })),
  },
  {
    id: "art",
    name: "Digital Art",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    nfts: Array.from({ length: 10}, (_, i) => ({
      id: `art-${i + 1}`,
      name: `Digital Canvas #${i + 1}`,
      collection: "Abstract Dreams",
      price: `${(1.2 + i * 0.4).toFixed(1)} ETH`,
      likes: 200 + i * 60,
      image: "/placeholder.svg",
      timeLeft: `${i + 2}h ${45 - i * 8}m`,
      gradient: "from-purple-500 to-pink-500",
      creator: "DigitalArtist",
      rarity: i === 0 ? "Legendary" : i === 1 ? "Epic" : "Rare",
      views: `${2.1 + i * 0.4}K`,
    })),
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    color: "from-amber-500 to-orange-500",
    nfts: Array.from({ length: 10}, (_, i) => ({
      id: `photo-${i + 1}`,
      name: `Moment #${i + 1}`,
      collection: "Urban Shots",
      price: `${(0.8 + i * 0.2).toFixed(1)} ETH`,
      likes: 120 + i * 40,
      image: "/placeholder.svg",
      timeLeft: `${i + 3}h ${20 - i * 3}m`,
      gradient: "from-amber-500 to-orange-500",
      creator: "PhotoArtist",
      rarity: i === 0 ? "Legendary" : i === 1 ? "Epic" : "Rare",
      views: `${1.5 + i * 0.2}K`,
    })),
  },
  {
    id: "3d",
    name: "3D Art",
    icon: Cuboid,
    color: "from-blue-500 to-cyan-500",
    nfts: Array.from({ length: 10}, (_, i) => ({
      id: `3d-${i + 1}`,
      name: `Sculpture #${i + 1}`,
      collection: "3D Dimensions",
      price: `${(1.5 + i * 0.5).toFixed(1)} ETH`,
      likes: 180 + i * 70,
      image: "/placeholder.svg",
      timeLeft: `${i + 4}h ${15 - i * 2}m`,
      gradient: "from-blue-500 to-cyan-500",
      creator: "3DArtist",
      rarity: i === 0 ? "Legendary" : i === 1 ? "Epic" : "Rare",
      views: `${2.8 + i * 0.5}K`,
    })),
  },
  {
    id: "animated",
    name: "Animated",
    icon: Zap,
    color: "from-yellow-500 to-red-500",
    nfts: Array.from({ length: 10}, (_, i) => ({
      id: `animated-${i + 1}`,
      name: `Motion #${i + 1}`,
      collection: "Moving Art",
      price: `${(2.1 + i * 0.6).toFixed(1)} ETH`,
      likes: 250 + i * 80,
      image: "/placeholder.svg",
      timeLeft: `${i + 1}h ${50 - i * 10}m`,
      gradient: "from-yellow-500 to-red-500",
      creator: "Animator",
      rarity: i === 0 ? "Legendary" : i === 1 ? "Epic" : "Rare",
      views: `${3.2 + i * 0.6}K`,
    })),
  },
  {
    id: "collectibles",
    name: "Collectibles",
    icon: Users,
    color: "from-indigo-500 to-purple-500",
    nfts: Array.from({ length: 10}, (_, i) => ({
      id: `collectible-${i + 1}`,
      name: `Collector #${i + 1}`,
      collection: "Rare Items",
      price: `${(0.9 + i * 0.3).toFixed(1)} ETH`,
      likes: 140 + i * 45,
      image: "/placeholder.svg",
      timeLeft: `${i + 2}h ${25 - i * 4}m`,
      gradient: "from-indigo-500 to-purple-500",
      creator: "CollectorHub",
      rarity: i === 0 ? "Legendary" : i === 1 ? "Epic" : "Rare",
      views: `${1.8 + i * 0.3}K`,
    })),
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    color: "from-pink-500 to-rose-500",
    nfts: Array.from({ length: 10}, (_, i) => ({
      id: `music-${i + 1}`,
      name: `Track #${i + 1}`,
      collection: "Audio Waves",
      price: `${(1.1 + i * 0.4).toFixed(1)} ETH`,
      likes: 170 + i * 55,
      image: "/placeholder.svg",
      timeLeft: `${i + 3}h ${35 - i * 6}m`,
      gradient: "from-pink-500 to-rose-500",
      creator: "MusicProducer",
      rarity: i === 0 ? "Legendary" : i === 1 ? "Epic" : "Rare",
      views: `${2.3 + i * 0.4}K`,
    })),
  },
  {
    id: "pfps",
    name: "PFPs",
    icon: Users,
    color: "from-teal-500 to-green-500",
    nfts: Array.from({ length: 10}, (_, i) => ({
      id: `pfp-${i + 1}`,
      name: `Avatar #${i + 1}`,
      collection: "Profile Pics",
      price: `${(0.7 + i * 0.2).toFixed(1)} ETH`,
      likes: 130 + i * 35,
      image: "/placeholder.svg",
      timeLeft: `${i + 1}h ${40 - i * 8}m`,
      gradient: "from-teal-500 to-green-500",
      creator: "PFPFactory",
      rarity: i === 0 ? "Legendary" : i === 1 ? "Epic" : "Rare",
      views: `${1.6 + i * 0.2}K`,
    })),
  },
  {
    id: "sports",
    name: "Sports",
    icon: Trophy,
    color: "from-red-500 to-orange-500",
    nfts: Array.from({ length: 10}, (_, i) => ({
      id: `sports-${i + 1}`,
      name: `Moment #${i + 1}`,
      collection: "Sports Highlights",
      price: `${(1.8 + i * 0.5).toFixed(1)} ETH`,
      likes: 220 + i * 65,
      image: "/placeholder.svg",
      timeLeft: `${i + 2}h ${55 - i * 11}m`,
      gradient: "from-red-500 to-orange-500",
      creator: "SportsNFT",
      rarity: i === 0 ? "Legendary" : i === 1 ? "Epic" : "Rare",
      views: `${2.9 + i * 0.5}K`,
    })),
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: Shirt,
    color: "from-fuchsia-500 to-purple-500",
    nfts: Array.from({ length: 10}, (_, i) => ({
      id: `fashion-${i + 1}`,
      name: `Wearable #${i + 1}`,
      collection: "Digital Fashion",
      price: `${(1.4 + i * 0.4).toFixed(1)} ETH`,
      likes: 190 + i * 60,
      image: "/placeholder.svg",
      timeLeft: `${i + 4}h ${10 - i * 1}m`,
      gradient: "from-fuchsia-500 to-purple-500",
      creator: "FashionHouse",
      rarity: i === 0 ? "Legendary" : i === 1 ? "Epic" : "Rare",
      views: `${2.5 + i * 0.4}K`,
    })),
  },
];

export function TrendingNFTs() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCategories, setVisibleCategories] = useState(4);

  const filteredCategories =
    activeCategory === "all"
      ? NFT_CATEGORIES
      : NFT_CATEGORIES.filter((cat) => cat.id === activeCategory);

  const showMoreCategories = () => {
    setVisibleCategories((prev) => Math.min(prev + 4, NFT_CATEGORIES.length));
  };

  return (
    <section className="py-20 bg-gradient-to-b px-8 pt-24 sm:px-16 from-slate-950 to-blue-950/30 relative overflow-hidden">
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

          {NFT_CATEGORIES.slice(0, visibleCategories).map((category) => (
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

          {visibleCategories < NFT_CATEGORIES.length && (
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
                    <motion.div
                      className={`h-12 w-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <category.icon className="h-6 w-6 text-white" />
                    </motion.div>
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
        {activeCategory === "all" && NFT_CATEGORIES.length > 4 && (
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
