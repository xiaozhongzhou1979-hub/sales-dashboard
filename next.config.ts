import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 兼容 Next.js 16 默认 Turbopack，避免与 webpack 配置冲突
  turbopack: {},
};

export default nextConfig;
