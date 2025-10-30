"use client";

import { Button } from "@/components/ui/button";
import { Package, Activity, Info } from "lucide-react";
import { motion } from "framer-motion";

interface CollectionTabsProps {
  activeTab: string;
  setActiveTab: (tab: "items" | "activity" | "about") => void;
}

export function CollectionTabs({
  activeTab,
  setActiveTab,
}: CollectionTabsProps) {
  const tabs = [
    { id: "items" as const, label: "Items", icon: Package, count: null },
    { id: "activity" as const, label: "Activity", icon: Activity, count: null },
    { id: "about" as const, label: "About", icon: Info, count: null },
  ];

  return (
    <motion.div
      className="flex gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.id}
            variant="ghost"
            className={`flex-1 gap-2 ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-lg"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
            {tab.count !== null && (
              <span className="px-2 py-1 text-xs bg-gray-200 rounded-full">
                {tab.count}
              </span>
            )}
          </Button>
        );
      })}
    </motion.div>
  );
}
