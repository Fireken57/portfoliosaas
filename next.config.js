/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Disable static generation for pages that use API routes with Prisma
    workerThreads: false,
    cpus: 1,
  },
  // Disable static generation for specific pages
  async generateStaticParams() {
    return [];
  },
};

module.exports = nextConfig; 