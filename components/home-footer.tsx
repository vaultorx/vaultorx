"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Zap, Globe } from "lucide-react";

export function HomeFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Features Bar */}
        <motion.div
          className="py-8 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6"
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
            {
              icon: Globe,
              title: "Multi-chain",
              description: "Support for Ethereum, Polygon, Solana, and more",
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
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">
                  {feature.title}
                </h4>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="py-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-slate-400 text-sm">
            © 2024 Vaultorx. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
