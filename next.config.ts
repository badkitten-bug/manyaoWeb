import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/app',
  assetPrefix: '/app',
  trailingSlash: true,
  
  // Versionado automático para cache busting
  generateBuildId: async () => {
    // Generar un ID único basado en timestamp
    return `build-${Date.now()}`;
  },
  
  // Configurar headers para cache busting
  async headers() {
    return [
      {
        source: '/_next/static/css/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
