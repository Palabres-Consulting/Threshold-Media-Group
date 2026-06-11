import cloudinaryLoader from "@/app/helpers/cloudinary";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AdDisplay = () => {
  return (
    <section className=" w-full h-fit aspect-square overflow-hidden relative ">
      <Link
        href="https://www.simandou2040.gn/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/images/ads/simandou2040.webp"
          alt="Simandou 2040 Ad"
          className="object-cover w-full transition-transform duration-500 hover:scale-105"
          fill
          priority
        />
      </Link>
    </section>
  );
};

export default AdDisplay;
