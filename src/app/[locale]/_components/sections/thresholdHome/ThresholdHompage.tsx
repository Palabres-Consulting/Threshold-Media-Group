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
import Link from "next/link";
import MediaSection from "./mediaSection";
import Image from "next/image";
import cloudinaryLoader from "@/app/lib/cloudinary";

const ThresholdHompage = ({
  dict,
  locale,
}: {
  dict: TranslationSchema["main"];
  locale: Locale;
}) => {
  return (
    <section className="">
      {/* TOP STATISTICS */}

      <StatsTracker />

      {/* HERO */}

      <div className="lg:p-6 p-3 flex flex-col ">
        <div className="w-full rounded-2xl h-[85vh]  relative overflow-hidden">
          <div className="absolute  lg:h-full z-40 w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent">    </div>
          <div className=" border-sub  flex items-end bg-foreground/10 overflow-hidden h-[70vh] lg:h-full">
            <div className="p-8 px- flex flex-col gap-3 z-50">
              <h1 className="lg:text-[3rem] text-[1.1rem] font-bold lg:w-[85%] z-50 text-white">
                {dict.hero.headline}
              </h1>
            </div>

                  <Image
              loader={cloudinaryLoader}
              src={"/images/homepage/Home.svg"}
              alt={`Hero Image`}
              width={1000}
              height={1000}
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
      <LatestArticleReads locale={locale} />
      {/* <Brands
        title={dict.brands.title}
        description={dict.brands.description}
        id="Brands"
      /> */}
    </section>
  );
};

export default ThresholdHompage;
