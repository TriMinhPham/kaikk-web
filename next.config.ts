import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    serverSourceMaps: false,
  },
};

export default nextConfig;
