import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/61sqw5prw/thaiGuide/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.thaiguide.in.th',
          },
          {
            key: 'Content-Security-Policy',
            value: "img-src 'self' ik.imagekit.io"
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=86400'
          }
        ],
      },
    ]
  },
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
