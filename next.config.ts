import type { NextConfig } from "next";

const projectRoot = __dirname;

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  serverExternalPackages: ["postgres"],
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
