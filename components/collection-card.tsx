"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Eye, Zap, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function CollectionCard({
  collection,
  index,
}: {
  collection: any;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <Card className="border-slate-700/50 bg-slate-900/40 backdrop-blur-xl overflow-hidden relative h-full">
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"
          style={{
            background: `linear-gradient(45deg, ${collection.gradient}, transparent 50%)`,
            filter: "blur(20px)",
          }}
        />

        <div className="relative p-3 h-full flex flex-col">
          {/* Collection Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <motion.h3
                className="font-bold text-white text-lg truncate mb-1"
                animate={{
                  color: isHovered
                    ? `hsl(var(${collection.gradient}))`
                    : "white",
                }}
              >
                {collection.name}
              </motion.h3>
              <p className="text-slate-400 text-sm truncate">
                by {collection.creator}
              </p>
            </div>

            {/* Time Badge */}
            <motion.div
              className="bg-slate-800/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-white flex items-center gap-1 flex-shrink-0 ml-2"
              whileHover={{ scale: 1.05 }}
            >
              <Clock className="h-3 w-3" />
              {collection.timeLeft}
            </motion.div>
          </div>

          {/* Collection Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
            <motion.div
              className="absolute inset-0 opacity-20 z-10"
              style={{
                background: `linear-gradient(45deg, ${collection.gradient})`,
              }}
            />

            <motion.img
              src={collection.image}
              alt={collection.name}
              className="w-full h-full object-cover relative z-0"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.4 }}
            />

            {/* Floor Price Badge */}
            <motion.div
              className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-white z-20"
              whileHover={{ scale: 1.05 }}
            >
              {collection.floorPrice} floor
            </motion.div>

            {/* Quick Actions on Hover */}
            <motion.div
              className="absolute inset-0 bg-slate-900/60 flex items-center justify-center z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <Button className="gap-2 bg-white text-slate-900 hover:bg-slate-200 text-sm">
                <Eye className="h-4 w-4" />
                View Collection
              </Button>
            </motion.div>
          </div>

          {/* Collection Stats */}
          <div className="space-y-3">
            {/* Volume & Change */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 mb-1">Volume</div>
                <div className="text-sm font-bold text-white">
                  {collection.volume}
                </div>
              </div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm font-bold text-green-400">
                  {collection.change}
                </span>
              </motion.div>
            </div>

            {/* Additional Stats */}
            <div className="flex justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{collection.owners} owners</span>
              </div>
              <div>
                <span>{collection.items} items</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
