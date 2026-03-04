/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://4.186.24.230:80';
    return [
      {
        // ✅ Proxy all backend API calls EXCEPT our own internal /api/chat route
        source: '/api/:path((?!chat).*)',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
