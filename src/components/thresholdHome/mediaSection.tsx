"use client";

import { TranslationSchema } from "@/lib/locale";
import Link from "next/link";
import React from "react";
import {
  AsintLogo,
  ExtractionLogo,
  InnovationLogo,
  useHomeLink,
} from "../base/logo";
import Image from "next/image";

const MediaSection = ({ dict }: { dict: TranslationSchema["main"] }) => {
  const { asintLink, extractionLink, innovationLink } = useHomeLink();

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-6">
      <Link href={extractionLink} className="flex-1">
        <div className="flex flex-col gap-4 rounded-2xl  aspect-video">
          <div className="flex items-center justify-center rounded-2xl overflow-hidden relative bg-foreground/5 h-[80%]">
            <div className="absolute  lg:h-full z-40 w-full bg-gradient-to-t from-10% from-black/80 via-black/40 via-30% to-70% to-black/80">
              {" "}
            </div>
            <div className="relative z-50">
              <h1 className="font-serif text-2xl font-bold text-white">
                EXTRACTION
              </h1>
            </div>

            <Image
              src={"/images/extraction/extraction001.png"}
              alt={`Extraction Image`}
              fill
              className="object-cover w-full h-full absolute"
              // unoptimized
            />
          </div>
          <div className="">
            <p className="text-sm text-left">{dict.hero.extractionText}</p>
          </div>
        </div>
      </Link>
      <Link href={asintLink} className="flex-1">
        <div className="flex flex-col gap-4 rounded-2xl  aspect-video">
          <div className="flex items-center justify-center relative overflow-hidden bg-foreground/5 rounded-2xl h-[80%]">
            <div className="absolute  lg:h-full z-40 w-full bg-gradient-to-t from-10% from-black/80 via-black/40 via-30% to-70% to-black/80">
              {" "}
            </div>

            <div className="relative z-50">
              <h1 className="font-serif text-2xl font-bold text-white">
                ASINT
              </h1>
            </div>

            <Image
              src={"/images/homepage/home3.png"}
              alt={`ASINT Image`}
              fill
              className="object-cover w-full h-full  absolute"
              // unoptimized
            />
          </div>
          <div className="">
            <p className="text-sm text-left">{dict.hero.asintText}</p>
          </div>
        </div>
      </Link>
      <Link href={innovationLink} className="flex-1">
        <div className="flex flex-col gap-4 rounded-2xl  aspect-video">
          <div className="flex items-center justify-center relative overflow-hidden bg-foreground/5 rounded-2xl h-[80%]">
            <div className="absolute  lg:h-full z-40 w-full bg-gradient-to-t from-10% from-black/80 via-black/40 via-30% to-70% to-black/80">
              {" "}
            </div>

            <div className="relative z-50">
              <h1 className="font-serif text-2xl font-bold text-white">
                INNOVATION
              </h1>
            </div>

            <Image
              src={"/images/homepage/home3.png"}
              alt={`INNOVATION Image`}
              fill
              className="object-cover w-full h-full absolute"
              // unoptimized
            />
          </div>
          <div className="">
            <p className="text-sm text-left">{dict.hero.innovationText}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MediaSection;
