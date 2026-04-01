
import React from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import AboutTheGroup from "./aboutTheGroup";
import EditorialTeam from "./EditorialTeam";
import SpotLightSection from "./spotLightSection";
import LatestArticleReads from "./latestArticleReads";
import PressMentions, { Brands } from "./pressMentions";
import { getTranslations } from "@/app/lib/locale/i18n/getTranslations";
import { TranslationSchema } from "@/app/lib/locale";
import StatsTracker from "./statsTracker";
import { Locale } from "@/app/[locale]/context/types";

const ThresholdHompage =  ({dict, locale}: {dict: TranslationSchema["main"], locale: Locale}) => {
 

  return (
    <section className="">
      {/* TOP STATISTICS */}

      <StatsTracker />
 
      {/* HERO */}

      <div className="lg:p-6 p-3 flex flex-col ">
        <div className="w-full rounded-2xl h-[85vh]  relative overflow-hidden">
          <div className="absolute  lg:h-full  w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent"></div>
          <div className=" border-sub  flex items-end bg-foreground/10 overflow-hidden h-[70vh] lg:h-full">
            <div className="p-8 px- flex flex-col gap-3 z-50">
              <h1 className="lg:text-[3rem] text-[1.1rem] font-bold lg:w-[85%] z-50 text-white">
                {dict.hero.headline}
              </h1>
            </div>

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

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
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
              <p className="text-sm">
                {dict.hero.extractionText}
              </p>
            </div>
          </div>
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
              <p className="text-sm">
                {dict.hero.asintText}
              </p>
            </div>
          </div>
        </div>
      </div>

      <AboutTheGroup dict={dict} id="aboutTheGroup" />
      <SpotLightSection t={dict.hero} />
      {/* <EditorialTeam dict={dict} id="editorialTeam" /> */}
      <LatestArticleReads locale= {locale} />
      {/* <Brands
        title={dict.brands.title}
        description={dict.brands.description}
        id="Brands"
      /> */}
    </section>
  );
};

export default ThresholdHompage;
