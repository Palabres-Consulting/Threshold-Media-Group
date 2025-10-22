import cloudinaryLoader from "@/app/lib/cloudinary";
import Image from "next/image";
import React from "react";

const organizations = [
  {
    id: 0,
    name: "Forbes",
    logo: "",
  },
  {
    id: 1,
    name: "TechCrunch",
    logo: "",
  },
  {
    id: 2,
    name: "The Verge",
    logo: "",
  },
  {
    id: 3,
    name: "Wired",
    logo: "",
  },
  {
    id: 4,
    name: "Bloomberg",
    logo: "",
  },
  {
    id: 5,
    name: "Reuters",
    logo: "",
  },
];

const PressMentions: React.FC<{
  title: string;
  description: string;
  id: string;
}> = ({ title, description, id }) => {
  return (
    <section className="text-center flex flex-col gap-4 my-14 py-10" id={id}>
      <h1 className="text-[3rem] font-bold">{title}</h1>
      <p className="text-center">{description}</p>

      <div className="flex flex-col lg:flex-row gap-6 mt-6 lg:px-6 px-3">
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
            <p className="text-sm text-left">
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
            <p className="text-sm text-left">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
              velit reprehenderit sed neque deleniti inventore.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PressMentions;

export const Brands: React.FC<{
  title: string;
  description: string;
  id: string;
}> = ({ title, description, id }) => {
  const brands = [
    {
      id: 0,
      src: "/logos/talentql.svg",
      altText: "Logo: TalentQL",
    },
    {
      id: 1,
      src: "/logos/softcom.svg",
      altText: "Logo: SoftCom",
    },
    {
      id: 2,
      src: "/logos/nestle.svg",
      altText: "Logo: Nestle",
    },
    {
      id: 3,
      src: "/logos/bolt.svg",
      altText: "Logo: Bolt",
    },
    {
      id: 4,
      src: "/logos/fliqpay.svg",
      altText: "Logo: FliqPay",
    },
    {
      id: 5,
      src: "/logos/lendsqr.svg",
      altText: "Logo: LendSqr",
    },
  ];

  return (
    <section className="text-center flex flex-col gap-4 my-14 py-10" id={id}>
      <h1 className="text-[3rem] font-bold">{title}</h1>
      <p className="text-center">{description}</p>

      <div className="grid lg:grid-cols-6 p-5 md:grid-cols-3 grid-cols-2 justify-center items-center gap-6 mt-10">
        {brands.map(({ id, src, altText }) => {
          return (
            <div
              key={id}
              className=" w-40 h-20  bg-white shadow-md rounded-lg text-[1.6rem] p-6 text-center flex items-center justify-center"
            >
              <Image
                loader={cloudinaryLoader}
                src={src}
                alt={altText}
                width={90}
                height={90}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
