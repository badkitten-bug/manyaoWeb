import type { NextConfig } from "next";

// En desarrollo, permitir API routes; en producción, exportación estática
const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Solo exportar estáticamente en producción
  ...(isDev ? {} : { output: 'export' }),
  basePath: '/app',
  assetPrefix: '/app',
  trailingSlash: true,
  
  // Versionado automático para cache busting
  generateBuildId: async () => {
    // Generar un ID único basado en timestamp
    return `build-${Date.now()}`;
  },
  
  // Nota: Los headers no funcionan con "output: export" (exportación estática)
  // Los headers de cache deben configurarse en el servidor web (Apache/Nginx)
  // async headers() {
  //   return [
  //     {
  //       source: '/_next/static/css/(.*)',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
