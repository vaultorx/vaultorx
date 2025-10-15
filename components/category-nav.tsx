"use client";

import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useState } from "react";

export function CategoryNav() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  return (
    <motion.div
      className="border-y border-border/40 bg-muted/20 sticky top-20 z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <ScrollArea className="w-full">
        <div className="container mx-auto px-6">
          <div className="flex gap-1 py-4">
            {CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={() => setActiveCategory(category.id)}
                  variant="ghost"
                  size="default"
                  className={`relative flex-shrink-0 gap-2 px-6 font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? "text-background"
                      : "hover:bg-foreground/10"
                  }`}
                >
                  {activeCategory === category.id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-foreground rounded-lg"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="text-xl relative z-10">{category.icon}</span>
                  <span className="relative z-10">{category.name}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  );
}
