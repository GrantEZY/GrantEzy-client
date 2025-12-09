import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',

  // --TODO Need to be modified based on project requirements
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
