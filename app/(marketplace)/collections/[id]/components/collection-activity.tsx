"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface CollectionActivityProps {
  collection: any;
}

interface Activity {
  id: string;
  type: "sale" | "transfer" | "list" | "mint";
  nftName: string;
  price?: number;
  from?: string;
  to?: string;
  txHash: string;
  timestamp: Date;
  nftId: string;
}

export function CollectionActivity({ collection }: CollectionActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/collections/${collection.id}/activity`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const result = await response.json();

      if (result.success) {
        setActivities(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load activities"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (collection?.id) {
      fetchActivities();
    }
  }, [collection?.id]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "sale":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "list":
        return <Zap className="h-4 w-4 text-blue-500" />;
      case "mint":
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case "transfer":
        return <ArrowDownLeft className="h-4 w-4 text-amber-500" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "sale":
        return "text-green-600";
      case "list":
        return "text-blue-600";
      case "mint":
        return "text-purple-600";
      case "transfer":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4 bg-gray-50 border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Failed to load activity
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchActivities}
          className="text-blue-600 hover:text-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {activities.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No activity yet
          </h3>
          <p className="text-gray-600">
            Activity for this collection will appear here.
          </p>
        </div>
      ) : (
        activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-4 bg-white border-gray-200 hover:border-gray-300 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gray-100">
                    {getActivityIcon(activity.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold capitalize ${getActivityColor(
                          activity.type
                        )}`}
                      >
                        {activity.type}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {activity.nftName}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600">
                      {activity.from && (
                        <span>From {formatAddress(activity.from)}</span>
                      )}
                      {activity.to && (
                        <span> → To {formatAddress(activity.to)}</span>
                      )}
                      {activity.price && (
                        <span className="text-gray-900 ml-2">
                          • {activity.price} ETH
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {formatTime(activity.timestamp)}
                  </span>
                  <button
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() =>
                      window.open(
                        `https://etherscan.io/tx/${activity.txHash}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
