import cloudinaryLoader from "@/app/helpers/cloudinary";
import Image from "next/image";
import React from "react";

const AdDisplay = () => {
  return (
    <section className=" w-full">
      <Image
        loader={cloudinaryLoader}
        src="/images/ads/simandou2040.webp"
        alt="Simandou 2040 Ad"
        className="object-cover h-full w-full transition-transform duration-500 hover:scale-105"
        priority
        width={1000}
        height={1000}
      />
    </section>
  );
};

export default AdDisplay;
