"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Eye, DollarSign, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Collection } from "@/lib/types";

interface CollectionStatsProps {
  collection: Collection;
}

export function CollectionStats({ collection }: CollectionStatsProps) {
  const stats = [
    {
      label: "Floor Price",
      value: collection.floorPrice ? `${collection?.floorPrice?.toFixed(4)} ETH` : "—",
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      label: "Total Volume",
      value: `${collection?.totalVolume?.toFixed(1) || 0} ETH`,
      icon: TrendingUp,
      color: "text-blue-400",
    },
    {
      label: "Items",
      value: collection?.totalItems?.toString() || 0,
      icon: Package,
      color: "text-purple-400",
    },
    {
      label: "Listed",
      value: `${collection.listedItems || 0} (${Math.round(
        ((collection?.listedItems || 0) /
          Math.max(collection?.totalItems || 0, 1)) *
          100
      )}%)`,
      icon: Eye,
      color: "text-amber-400",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="p-6 bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-slate-700/50 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </motion.div>
  );
}
