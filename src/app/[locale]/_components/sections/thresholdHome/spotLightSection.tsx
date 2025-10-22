import cloudinaryLoader from "@/app/lib/cloudinary";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowRight, FaDesktop, FaImage, FaRegEdit } from "react-icons/fa";

const SpotLightSection = () => {
  const spotLights = [
    {
      id: 0,
      title: "Lorem, ipsum.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam deleniti sed praesentium.",
      icon: "/icons/imac.svg",
      alt: "desktop icon",
    },
    {
      id: 1,
      title: "Lorem, ipsum.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam deleniti sed praesentium.",
      icon: "/icons/edit.svg",
      alt: "edit icon",
    },
    {
      id: 2,
      title: "Lorem, ipsum.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam deleniti sed praesentium.",
      icon: "/icons/chart.svg",
      alt: "chart icon",
    },
  ];

  return (
    <section className="flex items-center flex-col justify-center py-12 px-3 my-14">
      <div className="flex justify-center flex-col items-center gap-4">
        <h2 className="font-bold text-[2rem] lg:text-[3rem]">
          Spotlight on Innovation (AI)
        </h2>
        <p className="w-[70%] text-center">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus animi
          architecto molestiae repudiandae, quidem magni.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-14 mt-14 grid-cols-1 md:grid-cols-2">
        {spotLights.map(({ id, title, description, icon, alt }) => {
          return (
            <div key={id} className="flex text-center flex-col gap-4 items-center">
              <div className="">
                <Image 
                   loader={cloudinaryLoader}
                  src={icon}
                  alt={alt}
                  width={100}
                  height={100}

                
                />
              </div>
              <h3 className="font-semibold">Lorem, ipsum.</h3>
              <p className="w-[80%] text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
                deleniti sed praesentium.
              </p>
              <Link
                href={"#"}
                className="flex gap-2 py-1 px-2 rounded-lg border-sub items-center"
              >
                Learn More <FaArrowRight />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SpotLightSection;
