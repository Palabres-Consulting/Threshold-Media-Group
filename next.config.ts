import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dv7vjs0s0/image/upload/**",
      },
    ],
    loader: "custom",
    loaderFile: "./src/app/lib/cloudinary.ts",
  },
};

export default config;
