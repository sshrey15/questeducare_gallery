import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/imagemanager',
        destination: 'https://questeducare-gallery.vercel.app/api/imagemanager',
      },
    ];
  },
};

export default nextConfig;