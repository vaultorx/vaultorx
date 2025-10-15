"use client";

import Link from "next/link";
import { Search, Bell, Rocket, User, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  return (
    <motion.header
      className="fixed top-0 z-50 w-full border-b bg-slate-950/80 backdrop-blur-xl border-slate-800/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full border-2 border-slate-950"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Vaultorx
            </span>
          </Link>
        </motion.div>

        {/* Search Bar - Hidden on mobile, shown on desktop */}
        <motion.div
          className="hidden md:flex flex-1 max-w-md mx-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search collections, NFTs, creators..."
              className="pl-10 pr-4 h-10 bg-slate-800/50 border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 text-white placeholder-slate-400"
            />
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {/* Mobile Search */}
          <motion.button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Search className="h-5 w-5" />
          </motion.button>

          {/* Notifications */}
          {/* <motion.button
            className="relative p-2 text-slate-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="h-5 w-5" />
            <motion.div
              className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button> */}

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" className="bg-blue-500 gap-2">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
