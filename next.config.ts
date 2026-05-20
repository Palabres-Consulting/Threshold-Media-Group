import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dv7vjs0s0/image/upload/**",
      },
      {
        protocol: "https",
        hostname: "wp.tresholdmediagroup.com",
        pathname: "/**", 
      },
      {
        protocol: "https",
        hostname: "hwudgwuoqvrjutlgtxhv.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
    loader: "custom",
    loaderFile: "./src/app/helpers/cloudinary.ts", 
  },

  async rewrites() {
    return [
      {
        source: '/wp-admin/',
        destination: 'https://wp.tresholdmediagroup.com/wp-admin/',
      },
    ]
  },
};

export default nextConfig;
