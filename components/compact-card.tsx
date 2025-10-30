"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Eye, TrendingUp, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NFTItem } from "@/lib/types";
import { getCategoryById } from "@/lib/mocks";
import { useSession } from "next-auth/react";

export function CompactNFTCard({
  nft,
  index,
  categoryColor = "bg-blue-600",
}: {
  nft: NFTItem;
  index: number;
  categoryColor?: string;
}) {
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Get category for additional data
  const category = getCategoryById(nft.category);
  const displayColor = category?.color || categoryColor;

  // Format price for display
  const formatPrice = (price: number) => {
    return `${price.toFixed(1)} ETH`;
  };

  // Format time left (mock data - you might want to calculate this based on actual data)
  const getTimeLeft = (index: number) => {
    const hours = (index % 24) + 1;
    const minutes = 60 - ((index * 5) % 60);
    return `${hours}h ${minutes}m`;
  };

  // Handle buy button click
  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === "loading") {
      return; // Still loading authentication state
    }

    if (!session) {
      // User not authenticated, redirect to login with NFT data in URL
      const nftData = encodeURIComponent(
        JSON.stringify({
          id: nft.id,
          name: nft.name,
          price: nft.listPrice,
          image: nft.image,
          collectionName: nft.collection?.name,
          currency: nft.currency,
        })
      );

      router.push(`/login?redirect=/dashboard/purchase&nft=${nftData}`);
      return;
    }

    // User is authenticated, redirect to purchase page with NFT data
    const nftData = encodeURIComponent(
      JSON.stringify({
        id: nft.id,
        name: nft.name,
        price: nft.listPrice,
        image: nft.image,
        collectionName: nft.collection?.name,
        currency: nft.currency,
        owner: nft.owner?.username || `User ${nft.ownerId}`,
        description: nft.description,
        rarity: nft.rarity,
        attributes: nft.attributes,
      })
    );

    router.push(`/dashboard/purchase?nft=${nftData}`);
  };

  // Handle card click (for viewing NFT details)
  const handleCardClick = (e: React.MouseEvent) => {
    // If buy button was clicked, don't navigate to NFT details
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/nft/${nft.id}`);
  };

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
      <Card
        className="border-gray-200 bg-white overflow-hidden relative h-full shadow-sm hover:shadow-md transition-shadow pt-0"
        onClick={handleCardClick}
      >
        <div className="relative p-2 pt-0 h-full flex flex-col">
          {/* NFT Image Container */}
          <div className="relative aspect-square overflow-hidden rounded-lg mb-3 border border-gray-100">
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
                className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-700 flex items-center gap-1 border border-gray-200"
                whileHover={{ scale: 1.05 }}
              >
                <Clock className="h-3 w-3" />
                {getTimeLeft(index)}
              </motion.div>

              {/* Like Button */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLiked(!liked);
                }}
                className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 hover:bg-gray-100 transition-colors border border-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={liked ? "liked" : "unliked"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                    }}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${
                        liked ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Rarity Badge */}
            <motion.div
              className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-700 z-10 border border-gray-200"
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
                className="h-7 w-7 p-0 bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-300"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/nft/${nft.id}`);
                }}
              >
                <Eye className="h-3 w-3 text-gray-700" />
              </Button>
            </motion.div>
          </div>

          {/* NFT Info - Compact */}
          <div className="flex-1 flex flex-col justify-between p-2">
            <div>
              {/* Collection Name */}
              <p className="text-xs text-gray-500 mb-1 truncate">
                {nft.collection?.name || `Collection ${nft.collectionId}`}
              </p>

              {/* NFT Name */}
              <motion.h3
                className="font-bold text-gray-900 text-sm mb-1 truncate"
                animate={{
                  color: isHovered ? `#2563eb` : "#111827",
                }}
              >
                {nft.name}
              </motion.h3>

              {/* Creator */}
              <p className="text-xs text-gray-500 mb-2">
                by {nft.owner?.username || `User ${nft.ownerId}`}
              </p>
            </div>

            {/* Stats & Price */}
            <div className="space-y-2">
              {/* Stats Row */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>
                    {nft.views.toLocaleString("en-GB", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{nft.likes}</span>
                </div>
              </div>

              {/* Price & Buy Button */}
              <motion.div
                className="flex items-center justify-between pt-2 border-t border-gray-200"
                animate={{ y: isHovered ? -2 : 0 }}
              >
                <div>
                  <div className="text-xs text-gray-500">Price</div>
                  <div className="text-sm font-bold text-gray-900">
                    {nft.isListed && nft.listPrice
                      ? formatPrice(nft.listPrice)
                      : "Not Listed"}
                  </div>
                </div>

                {nft.isListed && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <Button
                      size="sm"
                      className="text-xs h-7 px-3 text-white bg-blue-600 hover:bg-blue-700 border-0 gap-1"
                      onClick={handleBuyClick}
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Buy
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
