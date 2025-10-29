"use client";

import { motion } from "framer-motion";
import { Move3D, Rocket, Sparkles, Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Animated Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="text-center relative z-10">
        {/* Main Logo Animation */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <div className="relative">

            {/* Orbiting Elements */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute h-6 w-6 rounded-full bg-linear-to-r from-cyan-400 to-blue-400 flex items-center justify-center shadow-lg shadow-cyan-500/50"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  rotate: 360,
                  x: [-60, -60],
                  y: [-60, -60],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 1,
                }}
              >
                {i === 0 && <Sparkles className="h-3 w-3 text-white" />}
                {i === 1 && <Move3D className="h-3 w-3 text-white" />}
                {i === 2 && <Zap className="h-3 w-3 text-white" />}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Brand Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-4">
            Vaultorx
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-8 max-w-md mx-auto">
            Loading the future of digital ownership
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="max-w-md mx-auto">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats Preview */}
        <motion.div
          className="flex justify-center gap-8 mt-12 text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[
            { value: "4.2B+", label: "Volume" },
            { value: "980K+", label: "Collectors" },
            { value: "2.1M+", label: "NFTs" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
            >
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
