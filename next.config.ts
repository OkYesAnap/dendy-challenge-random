/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // Динамически определяем basePath
  basePath: process.env.GITHUB_ACTIONS ? '/dendy-challenge-random' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/dendy-challenge-random' : '',

  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;