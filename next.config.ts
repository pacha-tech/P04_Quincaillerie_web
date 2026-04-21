import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Se place directement à la racine
  allowedDevOrigins: ['192.168.0.109', 'localhost:3000'],
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