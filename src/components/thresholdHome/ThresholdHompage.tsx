import React from "react";
import AboutTheGroup from "./aboutTheGroup";
import SpotLightSection from "./spotLightSection";
import { TranslationSchema } from "@/lib/locale";
import StatsTracker from "./statsTracker";
import { Locale } from "@/app/[locale]/context/types";
import MediaSection from "./mediaSection";
import Image from "next/image";
import cloudinaryLoader from "@/app/helpers/cloudinary";

const ThresholdHompage = ({
  dict,
  locale,
}: {
  dict: TranslationSchema["main"];
  locale: Locale;
}) => {
  return (
    <section className=" mx-2 border-sub-side lg:mx-10 relative overflow-hidden 2xl:mx-auto">
      {/* TOP STATISTICS */}

      <StatsTracker />

      {/* HERO */}

      <div className="lg:p-6 p-3 flex flex-col ">
        <div className="w-full rounded-2xl  relative overflow-hidden">
          <div className="absolute  lg:h-full z-40 w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent">    </div>
          <div className=" border-sub  flex items-end bg-foreground/10 overflow-hidden aspect-video lg:h-full ">
            <div className="p-8 px- flex flex-col gap-3 z-50">
              <h1 className="lg:text-[3rem] text-[1.1rem] font-bold lg:w-[85%] z-50 text-white">
                {dict.hero.headline}
              </h1>
            </div>

                  <Image
              loader={cloudinaryLoader}
              src={"/images/homepage/Home.svg"}
              alt={`Hero Image`}
              fill
              className="object-cover w-full h-full absolute z-10"
              // unoptimized
            />
          </div>
        </div>
        <MediaSection dict={dict} />
      </div>

      <AboutTheGroup dict={dict} id="aboutTheGroup" />
      <SpotLightSection t={dict.hero} />
      {/* <EditorialTeam dict={dict} id="editorialTeam" /> */}
      {/* <LatestArticleReads locale={locale} /> */}
      {/* <Brands
        title={dict.brands.title}
        description={dict.brands.description}
        id="Brands"
      /> */}
    </section>
  );
};

export default ThresholdHompage;
