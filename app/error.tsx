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
    <div className="min-h-screen bg-white">
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
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
          </motion.div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            We apologize for the inconvenience. An unexpected error has
            occurred. This has been logged and our team has been notified.
          </p>

          {/* Error Details (Collapsible) */}
          <details className="mb-8 text-left">
            <summary className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors mb-2">
              Technical Details
            </summary>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <code className="text-sm text-gray-700 break-all">
                {error.message}
                {error.digest && (
                  <div className="mt-2">
                    <span className="text-gray-500">Digest: </span>
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
              className="gap-2 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>

            <Link href="/">
              <Button
                variant="outline"
                className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                size="lg"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="outline"
                className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                size="lg"
              >
                <Mail className="h-4 w-4" />
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <motion.div
            className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Need immediate help?
            </h3>
            <p className="text-gray-600 mb-4">
              If this error persists, please contact our support team with the
              error details above.
            </p>
            <div className="flex gap-4 justify-center text-sm">
              <a
                href="mailto:support@nftplatform.com"
                className="text-blue-600 hover:text-blue-500 transition-colors"
              >
                support@nftplatform.com
              </a>
              <span className="text-gray-400">•</span>
              <a
                href="https://discord.gg/nftplatform"
                className="text-blue-600 hover:text-blue-500 transition-colors"
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
