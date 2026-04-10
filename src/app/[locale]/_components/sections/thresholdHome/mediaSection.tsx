"use client";

import { TranslationSchema } from "@/app/lib/locale";
import Link from "next/link";
import React from "react";
import { useHomeLink } from "../../base/logo";

const MediaSection = ({ dict }: { dict: TranslationSchema["main"] }) => {
  const { asintLink, extractionLink } = useHomeLink();

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-6">
      <Link href={extractionLink}>
        <div className="flex flex-col gap-4 rounded-2xl  h-[40vh]">
          <div className="flex items-center justify-center rounded-2xl bg-foreground/5 h-[80%]">
            <h1 className="font-semibold text-[2rem]">EXTRACTION</h1>

            <div className="">
              {/* <Image
              loader={cloudinaryLoader}
              src={"v1755525333/hero_image_uxpn9r.png"}
              alt={`Partner: ${name}`}
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
              // unoptimized
              /> */}
            </div>
          </div>
          <div className="">
            <p className="text-sm text-left">{dict.hero.extractionText}</p>
          </div>
        </div>
      </Link>
      <Link href={asintLink}>
        <div className="flex flex-col gap-4 rounded-2xl  h-[40vh]">
          <div className="flex items-center justify-center bg-foreground/5 rounded-2xl h-[80%]">
            <h1 className="font-semibold text-[2rem]">ASINT</h1>

            <div className="">
              {/* <Image
              loader={cloudinaryLoader}
              src={"v1755525333/hero_image_uxpn9r.png"}
              alt={`Partner: ${name}`}
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
              // unoptimized
              /> */}
            </div>
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
