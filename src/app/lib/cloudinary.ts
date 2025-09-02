"use client";

import type { ImageLoader } from "next/image";

const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  if (src.startsWith("/")) {
    // Let Next.js fallback to its default static handling
    return src;
  }

  return `https://res.cloudinary.com/dv7vjs0s0/image/upload/f_auto,q_auto,w_${width}/${src}`;
};

export default cloudinaryLoader;
