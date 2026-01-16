import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* 
     Silence Turbopack warning when using webpack plugins.
     Next.js 15/16 requires an empty turbopack config to acknowledge 
     that you are using webpack features.
  */
  // @ts-ignore
  turbopack: {},

  // For Cloudflare Pages static export
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Trailing slashes for static hosting
  trailingSlash: true,
};

module.exports = withPWA(nextConfig);
