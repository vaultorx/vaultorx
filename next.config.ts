import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },

  webpack: (config, { isServer, dev }) => {
    // Client-side exclusions
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Exclude openid-client and other problematic packages from middleware
    if (isServer && !dev) {
      config.externals.push({
        "openid-client": "commonjs openid-client",
      });
    }

    return config;
  },

  serverExternalPackages: [],

  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "bcryptjs",
      "adminjs",
      "@adminjs/prisma",
      "@adminjs/express",
      "@prisma/client",
      ".prisma/client",
      "esbuild",
    ],
  },
};

export default nextConfig;
