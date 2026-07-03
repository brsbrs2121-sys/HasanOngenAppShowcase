/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,

  // Disable PWA during local development.
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  // Ignore TypeScript build errors.
  // This is intended for development and should be removed in production.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ignore ESLint build errors.
  // This is intended for development and should be removed in production.
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    // Disable image optimization to ensure compatibility
    // with Firebase Hosting and Capacitor WebView.
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
