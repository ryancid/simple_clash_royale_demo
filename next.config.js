/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api-assets.clashroyale.com"],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
