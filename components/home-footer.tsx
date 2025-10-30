"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Zap, Globe } from "lucide-react";

export function HomeFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 relative overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-white" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Features Bar */}
        <motion.div
          className="py-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {[
            {
              icon: Shield,
              title: "Secure Trading",
              description:
                "Military-grade encryption and smart contract audits",
            },
            {
              icon: Zap,
              title: "Instant Transactions",
              description: "Near-zero gas fees and lightning-fast settlements",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex items-start gap-4 text-center md:text-left"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="py-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Vaultorx. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
