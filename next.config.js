/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint 9 flat config is incompatible with Next.js 13's built-in
    // linting pass. Linting runs separately via `npm run lint`.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
