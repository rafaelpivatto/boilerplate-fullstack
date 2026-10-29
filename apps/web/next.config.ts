import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@project/shared'],
  async rewrites() {
    const apiOrigin = process.env.API_INTERNAL_URL ?? 'http://localhost:3001';
    return [{ source: '/backend/:path*', destination: `${apiOrigin}/api/:path*` }];
  },
};

export default nextConfig;
