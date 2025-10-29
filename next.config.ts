import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
    domains: ["res.cloudinary.com", "via.placeholder.com", "picsum.photos"],
  },

  // Fix: Use the new configuration format
  serverExternalPackages: [
    "@prisma/client",
    "bcryptjs",
    "adminjs",
    "@adminjs/prisma",
    "@adminjs/express",
    "esbuild",
  ],

  // Remove the experimental block entirely since it's deprecated
  // experimental: {
  //   serverComponentsExternalPackages: [...],
  // },

  webpack: (config, { isServer, dev }) => {
    // Client-side exclusions
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Exclude problematic packages from middleware
    if (isServer && !dev) {
      config.externals.push(
        { "openid-client": "commonjs openid-client" },
        { bcryptjs: "commonjs bcryptjs" }
      );
    }

    return config;
  },

  // Add compiler options to handle type checking
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
