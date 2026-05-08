"use client";

import type { ImageLoader } from "next/image";

const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  // 1. Handle local static images (e.g., "/images/homepage/home4.png")
  if (src.startsWith("/")) {
    return src;
  }

  // 2. Handle external URLs natively (e.g., "https://wp.tresholdmediagroup.com/...")
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // 3. Handle standard Cloudinary uploads
  return `https://res.cloudinary.com/dv7vjs0s0/image/upload/f_auto,q_auto,w_${width}/${src}`;
};

export default cloudinaryLoader;