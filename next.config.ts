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
  },

  // Exclude bcrypt from middleware bundles
  serverExternalPackages: ["bcrypt"],

  webpack: (config, { isServer, dev }) => {
    // Client-side exclusions
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        os: false,
      };
    }

    // Exclude bcrypt from all bundles that might end up in middleware
    config.externals = [
      ...(config.externals || []), "bcrypt"
      // {
      //   bcrypt: "commonjs bcrypt",
      //   "node-gyp-build": "commonjs node-gyp-build",
      // },
    ];

    return config;
  },

  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
