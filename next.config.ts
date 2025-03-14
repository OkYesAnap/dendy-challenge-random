/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: '/dendy-challenge-random',
  // assetPrefix: '/dendy-challenge-random/',
  images:{
    domains: ['localhost'],
    unoptimized: true,
  }
};

module.exports = nextConfig