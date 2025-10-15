"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Eye, Zap, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { CollectionCard } from "./collection-card";

const FEATURED_COLLECTIONS = [
  {
    id: 1,
    name: "Quantum Abstracts",
    creator: "AI Studios",
    floorPrice: "2.5 ETH",
    volume: "1,234 ETH",
    change: "+45.2%",
    image: "/placeholder.svg",
    gradient: "from-blue-500 to-cyan-500",
    items: "10K",
    owners: "3.2K",
    timeLeft: "2d 5h",
  },
  {
    id: 2,
    name: "Neural Dreams",
    creator: "Neuro Art",
    floorPrice: "1.8 ETH",
    volume: "892 ETH",
    change: "+32.1%",
    image: "/placeholder.svg",
    gradient: "from-purple-500 to-pink-500",
    items: "8.5K",
    owners: "2.7K",
    timeLeft: "1d 8h",
  },
  {
    id: 3,
    name: "Cyber Genesis",
    creator: "Tech Artists",
    floorPrice: "3.2 ETH",
    volume: "2,156 ETH",
    change: "+58.7%",
    image: "/placeholder.svg",
    gradient: "from-orange-500 to-red-500",
    items: "12.3K",
    owners: "4.1K",
    timeLeft: "3d 12h",
  },
  {
    id: 4,
    name: "Pixel Pioneers",
    creator: "Retro Labs",
    floorPrice: "0.9 ETH",
    volume: "654 ETH",
    change: "+21.4%",
    image: "/placeholder.svg",
    gradient: "from-green-500 to-lime-500",
    items: "7K",
    owners: "2.1K",
    timeLeft: "4d 3h",
  },
  {
    id: 5,
    name: "Meta Morphs",
    creator: "Morph Studio",
    floorPrice: "2.1 ETH",
    volume: "1,045 ETH",
    change: "+39.8%",
    image: "/placeholder.svg",
    gradient: "from-teal-500 to-blue-400",
    items: "9.2K",
    owners: "2.9K",
    timeLeft: "5d 6h",
  },
];

export function FeaturedCollections() {
  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
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
            className="inline-flex items-center gap-2 text-blue-400 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="h-5 w-5" />
            <span className="font-semibold">TRENDING COLLECTIONS</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Drops
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Curated selection of this week's most promising NFT collections
          </p>
        </motion.div>

        {/* Compact Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {FEATURED_COLLECTIONS.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              index={index}
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
          <Button
            variant="outline"
            size="lg"
            className="border-slate-600 text-white hover:bg-slate-800 gap-3 h-12 px-8"
          >
            View All Collections
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
