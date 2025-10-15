"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Zap, Clock, Eye, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function CompactNFTCard({
  nft,
  index,
  categoryColor = "from-blue-500 to-purple-600",
}: {
  nft: any;
  index: number;
  categoryColor?: string;
}) {
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <Card className="border-slate-700/50 bg-slate-900/40 backdrop-blur-xl overflow-hidden relative h-full">
        {/* Glow Effect with Category Color */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"
          style={{
            background: `linear-gradient(45deg, ${categoryColor}, transparent 50%)`,
            filter: "blur(20px)",
          }}
        />

        <div className="relative p-2 h-full flex flex-col">
          {/* NFT Image Container */}
          <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
            {/* Gradient Overlay with Category Color */}
            <motion.div
              className="absolute inset-0 opacity-20 z-0"
              style={{
                background: `linear-gradient(45deg, ${categoryColor})`,
              }}
            />

            {/* NFT Image */}
            <motion.img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover relative z-0"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.4 }}
            />

            {/* Top Overlay */}
            <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start z-10">
              {/* Time Badge */}
              <motion.div
                className="bg-slate-900/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-white flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <Clock className="h-3 w-3" />
                {nft.timeLeft}
              </motion.div>

              {/* Like Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                }}
                className="bg-slate-900/90 backdrop-blur-sm rounded-full p-1.5 hover:bg-slate-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={liked ? "liked" : "unliked"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${
                        liked ? "fill-red-500 text-red-500" : "text-white"
                      }`}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Rarity Badge */}
            <motion.div
              className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-white z-10"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 + 0.3 }}
            >
              {nft.rarity}
            </motion.div>

            {/* Quick Actions on Hover */}
            <motion.div
              className="absolute bottom-2 right-2 flex gap-1 z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="sm"
                className="h-7 w-7 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0"
              >
                <Eye className="h-3 w-3" />
              </Button>
              {/* <Button
                size="sm"
                className="h-7 w-7 p-0 bg-blue-500/90 backdrop-blur-sm hover:bg-blue-600 border-0"
              >
                <Zap className="h-3 w-3" />
              </Button> */}
            </motion.div>
          </div>

          {/* NFT Info - Compact */}
          <div className="flex-1 flex flex-col justify-between p-2">
            <div>
              {/* Collection Name: render collection.name or fallback to collection id or 'Unknown' */}
              <p className="text-xs text-slate-400 mb-1 truncate">
                {nft.collection?.name ??
                  nft.collection?.id ??
                  "Unknown Collection"}
              </p>

              {/* NFT Name */}
              <motion.h3
                className="font-bold text-white text-sm mb-1 truncate"
                animate={{
                  color: isHovered ? `hsl(var(${categoryColor}))` : "white",
                }}
              >
                {nft.name}
              </motion.h3>

              {/* Creator */}
              <p className="text-xs text-slate-500 mb-2">
                by {nft.creator ?? nft.collection?.creatorId ?? "unknown"}
              </p>
            </div>

            {/* Stats & Price */}
            <div className="space-y-2">
              {/* Stats Row */}
              <div className="flex justify-between items-center text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{nft.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{nft.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+24%</span>
                </div>
              </div>

              {/* Price & Buy Button */}
              <motion.div
                className="flex items-center justify-between pt-2 border-t border-slate-700/50"
                animate={{ y: isHovered ? -2 : 0 }}
              >
                <div>
                  <div className="text-xs text-slate-400">Price</div>
                  <div className="text-sm font-bold text-white">
                    {typeof nft.price === "number" ||
                    typeof nft.price === "string"
                      ? nft.price
                      : nft.listPrice ?? "—"}
                  </div>
                </div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  <Button
                    size="sm"
                    className="text-xs h-7 px-3 bg-blue-500 border-0"
                  >
                    Buy
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
