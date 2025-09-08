import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dv7vjs0s0/image/upload/**",
      },
    ],
    loader: "custom",
    loaderFile: "./src/app/lib/cloudinary.ts", // no `loader: "custom"`
  },
};

export default nextConfig;
