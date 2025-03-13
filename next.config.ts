/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProduction ? '/dendy-challenge-random' : '',
  assetPrefix: isProduction ? '/dendy-challenge-random/' : '',
};

export default nextConfig;