/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // মোবাইল অ্যাপ ও স্ট্যাটিক বিল্ডের জন্য আবশ্যক
  images: {
    unoptimized: true, // লোকাল ইমেজ বা রিমোট ইমেজ রেন্ডারিং স্মুথ রাখতে
  },
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