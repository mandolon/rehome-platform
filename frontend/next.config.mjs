/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    // Only use proxy when not in mock mode
    return process.env.NEXT_PUBLIC_USE_API_MOCK === '1' ? [] : [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9000/api/:path*',
      },
      {
        source: '/sanctum/:path*',
        destination: 'http://localhost:9000/sanctum/:path*',
      },
    ];
  },
};

export default nextConfig;
