import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/presti",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
