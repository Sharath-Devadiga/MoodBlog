import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    domains: ['res.cloudinary.com'], // ✅ Allow Cloudinary
  },
};

export default nextConfig;
