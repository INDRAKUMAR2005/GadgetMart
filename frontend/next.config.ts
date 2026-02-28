/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
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
