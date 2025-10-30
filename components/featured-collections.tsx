"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Eye, Zap, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useCollectionStats } from "@/hooks/use-collections";
import Link from "next/link";
import { CollectionCard } from "@/app/(marketplace)/collections/components/collection-card";

export function FeaturedCollections() {
  const { stats, loading } = useCollectionStats();

  const featuredCollections = stats?.slice(0, 5) || [];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Simple Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
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
            className="inline-flex items-center gap-2 text-blue-600 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="h-5 w-5" />
            <span className="font-semibold">TRENDING COLLECTIONS</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured <span className="text-blue-600">Drops</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated selection of this week's most promising NFT collections
          </p>
        </motion.div>

        {/* Compact Grid Layout */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {featuredCollections.map((collection, index) => (
              <CollectionCard
                key={collection.id}
                collection={collection as any}
                index={index}
                viewMode="grid"
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
          <Link href="/collections">
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 gap-3 h-12 px-8"
            >
              View All Collections
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
