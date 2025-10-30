"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { HomeFooter } from "@/components/home-footer";
import { CollectionHeader } from "./components/collection-header";
import { CollectionTabs } from "./components/collection-tabs";
import { CollectionStats } from "./components/collection-stats";
import { CollectionNFTs } from "./components/collection-nfts";
import { CollectionActivity } from "./components/collection-activity";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CollectionAbout } from "./components/collection-about";
import { collectionService } from "@/services/collection-service";

type TabType = "items" | "activity" | "about";

export default function CollectionPage() {
  const params = useParams();
  const collectionId = params.id as string;

  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("items");

  const fetchCollection = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching collection with ID:", collectionId);

      const response = await collectionService.getCollectionById(collectionId);

      if (response.success) {
        setCollection(response.data);
        console.log("Successfully fetched collection:", response.data.name);
      } else {
        throw new Error(
          (response.message as any) || "Failed to load collection"
        );
      }
    } catch (err) {
      console.error("Error fetching collection:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (collectionId) {
      fetchCollection();
    }
  }, [collectionId]);

  // Debug info
  useEffect(() => {
    if (collection) {
      console.log("Collection data loaded:", {
        name: collection.name,
        nftsCount: collection.nfts?.length,
        stats: collection.stats,
      });
    }
  }, [collection]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 px-4 sm:px-10">
          <div className="container mx-auto py-8">
            {/* Back Button Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-10 w-32 rounded-lg bg-gray-200" />
            </div>

            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <Skeleton className="w-full lg:w-80 h-80 rounded-2xl bg-gray-200" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-12 w-3/4 rounded-lg bg-gray-200" />
                <Skeleton className="h-6 w-1/2 rounded-lg bg-gray-200" />
                <Skeleton className="h-20 w-full rounded-lg bg-gray-200" />
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-32 rounded-lg bg-gray-200" />
                  <Skeleton className="h-10 w-32 rounded-lg bg-gray-200" />
                </div>
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl bg-gray-200" />
              ))}
            </div>

            {/* Tabs Skeleton */}
            <div className="flex gap-4 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-24 rounded-lg bg-gray-200"
                />
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-square rounded-xl bg-gray-200"
                />
              ))}
            </div>
          </div>
        </div>
        <HomeFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 px-4 sm:px-10 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Collection Not Found
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchCollection} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Link href="/collections">
                <Button variant="outline">Back to Collections</Button>
              </Link>
            </div>
          </div>
        </div>
        <HomeFooter />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 px-4 sm:px-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Collection Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The collection you're looking for doesn't exist.
            </p>
            <Link href="/collections">
              <Button>Browse Collections</Button>
            </Link>
          </div>
        </div>
        <HomeFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 px-4 sm:px-10">
        <div className="container mx-auto py-8">
          {/* Debug Info */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
              <div className="text-sm text-gray-600">
                Collection: {collection.name}, NFTs: {collection.nfts?.length},
                Listed: {collection.listedItems}, Volume:{" "}
                {collection.totalVolume} ETH
              </div>
            </div>
          )}

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/collections">
              <Button
                variant="ghost"
                className="mb-6 gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Collections
              </Button>
            </Link>
          </motion.div>

          {/* Collection Header */}
          <CollectionHeader collection={collection} />

          {/* Collection Stats */}
          <CollectionStats collection={collection} />

          {/* Tabs */}
          <CollectionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === "items" && (
              <CollectionNFTs collection={collection} />
            )}
            {activeTab === "activity" && (
              <CollectionActivity collection={collection} />
            )}
            {activeTab === "about" && (
              <CollectionAbout collection={collection} />
            )}
          </motion.div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
}
