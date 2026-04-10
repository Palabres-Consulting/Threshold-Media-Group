"use client";

import { TranslationSchema } from "@/app/lib/locale";
import Link from "next/link";
import React from "react";
import { useHomeLink } from "../../base/logo";
import Image from "next/image";
import cloudinaryLoader from "@/app/lib/cloudinary";

const MediaSection = ({ dict }: { dict: TranslationSchema["main"] }) => {
  const { asintLink, extractionLink } = useHomeLink();

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-6">
      <Link href={extractionLink}>
        <div className="flex flex-col gap-4 rounded-2xl  h-[40vh]">
          <div className="flex items-center justify-center rounded-2xl overflow-hidden relative bg-foreground/5 h-[80%]">
            <div className="absolute  lg:h-full z-40 w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-black/50">
              {" "}
            </div>

            <h1 className="font-semibold text-[2rem] z-50 text-white">
              EXTRACTION
            </h1>

            <Image
              loader={cloudinaryLoader}
              src={"/images/homepage/home2.png"}
              alt={`Extraction Image`}
              width={1000}
              height={1000}
              className="object-cover w-full h-full absolute"
              // unoptimized
            />
          </div>
          <div className="">
            <p className="text-sm text-left">{dict.hero.extractionText}</p>
          </div>
        </div>
      </Link>
      <Link href={asintLink}>
        <div className="flex flex-col gap-4 rounded-2xl  h-[40vh]">
          <div className="flex items-center justify-center relative overflow-hidden bg-foreground/5 rounded-2xl h-[80%]">
            <div className="absolute  lg:h-full z-40 w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-black/50">
              {" "}
            </div>

            <h1 className="font-semibold text-[2rem] z-50 text-white">ASINT</h1>

            <Image
              loader={cloudinaryLoader}
              src={"/images/homepage/home3.png"}
              alt={`ASINT Image`}
              width={1000}
              height={1000}
              className="object-cover w-full h-full absolute"
              // unoptimized
            />
          </div>
          <div className="">
            <p className="text-sm text-left">{dict.hero.asintText}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MediaSection;
