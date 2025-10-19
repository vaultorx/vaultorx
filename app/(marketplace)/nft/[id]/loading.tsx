"use client";

import { motion } from "framer-motion";

export default function NFTDetailLoader() {
  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Image Skeleton */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square bg-slate-800 rounded-2xl border border-slate-700/50 animate-pulse relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/30 to-transparent -skew-x-12 animate-shimmer"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900/40 rounded-xl border border-slate-700/50">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-4 bg-slate-800 rounded mb-2 animate-pulse"></div>
                  <div className="h-6 bg-slate-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details Skeleton */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Collection & Title */}
            <div className="space-y-4">
              <div className="h-4 bg-slate-800 rounded w-32 animate-pulse"></div>
              <div className="h-12 bg-slate-800 rounded animate-pulse"></div>
              <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/50 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-slate-800 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-24"></div>
                    <div className="h-3 bg-slate-800 rounded w-32"></div>
                  </div>
                  <div className="h-8 bg-slate-800 rounded w-20"></div>
                </div>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-700/50 space-y-4 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-24"></div>
              <div className="h-10 bg-slate-800 rounded"></div>
              <div className="space-y-3">
                <div className="h-12 bg-slate-800 rounded"></div>
                <div className="h-12 bg-slate-800 rounded"></div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-6 bg-slate-700 rounded"></div>
              </div>
            </div>

            {/* Properties */}
            <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-700/50 animate-pulse">
              <div className="h-6 bg-slate-800 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-800/50 rounded-lg text-center"
                  >
                    <div className="h-3 bg-slate-700 rounded mb-2"></div>
                    <div className="h-6 bg-slate-700 rounded mb-1"></div>
                    <div className="h-3 bg-slate-700 rounded w-16 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Skeleton */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="border-b border-slate-700/50 mb-6">
            <div className="flex gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-24 bg-slate-800 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          <div className="h-32 bg-slate-900/40 rounded-xl border border-slate-700/50 animate-pulse"></div>
        </motion.div>

        {/* Related Items Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <div className="h-8 bg-slate-800 rounded w-64 animate-pulse"></div>
              <div className="h-4 bg-slate-800 rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-10 bg-slate-800 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-slate-800 relative">
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
