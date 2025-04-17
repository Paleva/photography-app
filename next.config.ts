import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // Ensure images are properly configured
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/file/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['193.219.42.55:1053', '193.219.42.55'],
    },
  },

};

export default nextConfig;
