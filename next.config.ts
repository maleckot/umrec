import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // increase limit here
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
