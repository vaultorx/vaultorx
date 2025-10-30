"use client";

import { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
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
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface ETHPriceData {
  price: number;
  change24h: number;
  lastUpdated: string;
}

export default function NFTDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: nftId } = use(params);
  const router = useRouter();
  const { data: session } = useSession();

  const [nft, setNft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [ethPrice, setEthPrice] = useState<ETHPriceData | null>(null);
  const [ethLoading, setEthLoading] = useState(true);

  // Fetch ETH price from CoinGecko API
  const fetchETHPrice = async () => {
    try {
      setEthLoading(true);
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch ETH price");
      }

      const data = await response.json();
      setEthPrice({
        price: data.ethereum.usd,
        change24h: data.ethereum.usd_24h_change,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error fetching ETH price:", err);
    } finally {
      setEthLoading(false);
    }
  };

  const fetchNFT = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/nfts/${nftId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch NFT: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setNft(result.data);
      } else {
        throw new Error(result.error || "Failed to load NFT");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nftId) {
      fetchNFT();
      fetchETHPrice();
    }

    // Refresh ETH price every 30 seconds
    const interval = setInterval(fetchETHPrice, 30000);
    return () => clearInterval(interval);
  }, [nftId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "Epic":
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case "Rare":
        return <Gem className="h-4 w-4 text-blue-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-400" />;
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
        return "from-gray-500 to-gray-600";
    }
  };

  // Calculate USD value of NFT
  const calculateUSDValue = () => {
    if (!nft?.listPrice || !ethPrice) return 0;
    return nft.listPrice * ethPrice.price;
  };

  // Handle buy now redirection
  const handleBuyNow = () => {
    if (!session) {
      // User not logged in - redirect to login with purchase intent
      const nftData = {
        id: nft.id,
        name: nft.name,
        price: nft.price,
        image: nft.image,
        collectionName: nft.collectionName,
        currency: nft.currency,
        owner: nft.owner,
        description: nft.description,
        rarity: nft.rarity,
      };

      const encodedNft = encodeURIComponent(JSON.stringify(nftData));
      router.push(`/login?redirect=/dashboard/purchase&nft=${encodedNft}`);
    } else {
      // User is logged in - go directly to purchase
      router.push(
        `/dashboard/purchase?nft=${encodeURIComponent(JSON.stringify(nft))}`
      );
    }
  };

  if (!nft && loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Image Skeleton */}
            <div className="space-y-6">
              <Skeleton className="aspect-square rounded-3xl bg-gray-200" />
              <Skeleton className="h-48 rounded-2xl bg-gray-200" />
            </div>

            {/* Details Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-1/2 rounded-lg bg-gray-200" />
              <Skeleton className="h-12 w-3/4 rounded-lg bg-gray-200" />
              <Skeleton className="h-32 rounded-2xl bg-gray-200" />
              <Skeleton className="h-48 rounded-2xl bg-gray-200" />
              <Skeleton className="h-32 rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 px-4 sm:px-10 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              NFT Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              {error || "The NFT you're looking for doesn't exist."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchNFT} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Link href="/marketplace">
                <Button variant="outline">Browse Marketplace</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 border border-gray-300 shadow-lg">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-12 w-12 border-4 border-gray-300 border-t-blue-500 rounded-full"
                    />
                  </div>
                )}
                <img
                  src={nft.image}
                  alt={nft.name}
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
                    className="h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Flag className="h-5 w-5 text-gray-700" />
                  </motion.button>
                </div>

                {/* Rarity Badge */}
                <div className="absolute top-6 left-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`bg-linear-to-r ${getRarityColor(
                      nft.rarity
                    )} text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg`}
                  >
                    {getRarityIcon(nft.rarity)}
                    {nft.rarity}
                  </motion.div>
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-300"
                  >
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">Views</span>
                        </div>
                        <div className="text-gray-900 font-bold text-lg">
                          {nft.views.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">Likes</span>
                        </div>
                        <div className="text-gray-900 font-bold text-lg">
                          {nft.likes.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Created</span>
                        </div>
                        <div className="text-gray-900 font-bold text-sm">
                          {new Date(nft.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            {nft.properties && nft.properties.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 bg-white rounded-2xl border border-gray-200"
              >
                <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-blue-600" />
                  Properties
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {nft.properties.map((property: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center group hover:border-gray-300 transition-colors"
                    >
                      <div className="text-xs text-gray-600 mb-2 uppercase tracking-wide">
                        {property.trait_type}
                      </div>
                      <div className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {property.value}
                      </div>
                      <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                        {property.rarity} have this
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-linear-to-r from-blue-500 to-cyan-400 h-1 rounded-full transition-all duration-500"
                          style={{ width: `${property.score}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
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
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>{nft.collection.name}</span>
                </div>
                {nft.collection.verified && (
                  <BadgeCheck className="h-4 w-4 text-blue-600" />
                )}
                <div className="h-1 w-1 bg-gray-400 rounded-full" />
                <span>{nft.collection.blockchain}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                {nft.name}
              </h1>

              {/* Creator Info */}
              <motion.div
                className="p-6 bg-white rounded-2xl border border-gray-200"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-600 text-sm">Creator</span>
                      {nft.collection.creator && (
                        <BadgeCheck className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="text-gray-900 font-semibold text-lg">
                      {nft.collection.creator?.username ||
                        nft.collection.creator?.name ||
                        "Unknown"}
                    </div>
                    <div className="text-gray-600 text-sm">
                      Creator of {nft.collection.name}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Current Price and Actions */}
            <motion.div
              className="p-6 bg-white rounded-2xl border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-600 text-sm">Current Price</div>
                {/* ETH Price Display */}
                {ethPrice && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>ETH: ${ethPrice.price.toLocaleString()}</span>
                    <span
                      className={
                        ethPrice.change24h >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {ethPrice.change24h >= 0 ? "+" : ""}
                      {ethPrice.change24h.toFixed(2)}%
                    </span>
                    <RefreshCw
                      className="h-3 w-3 cursor-pointer hover:text-blue-600"
                      onClick={fetchETHPrice}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {nft.listPrice?.toFixed(4)} {nft.currency}
                </span>
                <span className="text-lg text-gray-600">
                  $
                  {ethLoading
                    ? "..."
                    : calculateUSDValue().toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                </span>
              </div>

              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full h-14 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-bold gap-3"
                    onClick={handleBuyNow}
                  >
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
                    className="w-full h-14 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-lg"
                  >
                    Make Offer
                  </Button>
                </motion.div>
              </div>

              {/* Market Data */}
              {nft.collection.floorPrice && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Floor Price</span>
                    <span className="text-green-600 font-semibold text-sm">
                      +
                      {(
                        ((nft.listPrice - nft.collection.floorPrice) /
                          nft.collection.floorPrice) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-semibold">
                      {nft.collection.floorPrice?.toFixed(4)} ETH
                    </span>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Collection Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-white rounded-2xl border border-gray-200"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Collection Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {nft.collection._count.nfts.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Total Items</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {nft.collection.listedItems.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Listed</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {nft.collection?.totalVolume?.toLocaleString() || "0"}
                  </div>
                  <div className="text-xs text-gray-600">Volume (ETH)</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {nft.collection.royaltyPercentage}%
                  </div>
                  <div className="text-xs text-gray-600">Royalty</div>
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
          <div className="border-b border-gray-200 mb-8">
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
                      ? "text-gray-900 border-blue-600"
                      : "text-gray-600 border-transparent hover:text-gray-900"
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
              className="max-w-none"
            >
              {activeTab === "description" && (
                <div className="text-gray-600 leading-relaxed text-lg space-y-4">
                  <p>{nft.description || "No description available."}</p>
                </div>
              )}

              {activeTab === "details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">
                        Contract Address
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-gray-900 font-mono text-sm">
                          {nft.collection.contractAddress.slice(0, 8)}...
                          {nft.collection.contractAddress.slice(-6)}
                        </code>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() =>
                            copyToClipboard(nft.collection.contractAddress)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">Token ID</div>
                      <div className="text-gray-900 font-semibold">
                        {nft.tokenId}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">
                        Token Standard
                      </div>
                      <div className="text-gray-900 font-semibold">ERC-721</div>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">
                        Blockchain
                      </div>
                      <div className="text-gray-900 font-semibold">
                        {nft.collection.blockchain}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* More from Collection */}
        {/* <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                More from {nft.collection.name}
              </h2>
              <p className="text-gray-600">
                Discover similar items from this collection
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={`/collections/${nft.collection.id}`}>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  View Collection
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="text-center py-16 text-gray-600">
            <p>More NFTs from this collection would be displayed here</p>
          </div>
        </motion.section> */}
      </div>
    </div>
  );
}
