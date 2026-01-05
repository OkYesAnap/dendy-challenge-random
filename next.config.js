const repositoryName = 'dendy-challenge-random';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  basePath: process.env.NODE_ENV === 'production' ? `/${repositoryName}` : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repositoryName}` : '',

  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;