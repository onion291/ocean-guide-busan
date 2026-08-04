import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages is a static host, so emit a fully prerendered site.
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
