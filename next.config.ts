import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
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
    ],
  },
  async redirects() {
    return [
      {
        source: '/terms',
        destination: '/termos-de-uso',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/politica-de-privacidade',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
