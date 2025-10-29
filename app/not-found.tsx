"use client";

import { Header } from "@/components/header";
import { HomeFooter } from "@/components/home-footer";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <div className="pt-24 px-4 sm:px-10 min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-48 h-48 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
              <div className="text-6xl">🔍</div>
            </div>
            <div className="absolute -top-4 -right-4">
              <div className="text-8xl font-bold text-purple-500/30">404</div>
            </div>
          </motion.div>

          {/* Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Page not found
          </h1>

          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. It
            might have been deleted, or you may have entered the wrong URL.
          </p>

          {/* Suggested Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/">
              <Button className="gap-2 bg-blue-500 hover:bg-blue-600" size="lg">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>

            <Link href="/collections">
              <Button
                variant="outline"
                className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                size="lg"
              >
                <Search className="h-4 w-4" />
                Browse Collections
              </Button>
            </Link>

            <Button
              variant="outline"
              className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Search Suggestions */}
          <motion.div
            className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-white mb-3">
              Looking for something specific?
            </h3>
            <ul className="text-slate-400 space-y-2">
              <li>
                • Check out our{" "}
                <Link
                  href="/collections"
                  className="text-blue-400 hover:text-blue-300"
                >
                  collections
                </Link>
              </li>
              <li>
                • Browse the{" "}
                <Link
                  href="/marketplace"
                  className="text-blue-400 hover:text-blue-300"
                >
                  marketplace
                </Link>
              </li>
              <li>
                • Explore trending{" "}
                <Link
                  href="/categories"
                  className="text-blue-400 hover:text-blue-300"
                >
                  categories
                </Link>
              </li>
              <li>
                • Visit our{" "}
                <Link
                  href="/help"
                  className="text-blue-400 hover:text-blue-300"
                >
                  help center
                </Link>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <HomeFooter />
    </div>
  );
}
