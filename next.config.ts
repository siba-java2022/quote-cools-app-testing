import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash:true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
