import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export" chi dung cho GitHub Pages
  // Vercel khong can, de API routes hoat dong
  ...(process.env.STATIC_EXPORT === "true" ? { output: "export" } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
