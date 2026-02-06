import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'auth.hackclub.com',
      },
      {
        protocol: 'https',
        hostname: 'ca.slack-edge.com',
      },
      {
        protocol: 'https',
        hostname: 'cloud-i58v96x56-hack-club-bot.vercel.app',
      }
    ],
  },
};

export default nextConfig;
