"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, Bell, User, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { SearchCommand } from "./search-command";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("keydown", down);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", down);
    };
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-0 z-50 w-full border-b bg-white/90 backdrop-blur-xl border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="relative flex items-center gap-3">
              <span className="text-xl font-bold text-gray-900">Vaultorx</span>
            </Link>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="hidden md:flex flex-1 max-w-md mx-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search collections, NFTs, creators..."
                className="pl-10 pr-4 h-10 bg-gray-50 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 text-gray-900 placeholder-gray-500 cursor-pointer"
                onClick={() => setSearchOpen(true)}
                readOnly
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <kbd className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-300">
                  ⌘K
                </kbd>
              </div>

              <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {/* Mobile Search */}
            <motion.button
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </motion.button>

            {/* Auth Buttons */}
            {status === "unauthenticated" || status === "loading" ? (
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 gap-2"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/signup">
                    <Button
                      size="sm"
                      className="bg-blue-600 text-white gap-2 hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Button>
                  </Link>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 gap-2"
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.header>
    </>
  );
}
