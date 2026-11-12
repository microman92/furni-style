import type { NextConfig } from "next";
import path from "node:path";
const config: NextConfig = {
  turbopack: { root: path.resolve(".") },
  outputFileTracingRoot: path.resolve("."),
  images: { remotePatterns: [{ hostname: "images.unsplash.com" }] },
};
export default config;
