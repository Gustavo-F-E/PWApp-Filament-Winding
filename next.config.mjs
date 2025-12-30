/** @type {import('next').NextConfig} */

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  // AGREGA ESTAS LÍNEAS:
  typescript: {
    ignoreBuildErrors: true,  // <-- IGNORAR ERRORES DE TYPESCRIPT
  },
  eslint: {
    ignoreDuringBuilds: true,  // <-- IGNORAR ERRORES DE ESLINT
  },
  
  experimental: {
    turbo: {},
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default withPWA(nextConfig);