"use client";

import React from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import AboutTheGroup from "./aboutTheGroup";
import EditorialTeam from "./EditorialTeam";
import SpotLightSection from "./spotLightSection";
import LatestArticleReads from "./latestArticleReads";
import PressMentions, { Brands } from "./pressMentions";
import { useLocalization } from "@/app/[locale]/context/localizationContext";

const statsData = [
  {
    id: 0,
    title: "Dew Jones",
    stat: "+0.3%",
    status: "bear",
  },
  {
    id: 1,
    title: "Dew Jones",
    stat: "+0.3%",
    status: "bear",
  },
  {
    id: 2,
    title: "Dew Jones",
    stat: "+0.3%",
    status: "bull",
  },
  {
    id: 3,
    title: "Dew Jones",
    stat: "+0.3%",
    status: "bear",
  },
  {
    id: 4,
    title: "Dew Jones",
    stat: "+0.3%",
    status: "bear",
  },
  {
    id: 5,
    title: "Dew Jones",
    stat: "+0.3%",
    status: "bull",
  },
  {
    id: 6,
    title: "Dew Jones",
    stat: "+0.3%",
    status: "bear",
  },
  {
    id: 7,
    title: "Dew Jones",
    stat: "+0.3%",
    status: "bull",
  },
  {
    id: 8,
    title: "Dew Jones",
    stat: "+0.3%",
    status: "bear",
  },
  {
    id: 9,
    title: "Dew Jones",
    stat: "+0.3%",
    status: "bear",
  },
  {
    id: 10,
    title: "Dew Jones",
    stat: "+0.3%",
    status: "bear",
  },
  {
    id: 11,
    title: "Dew Jones",
    stat: "+0.3%",
    status: "bear",
  },
];

const ThresholdHompage = () => {
  const { dict } = useLocalization();

  return (
    <section className="">
      {/* TOP STATISTICS */}

      <div className="lg:p-6 relative flex gap-2 bg-background/90  overflow-hidden">
        <div className="absolute h-full w-full bg-gradient-to-r from-0% from-transparent via-92% via-transparent to-95%  to-background/90"></div>

        {statsData.map(({ id, stat, title, status }) => {
          return (
            <div
              key={id}
              className="flex min-w-[12em] justify-center rounded-md bg-stone-900  py-2 px-6 gap-2 text-xs text-white"
            >
              <h5 className="text-white text-xs text-nowrap">{title}</h5>
              <div
                className={`
                 ${status === "bear" ? "text-green-600" : "text-red-500"}
                flex items-center
                 `}
              >
                <span className="">
                  {status === "bear" ? <FaAngleUp /> : <FaAngleDown />}
                </span>
                {stat}
              </div>
            </div>
          );
        })}
      </div>

      {/* HERO */}

      <div className="lg:p-6 p-3 flex flex-col ">
        <div className="w-full rounded-2xl h-[85vh]  relative overflow-hidden">
          <div className="absolute  lg:h-full  w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent"></div>
          <div className=" border-sub  flex items-end bg-foreground/10 overflow-hidden h-[70vh] lg:h-full">
            <div className="p-8 px- flex flex-col gap-3 z-50">
              <h1 className="lg:text-[3rem] text-[1.1rem] font-bold lg:w-[85%] z-50 text-white">
                Shaping the Future of African Media
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
                velit reprehenderit sed neque deleniti inventore.
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
                velit reprehenderit sed neque deleniti inventore.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AboutTheGroup dict={dict} id="aboutTheGroup"  />
      <SpotLightSection />
      <EditorialTeam dict={dict} id="editorialTeam" />
      <LatestArticleReads />
      <Brands title={dict.brands.title} description={dict.brands.description} id="Brands" />
    </section>
  );
};

export default ThresholdHompage;
