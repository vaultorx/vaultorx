"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { HomeFooter } from "@/components/home-footer";
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

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
          {/* Error Icon */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-16 w-16 text-red-400" />
            </div>
          </motion.div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Something went wrong
          </h1>

          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            We apologize for the inconvenience. An unexpected error has
            occurred. This has been logged and our team has been notified.
          </p>

          {/* Error Details (Collapsible) */}
          <details className="mb-8 text-left">
            <summary className="cursor-pointer text-slate-400 hover:text-white transition-colors mb-2">
              Technical Details
            </summary>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <code className="text-sm text-slate-300 break-all">
                {error.message}
                {error.digest && (
                  <div className="mt-2">
                    <span className="text-slate-500">Digest: </span>
                    {error.digest}
                  </div>
                )}
              </code>
            </div>
          </details>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              className="gap-2 bg-blue-500 hover:bg-blue-600"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>

            <Link href="/">
              <Button
                variant="outline"
                className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                size="lg"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="outline"
                className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                size="lg"
              >
                <Mail className="h-4 w-4" />
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <motion.div
            className="mt-12 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Need immediate help?
            </h3>
            <p className="text-slate-400 mb-4">
              If this error persists, please contact our support team with the
              error details above.
            </p>
            <div className="flex gap-4 justify-center text-sm">
              <a
                href="mailto:support@nftplatform.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                support@nftplatform.com
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://discord.gg/nftplatform"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Discord Support
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <HomeFooter />
    </div>
  );
}
