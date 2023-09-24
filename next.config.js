/** @type {import('next').NextConfig} */

const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/],
  // sw: "worker.ts",
  disable: process.env.NODE_ENV === "development",
});
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/apiAuth/:slug",
        destination: "https://pomodoro.api.atseeds.com/v1/auth/:slug",
      },
      {
        source: "/apiDetail/:slug",
        destination: "https://pomodoro.api.atseeds.com/v1/:slug",
      },
      {
        source: "/apiProject/:slug",
        destination: "https://pomodoro.api.atseeds.com/v1/project/:slug",
      },
      {
        source: "/apiTask/:slug",
        destination: "https://pomodoro.api.atseeds.com/v1/task/:slug",
      },
      {
        source: "/apiPayment/:slug",
        destination: "https://pomodoro.api.atseeds.com/v2/payment/:slug",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
    ],
    minimumCacheTTL: 1500000,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.mp3$/,
      use: {
        loader: "file-loader",
      },
    });

    return config;
  },
};

module.exports = withPWA(nextConfig);

// const compose = require("next-compose");
// module.exports = compose([
//   {
//     webpack(config, options) {
//       config.module.rules.push({
//         test: /\.mp3$/,
//         use: {
//           loader: "file-loader",
//         },
//       });
//       return config;
//     },
//   },
//   {
//     async rewrites() {
//       return [
//         {
//           source: "/auth/signup",
//           destination: "http://atseeds.com/v1/auth/signup",
//         },
//       ];
//     },
//   },
// ]);
