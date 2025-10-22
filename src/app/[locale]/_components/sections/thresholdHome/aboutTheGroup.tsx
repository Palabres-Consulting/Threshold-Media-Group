import cloudinaryLoader from "@/app/lib/cloudinary";
import Image from "next/image";
import React from "react";


const AboutTheGroup: React.FC<{ dict: any; id: string }> = ({ dict, id }) => {
  return (
    <section className="  px-3 lg:px-6 ">
      <div className="flex flex-col lg:flex-row lg:justify-between mt-4 lg:gap-x-28 gap-10 py-8">
        <div className="lg:w-[55%] border-t-2 border-solid border-accent-main py-8">
          <h2 className="text-lg font-bold text-accent-main mb-5">Mission</h2>
          <h4 className="text-[1.8rem] font-semibold">
            {dict.about.intro.headline}
          </h4>
          <div className="mt-10">
            <GroupStatistics textAlign="" />
          </div>
        </div>
        <div className="lg:w-[45%] flex flex-col gap-5 border-t-2 border-solid border-accent-main py-8">
          <h2 className="font-bold text-accent-main text-lg">Vision</h2>
          <h5 className="text-[1.4rem]">{dict.about.intro.paragraph1}</h5>
          <div className="text-sm gap-5 flex flex-col">
            <p>{dict.about.intro.paragraph2}</p>
            <p>{dict.about.intro.paragraph3}</p>
          </div>
        </div>
      </div>

    
    </section>
  );
};

export default AboutTheGroup;

export const GroupStatistics: React.FC<{ textAlign: string }> = ({
  textAlign,
}) => {
  type Stat = {
    id: number;
    title: string;
    value: string | null;
    images: { id: number; src: string; alt: string }[] | null;
  };

  const stats: Stat[] = [
    {
      id: 0,
      title: "audiences",
      value: "112",
      images: null,
    },
    {
      id: 1,
      title: "langues",
      value: null,
      images: [
        {
          id: 0,
          src: "/images/flags/uk.svg",
          alt: "UK Flag",
        },
        { id: 1, src: "/images/flags/france.svg", alt: "France Flag" },
        { id: 2, src: "/images/flags/chinese.svg", alt: "China Flag" },
      ],
    },

    {
      id: 2,
      title: "portee geographique",
      value: "5",
      images: null,
    },
  ];

  return (
    <div className=" flex gap-10 lg:gap-5  justify-between flex-col md:flex-row">
      {stats.map(({ id, title, value, images }) => {
        return images ? (
          <div key={id} className={`flex flex-col ${textAlign}`}>
            <span className="text-sm font-bold ml-2 mb-6">{title}</span>
            <div className="flex gap-3">
              {images.map(({ id: imgId, src, alt }) => (
                <Image
                  loader={cloudinaryLoader}
                  key={imgId}
                  src={src}
                  alt={alt}
                  width={38}
                  height={38}
                />
              ))}
            </div>
          </div>
        ) : (
          <div key={id} className={`flex flex-col ${textAlign}`}>
            <span className="text-sm font-bold ml-2">{title}</span>
            <span className="lg:text-[3rem] text-[3rem] text-orange-600 font-bold leading-20">
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
