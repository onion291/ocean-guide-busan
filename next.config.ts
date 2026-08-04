import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages is a static host, so emit a fully prerendered site.
  output: "export",
  trailingSlash: true,
  basePath: process.env.GITHUB_PAGES === "true" ? "/ocean-guide-busan" : undefined,
};

export default nextConfig;
