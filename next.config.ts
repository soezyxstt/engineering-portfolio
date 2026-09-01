import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": [
      "./public/**/*",
      "public/**/*",
      "**/*.glb",
      "**/*.mp4",
      "**/*.png",
      "**/*.jpeg",
      "**/*.jpg",
      "**/*.webp",
      "node_modules/@libsql/linux-*",
      "node_modules/@libsql/darwin-*",
      "node_modules/@libsql/win32-*",
    ],
  },
};

export default nextConfig;
