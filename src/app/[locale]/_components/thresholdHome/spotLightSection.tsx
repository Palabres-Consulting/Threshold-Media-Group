import cloudinaryLoader from "@/app/lib/cloudinary";
import { TranslationSchema } from "@/app/lib/locale";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

// Assuming you pass the translation object or use a hook like useTranslations('hero')
const SpotLightSection = ({ t }: { t: TranslationSchema["main"]["hero"]} ) => {
  const spotLights = [
    {
      id: "asint",
      title: t.pillars.asint.title, // "Strategic Monitoring"
      description: t.pillars.asint.description,
      icon: "/icons/imac.svg",
      alt: "desktop icon",
    },
    {
      id: "extraction",
      title: t.pillars.extraction.title, // "Sectoral Reports"
      description: t.pillars.extraction.description,
      icon: "/icons/edit.svg",
      alt: "edit icon",
    },
    {
      id: "data",
      title: t.pillars.data.title, // "Predictive Analysis"
      description: t.pillars.data.description,
      icon: "/icons/chart.svg",
      alt: "chart icon",
    },
  ];

  return (
    <section className="flex items-center flex-col justify-center py-12 px-3 my-14">
      <div className="flex justify-center flex-col items-center gap-4">
        <h2 className="font-bold text-[2rem] lg:text-[3rem] text-center">
          {t.spotlight.title}
        </h2>
        <p className="w-full lg:w-[70%] text-center">
          {t.spotlight.description}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-14 mt-14 grid-cols-1 md:grid-cols-2">
        {spotLights.map(({ id, title, description, icon, alt }) => {
          return (
            <div key={id} className="flex text-center flex-col gap-4 items-center">
              <div className="relative w-[100px] h-[100px]">
                <Image
                  loader={cloudinaryLoader}
                  src={icon}
                  alt={alt}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-semibold text-xl">{title}</h3>
              <p className="w-[90%] lg:w-[80%] text-sm">
                {description}
              </p>
              {/* <Link
                href={`/services/${id}`}
                className="flex gap-2 py-2 px-4 mt-2 transition-all hover:bg-gray-50 rounded-lg border border-sub items-center text-sm font-medium"
              >
                {t.pillars[id as keyof typeof t.pillars].cta} <FaArrowRight className="text-xs" />
              </Link> */}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SpotLightSection;