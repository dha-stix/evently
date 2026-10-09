import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't auto-generate AI-assistant note files in the project.
  agentRules: false,
  images: {
    // Event cover images uploaded to Firebase Storage
    remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com" }],
  },
};

export default nextConfig;
