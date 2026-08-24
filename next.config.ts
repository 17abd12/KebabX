import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The storefront is a single prerendered route with no server work — no API
   * routes, no middleware, no dynamic rendering. Exporting to plain HTML means
   * any static host (Netlify, Pages, S3) serves it without a Next.js adapter.
   */
  output: "export",

  images: {
    // Static export has no image optimizer at runtime. Every image is now a
    // locally hosted, pre-sized WebP, so there is nothing to optimize and no
    // remote host to allow-list.
    unoptimized: true,
  },
};

export default nextConfig;
