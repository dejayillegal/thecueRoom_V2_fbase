/** @type {import('next').NextConfig} */
const isCI = process.env.CI === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const assetPrefix = basePath || "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  experimental: {
    // Keep App Router but avoid Node APIs for SSG
  },
};

export default nextConfig;
