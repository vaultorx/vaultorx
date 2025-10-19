"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Shield,
  Play,
} from "lucide-react";
import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

export function HeroSection() {
  const constraintsRef = useRef(null);

  const nftCards = [
    { id: 1, image: "/placeholder.svg", name: "Ethereal #4234", price: "1.5 ETH" },
    { id: 2, image: "/placeholder.svg", name: "Digital Dreams", price: "2.1 ETH" },
    { id: 3, image: "/placeholder.svg", name: "Cyber Void", price: "3.8 ETH" },
  ];

  return (
    <section className="relative min-h-screen px-8 py-14 pt-24 sm:px-24 sm:py-16 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 mb-2"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                Next Generation NFT Marketplace
              </span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-3 leading-tight text-slate-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Discover
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Digital Art
              </span>
              <br />& NFTs
            </motion.h1>

            <motion.p
              className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              The most advanced NFT marketplace with zero gas fees, instant
              trading, and revolutionary AI-powered discovery.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 gap-3"
              >
                Explore Marketplace
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { value: "$4.2B+", label: "Volume", icon: TrendingUp },
                { value: "980K+", label: "Collectors", icon: Users },
                { value: "2.1M+", label: "NFTs", icon: Shield },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* 3D NFT Card Stack */}
          <motion.div
            className="relative h-[600px]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {nftCards.map((nft, index) => (
              <motion.div
                key={nft.id}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-80 rounded-3xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-2xl"
                style={{
                  zIndex: nftCards.length - index,
                  rotateY: index * 5 - 10,
                  x: index * 40,
                  scale: 1 - index * 0.1,
                }}
                whileHover={{
                  scale: 1.05,
                  x: index === 0 ? -20 : index * 40 - 20,
                  transition: { type: "spring", stiffness: 300, damping: 30 },
                }}
                drag="x"
                dragConstraints={{ left: -100, right: 100 }}
              >
                <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg">{nft.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-blue-400 font-semibold">
                        {nft.price}
                      </span>
                      <Button
                        size="sm"
                        className="bg-white text-slate-900 hover:bg-slate-200"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-slate-100 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-slate-400 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
