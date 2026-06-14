import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Se place directement à la racine
  allowedDevOrigins: ['192.168.0.106', 'localhost:3000'],
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;