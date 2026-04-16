/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TypeScript এরর থাকলেও বিল্ড হতে দিবে
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint এররগুলোও ইগনোর করবে
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;