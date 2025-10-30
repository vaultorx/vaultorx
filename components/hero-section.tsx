"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Shield,
  Gamepad2,
  Palette,
  Camera,
  Music,
  Shirt,
  Trophy,
  Cuboid,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Category data with icons and colors
const categories = [
  {
    id: "gaming",
    name: "Gaming",
    icon: Gamepad2,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500",
    description: "Game assets & collectibles",
    image: "/placeholder-gaming.jpg",
  },
  {
    id: "art",
    name: "Digital Art",
    icon: Palette,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-500",
    description: "Creative digital artwork",
    image: "/placeholder-art.jpg",
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-500",
    description: "Photographic NFTs",
    image: "/placeholder-photography.jpg",
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    color: "from-red-500 to-orange-600",
    bgColor: "bg-red-500",
    description: "Audio & music NFTs",
    image: "/placeholder-music.jpg",
  },
  {
    id: "sports",
    name: "Sports",
    icon: Trophy,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-500",
    description: "Sports memorabilia",
    image: "/placeholder-sports.jpg",
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: Shirt,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-500",
    description: "Digital fashion",
    image: "/placeholder-fashion.jpg",
  },
  {
    id: "3d",
    name: "3D Art",
    icon: Cuboid,
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-500",
    description: "3D models & sculptures",
    image: "/placeholder-3d.jpg",
  },
  {
    id: "animated",
    name: "Animated",
    icon: Zap,
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-yellow-500",
    description: "Animated artworks",
    image: "/placeholder-animated.jpg",
  },
];

export function HeroSection() {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate categories
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentCategory((prev) => (prev + 1) % categories.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextCategory = () => {
    setCurrentCategory((prev) => (prev + 1) % categories.length);
  };

  const prevCategory = () => {
    setCurrentCategory(
      (prev) => (prev - 1 + categories.length) % categories.length
    );
  };

  const selectCategory = (index: number) => {
    setCurrentCategory(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative flex flex-col overflow-hidden bg-white">
      <div className="relative h-[300px] w-full">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/placeholder.svg')",
          }}
        />
      </div>
      {/* Category Carousel Section */}
      <div className="flex-1 py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Main Carousel */}
          <div className="max-w-6xl mx-auto">
            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  className={`p-4 rounded-xl text-left transition-all ${
                    index === currentCategory
                      ? "bg-white shadow-lg border-2 border-blue-500"
                      : "bg-white/80 hover:bg-white border-2 border-transparent hover:border-gray-200"
                  }`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    selectCategory(index);
                    router.push(`/nft?category=${category.id}`);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${category.bgColor} text-white`}
                    >
                      <category.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {category.name}
                      </h4>
                      <p className="text-gray-500 text-xs">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              {categories.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentCategory ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  onClick={() => selectCategory(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
