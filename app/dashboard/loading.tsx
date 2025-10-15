"use client";

import { motion } from "framer-motion";

export default function MarketplaceLoader() {
  return (
    <div className="min-h-screen bg-slate-950 p-4">
      {/* Header Skeleton */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-800 rounded-lg animate-pulse"></div>
          <div className="h-4 w-48 bg-slate-800 rounded animate-pulse"></div>
        </div>
        <div className="h-12 w-80 bg-slate-800 rounded-xl animate-pulse"></div>
      </motion.div>

      {/* Controls Skeleton */}
      <motion.div
        className="flex items-center justify-between mb-8 p-6 bg-slate-900/40 rounded-xl border border-slate-700/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 w-20 bg-slate-800 rounded animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-slate-800 rounded-lg animate-pulse"></div>
          <div className="h-10 w-20 bg-slate-800 rounded-lg animate-pulse"></div>
          <div className="h-10 w-20 bg-slate-800 rounded-lg animate-pulse"></div>
        </div>
      </motion.div>

      <div className="flex gap-6">
        {/* Filters Sidebar Skeleton */}
        <motion.div
          className="hidden lg:block w-80 space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/50"
            >
              <div className="h-6 w-24 bg-slate-800 rounded mb-4 animate-pulse"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-4 bg-slate-800 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* NFT Grid Skeleton */}
        <motion.div
          className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-slate-800 relative">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent -skew-x-12 animate-shimmer"></div>
              </div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                <div className="flex justify-between items-center pt-3">
                  <div className="h-4 bg-slate-800 rounded w-16"></div>
                  <div className="h-8 bg-slate-800 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
