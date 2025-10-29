"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Calendar, Globe, FileText, Link2 } from "lucide-react";
import { motion } from "framer-motion";

interface CollectionAboutProps {
  collection: any;
}

export function CollectionAbout({ collection }: CollectionAboutProps) {
  const details = [
    {
      label: "Contract Address",
      value: collection.contractAddress,
      icon: FileText,
      copyable: true,
    },
    {
      label: "Blockchain",
      value: collection.blockchain,
      icon: Globe,
    },
    {
      label: "Items",
      value: collection?.totalItems?.toString() || "0",
      icon: Users,
    },
    {
      label: "Creator Royalty",
      value: `${collection.royaltyPercentage}%`,
      icon: Shield,
    },
    {
      label: "Created",
      value: new Date(collection.createdAt).toLocaleDateString(),
      icon: Calendar,
    },
    {
      label: "Creator",
      value:
        collection.creator?.username || collection.creator?.name || "Unknown",
      icon: Users,
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Collection Description */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6 bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
          <p className="text-slate-300 leading-relaxed">
            {collection.description ||
              "No description available for this collection."}
          </p>
        </Card>

        {/* Contract Info */}
        <Card className="p-6 bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">
            Contract Details
          </h3>
          <div className="space-y-3">
            {details.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <div
                  key={detail.label}
                  className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-b-0"
                >
                  <div className="flex items-center gap-3 text-slate-400">
                    <Icon className="h-4 w-4" />
                    <span>{detail.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">
                      {detail.value}
                    </span>
                    {detail.copyable && (
                      <button className="text-slate-400 hover:text-white transition-colors">
                        <Link2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Stats & Links */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <Card className="p-6 bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">
            Collection Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Floor Price</span>
              <span className="text-white font-semibold">
                {collection.floorPrice
                  ? `${collection.floorPrice || 0} ETH`
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Volume</span>
              <span className="text-white font-semibold">
                {collection?.totalVolume?.toFixed(1) || 0} ETH
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Listed Items</span>
              <span className="text-white font-semibold">
                {collection?.listedItems || 0} / {collection?.totalItems || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Listed Percentage</span>
              <span className="text-green-400 font-semibold">
                {Math.round(
                  ((collection.listedItems || 0) /
                    Math.max(collection?.totalItems || 0, 1)) *
                    100
                )}
                %
              </span>
            </div>
          </div>
        </Card>

        {/* Links */}
        <Card className="p-6 bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">Links</h3>
          <div className="space-y-2">
            {collection.ipfsMetadataUri && (
              <button className="w-full text-left p-3 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-slate-300 hover:text-white">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4" />
                  <span>View on IPFS</span>
                </div>
              </button>
            )}
            <button className="w-full text-left p-3 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-slate-300 hover:text-white">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4" />
                <span>View Contract</span>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
