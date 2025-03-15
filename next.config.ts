/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";
const isDev = process.env.NODE_ENV === 'development';
const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: isDev ? '' : '/dendy-challenge-random',
  assetPrefix: isDev ? '' : '/dendy-challenge-random/',
  images:{
    domains: ['localhost'],
    unoptimized: true,
  }
};

module.exports = nextConfig