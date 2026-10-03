import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": [
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
  outputFileTracingIncludes: {
    "/f/*": ["./public/resume/*.pdf"],
  },
};

export default nextConfig;
