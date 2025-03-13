/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: isProduction ? '/dendy-challenge-random' : '',
  assetPrefix: isProduction ? '/dendy-challenge-random/' : '',
  images:{
    domains: ['localhost'],
    unoptimized: true,
  }
};

module.exports = nextConfig