import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/61sqw5prw/thaiGuide/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/@me',
        destination: '/me',
      },
      {
        source: '/@me/mymap',
        destination: '/me/mymap',
      },
      {
        source: '/@me/option',
        destination: '/me/option',
      },
    ];
  },
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
