"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  MessageSquare,
  FileText,
  Globe,
  Coffee,
} from "lucide-react";

export function DashboardFooter() {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-700/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Quick Actions */}
        <motion.div
          className="py-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            {
              icon: HelpCircle,
              label: "Help Center",
              description: "Get support",
              href: "/help",
            },
            {
              icon: MessageSquare,
              label: "Community",
              description: "Join Discord",
              href: "/discord",
            },
            {
              icon: FileText,
              label: "Documentation",
              description: "Read docs",
              href: "/docs",
            },
            {
              icon: Coffee,
              label: "Feedback",
              description: "Share ideas",
              href: "/feedback",
            },
          ].map((action, index) => (
            <motion.div
              key={action.label}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={action.href}
                className="block p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <action.icon className="h-4 w-4 text-slate-400 group-hover:text-blue-400" />
                  </div>
                  <span className="font-medium text-white text-sm">
                    {action.label}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Status & Info */}
        <motion.div
          className="py-4 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          {/* System Status */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-slate-400">All Systems Operational</span>
            </div>
            <div className="text-slate-500">•</div>
            <div className="text-slate-400">Last updated: Just now</div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/status"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Status
            </Link>
            <Link
              href="/api"
              className="text-slate-400 hover:text-white transition-colors"
            >
              API
            </Link>
            <Link
              href="/changelog"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Changelog
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white h-8"
            >
              <Globe className="h-4 w-4 mr-2" />
              v2.4.1
            </Button>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="py-4 border-t border-slate-700/50 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-500 text-sm">
            © 2024 Vaultorx Dashboard • Built for the future of digital
            ownership
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
