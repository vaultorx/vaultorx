"use client";

import { Collection } from "@/lib/types";
import { CollectionCard } from "./collection-card";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface CollectionGridProps {
  collections: Collection[];
  loading: boolean;
  viewMode: "grid" | "list";
}

export function CollectionGrid({
  collections,
  loading,
  viewMode,
}: CollectionGridProps) {
  if (loading) {
    return (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className={
              viewMode === "grid"
                ? "aspect-square rounded-xl bg-gray-200"
                : "h-32 rounded-xl bg-gray-200"
            }
          />
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {collections.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No collections found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search terms
          </p>
        </motion.div>
      ) : (
        <motion.div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
          layout
        >
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              index={index}
              viewMode={viewMode}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
