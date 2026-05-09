import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  outputFileTracingIncludes: {
    '/api/**': ['./src/data/**'],
    '/': ['./src/data/**'],
  },
};

export default nextConfig;