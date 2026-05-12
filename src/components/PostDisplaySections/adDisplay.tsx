import cloudinaryLoader from "@/app/helpers/cloudinary";
import Image from "next/image";
import React from "react";

const AdDisplay = () => {
  return (
    <section className=" w-full h-fit aspect-square overflow-hidden relative ">
      <Image
        loader={cloudinaryLoader}
        src="/images/ads/simandou2040.webp"
        alt="Simandou 2040 Ad"
        className="object-cover w-full transition-transform duration-500 hover:scale-105"
        fill
        priority
      />
    </section>
  );
};

export default AdDisplay;
