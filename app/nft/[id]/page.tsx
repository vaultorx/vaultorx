"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { CompactNFTCard } from "@/components/compact-card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  Flag,
  Eye,
  Clock,
  Users,
  BadgeCheck,
  Copy,
  ExternalLink,
  Zap,
  Sparkles,
  Crown,
  Gem,
  Star,
  Palette,
  Layers,
  Shield,
  TrendingUp,
} from "lucide-react";

// Enhanced mock data
const mockNFT = {
  id: "nft-1",
  collectionId: "collection-1",
  tokenId: "1234",
  ownerId: "user-1",
  name: "Ethereal Dreams #1234",
  description:
    "A mesmerizing digital artwork that captures the essence of dreams and reality merging into one. This piece represents the intersection of consciousness and the digital realm, created with advanced generative algorithms and artistic vision. Each element is carefully crafted to evoke emotion and wonder.",
  image: "/placeholder.svg?height=800&width=800",
  ipfsMetadataUri: "ipfs://QmX7Y8Z9...",
  attributes: {
    Background: "Cosmic Purple",
    Eyes: "Laser Blue",
    Mouth: "Smile",
    Outfit: "Cyber Suit",
    Accessory: "Halo",
    Rarity: "Legendary",
  },
  properties: [
    {
      trait_type: "Background",
      value: "Cosmic Purple",
      rarity: "12%",
      score: 85,
    },
    { trait_type: "Eyes", value: "Laser Blue", rarity: "8%", score: 92 },
    { trait_type: "Mouth", value: "Smile", rarity: "15%", score: 78 },
    { trait_type: "Outfit", value: "Cyber Suit", rarity: "5%", score: 95 },
    { trait_type: "Accessory", value: "Halo", rarity: "3%", score: 98 },
    { trait_type: "Rarity", value: "Legendary", rarity: "2%", score: 99 },
  ],
  isListed: true,
  listPrice: 3.8,
  currency: "WETH",
  category: "art",
  rarity: "Legendary",
  likes: 1242,
  views: 8456,
  createdAt: new Date("2025-08-01"),
  updatedAt: new Date(),
  creator: {
    name: "DigitalVisionary",
    verified: true,
    avatar: "/placeholder.svg?height=60&width=60",
    followers: 23450,
    bio: "Pioneering digital artist exploring the boundaries of reality and imagination.",
  },
  collection: {
    id: "collection-1",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    name: "Ethereal Dreams",
    symbol: "DREAM",
    creatorId: "user-1",
    royaltyPercentage: 5,
    totalVolume: 15000,
    totalItems: 10000,
    listedItems: 1200,
    blockchain: "Ethereum",
    createdAt: new Date(),
    updatedAt: new Date(),
    floorPrice: 2.5,
    description:
      "A collection of dreamlike digital artworks that transcend reality.",
  },
};

const mockTransactions = [
  {
    id: "tx-1",
    transactionHash:
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    nftItemId: "nft-1",
    fromUserId: "user-2",
    toUserId: "user-1",
    transactionType: "sale",
    price: 3.8,
    currency: "WETH",
    blockchain: "ethereum",
    status: "confirmed",
    createdAt: new Date("2025-10-10"),
  },
  {
    id: "tx-2",
    transactionHash:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    nftItemId: "nft-1",
    fromUserId: "user-3",
    toUserId: "user-2",
    transactionType: "sale",
    price: 2.9,
    currency: "WETH",
    blockchain: "ethereum",
    status: "confirmed",
    createdAt: new Date("2025-09-15"),
  },
  {
    id: "tx-3",
    transactionHash:
      "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
    nftItemId: "nft-1",
    transactionType: "mint",
    toUserId: "user-3",
    blockchain: "ethereum",
    status: "confirmed",
    createdAt: new Date("2025-08-01"),
  },
];

const mockRelatedNFTs = Array.from({ length: 8 }, (_, i) => ({
  id: `nft-related-${i + 1}`,
  collectionId: "collection-1",
  tokenId: `${i + 100}`,
  ownerId: `user-${i + 1}`,
  name: `Ethereal Dreams #${i + 100}`,
  description: "Another piece from the collection",
  image: `/placeholder.svg?height=400&width=400`,
  ipfsMetadataUri: `ipfs://metadata-${i + 1}`,
  isListed: true,
  listPrice: Number((Math.random() * 5 + 1).toFixed(2)),
  currency: "WETH",
  createdAt: new Date(),
  updatedAt: new Date(),
  category: "art",
  rarity: ["Common", "Rare", "Epic", "Legendary"][i % 4],
  likes: Math.floor(Math.random() * 1000),
  views: Math.floor(Math.random() * 5000),
  collection: mockNFT.collection,
}));

export default function NFTDetailPage() {
  const [activeTab, setActiveTab] = useState("description");
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState(mockNFT.image);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case "Epic":
        return <Sparkles className="h-4 w-4 text-purple-400" />;
      case "Rare":
        return <Gem className="h-4 w-4 text-blue-400" />;
      default:
        return <Star className="h-4 w-4 text-slate-400" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "from-yellow-500 to-amber-500";
      case "Epic":
        return "from-purple-500 to-pink-500";
      case "Rare":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left Column - Visual Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Enhanced Image Container */}
            <div className="relative group">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-12 w-12 border-4 border-slate-700 border-t-blue-500 rounded-full"
                    />
                  </div>
                )}
                <img
                  src={currentImage}
                  alt={mockNFT.name}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    imageLoaded
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                  } group-hover:scale-105`}
                  onLoad={() => setImageLoaded(true)}
                />

                {/* Enhanced Overlay Actions */}
                <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-12 w-12 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isLiked ? "fill-red-500 text-red-500" : "text-white"
                      }`}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-12 w-12 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors"
                  >
                    <Share2 className="h-5 w-5 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-12 w-12 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors"
                  >
                    <Flag className="h-5 w-5 text-white" />
                  </motion.button>
                </div>

                {/* Rarity Badge */}
                <div className="absolute top-6 left-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`bg-gradient-to-r ${getRarityColor(
                      mockNFT.rarity
                    )} text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg`}
                  >
                    {getRarityIcon(mockNFT.rarity)}
                    {mockNFT.rarity}
                  </motion.div>
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50"
                  >
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">Views</span>
                        </div>
                        <div className="text-white font-bold text-lg">
                          {mockNFT.views.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">Likes</span>
                        </div>
                        <div className="text-white font-bold text-lg">
                          {mockNFT.likes.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Created</span>
                        </div>
                        <div className="text-white font-bold text-sm">
                          {new Date(mockNFT.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50"
            >
              <h3 className="font-bold text-white text-xl mb-6 flex items-center gap-2">
                <Palette className="h-5 w-5 text-blue-400" />
                Properties
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockNFT.properties.map((property, index) => (
                  <motion.div
                    key={property.trait_type}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center group hover:border-slate-600 transition-colors"
                  >
                    <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                      {property.trait_type}
                    </div>
                    <div className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {property.value}
                    </div>
                    <div className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full inline-block">
                      {property.rarity} have this
                    </div>
                    <div className="mt-2 w-full bg-slate-700 rounded-full h-1">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${property.score}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Details and Actions */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Collection and NFT Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>{mockNFT.collection.name}</span>
                </div>
                <BadgeCheck className="h-4 w-4 text-blue-400" />
                <div className="h-1 w-1 bg-slate-600 rounded-full" />
                <span>Ethereum</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {mockNFT.name}
              </h1>

              {/* Creator Info */}
              <motion.div
                className="p-6 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={mockNFT.creator.avatar}
                    alt={mockNFT.creator.name}
                    className="h-14 w-14 rounded-full border-2 border-slate-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-400 text-sm">Creator</span>
                      {mockNFT.creator.verified && (
                        <BadgeCheck className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <div className="text-white font-semibold text-lg">
                      {mockNFT.creator.name}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {mockNFT.creator.followers.toLocaleString()} followers
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Follow
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Current Price and Actions */}
            <motion.div
              className="p-6 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-slate-400 text-sm mb-2">Current Price</div>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-white">
                  {mockNFT.listPrice} ETH
                </span>
                <span className="text-lg text-slate-400">
                  ${(mockNFT.listPrice * 3500).toLocaleString()}
                </span>
              </div>

              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg font-bold gap-3">
                    <Zap className="h-5 w-5" />
                    Buy Now
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-14 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-lg"
                  >
                    Make Offer
                  </Button>
                </motion.div>
              </div>

              {/* Market Data */}
              <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 text-sm">Floor Price</span>
                  <span className="text-green-400 font-semibold text-sm">
                    +
                    {(
                      ((mockNFT.listPrice - mockNFT.collection.floorPrice) /
                        mockNFT.collection.floorPrice) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">
                    {mockNFT.collection.floorPrice} ETH
                  </span>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
              </div>
            </motion.div>

            {/* Collection Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50"
            >
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                Collection Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {mockNFT.collection.totalItems.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">Total Items</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {mockNFT.collection.listedItems.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">Listed</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {mockNFT.collection.totalVolume.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">Volume (ETH)</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {mockNFT.collection.royaltyPercentage}%
                  </div>
                  <div className="text-xs text-slate-400">Royalty</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Details Tabs */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="border-b border-slate-700/50 mb-8">
            <div className="flex gap-8">
              {[
                {
                  id: "description",
                  label: "Description",
                  icon: <Sparkles className="h-4 w-4" />,
                },
                {
                  id: "details",
                  label: "Details",
                  icon: <Shield className="h-4 w-4" />,
                },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  className={`pb-4 px-1 font-semibold transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "text-white border-blue-500"
                      : "text-slate-400 border-transparent hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -2 }}
                >
                  {tab.icon}
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="prose prose-invert max-w-none"
            >
              {activeTab === "description" && (
                <div className="text-slate-300 leading-relaxed text-lg space-y-4">
                  <p>{mockNFT.description}</p>
                  <p>
                    This unique piece combines traditional artistic principles
                    with cutting-edge digital technology, creating a timeless
                    masterpiece that bridges the physical and digital worlds.
                  </p>
                </div>
              )}

              {activeTab === "details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-700/50">
                      <div className="text-sm text-slate-400 mb-2">
                        Contract Address
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-white font-mono text-sm">
                          {mockNFT.collection.contractAddress.slice(0, 8)}...
                          {mockNFT.collection.contractAddress.slice(-6)}
                        </code>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() =>
                            copyToClipboard(mockNFT.collection.contractAddress)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-700/50">
                      <div className="text-sm text-slate-400 mb-2">
                        Token ID
                      </div>
                      <div className="text-white font-semibold">
                        {mockNFT.tokenId}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-700/50">
                      <div className="text-sm text-slate-400 mb-2">
                        Token Standard
                      </div>
                      <div className="text-white font-semibold">ERC-721</div>
                    </div>
                    <div className="p-4 bg-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-700/50">
                      <div className="text-sm text-slate-400 mb-2">
                        Blockchain
                      </div>
                      <div className="text-white font-semibold">
                        {mockNFT.collection.blockchain}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* More from Collection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                More from {mockNFT.collection.name}
              </h2>
              <p className="text-slate-400">
                Discover similar items from this collection
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                View Collection
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockRelatedNFTs.map((nft, index) => (
              <CompactNFTCard key={nft.id} nft={nft} index={index} />
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
