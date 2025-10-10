import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/app',
  assetPrefix: '/app',
  trailingSlash: true,
};

export default nextConfig;
