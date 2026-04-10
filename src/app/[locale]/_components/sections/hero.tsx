"use client";
import cloudinaryLoader from "@/app/lib/cloudinary";
import Image from "next/image";
import React from "react";
import CategoryTime from "../utilities/category&time";
import { usePostsByDomain } from "../../hook/usePosts";
import EmptyState from "../ui/empty";
import Link from "next/link";
import { Post } from "@/app/lib/fetchLib";

export const getTitleValue = (data:  Post[] | undefined, key: number) => {
  const item = data?.[key];

  if (typeof item?.title === "string") {
    return item.title;
  }

  return item?.title?.rendered || "Default Title";
};

const Hero = ({ site }: { site: string }) => {
  const { data, error, isLoading } = usePostsByDomain(
    site as "main" | "extraction" | "asint",
    undefined,
    10,
  );

  console.log("Posts for site:", site, data);

  if (isLoading) {
    return <div className="text-center flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <EmptyState
        title="Error"
        description="An error occurred while fetching posts."
        locale="fr"
      />
    );
  }

  const title1 = getTitleValue(data, 1);

  const title2 = getTitleValue(data, 2);

  const title3 = getTitleValue(data, 3);

  return (
    <Link href={``}>
      <section className="relative" id="hero">
        <div className="bg-foreground/5 border-sub-y"></div>
        <div className="flex flex-col lg:h-[85vh] lg:flex-row lg:p-5 p-3 gap-8">
          <div className="lg:w-[70%] rounded-2xl relative overflow-hidden">
            <div className="absolute  lg:h-full  w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent"></div>
            <div className=" border-sub   flex items-end bg-foreground/10 overflow-hidden h-[70vh] lg:h-full">
              <div className="p-8 px- flex flex-col gap-3 z-50">
                <CategoryTime
                  category="Smartphones"
                  readTime="10 mins read"
                  back={true}
                  bg={true}
                />
                <h1 className="lg:text-[2rem] text-[1.1rem] font-semibold lg:w-[85%] z-50 text-white">
                  {title1.split(" ").slice(0, 10).join(" ")}...
                </h1>
              </div>
            </div>

               {/* <Image
              loader={cloudinaryLoader}
              src={"/images/homepage/home4.png"}
              alt={`Extraction Image`}
              width={1000}
              height={1000}
              className="object-cover w-full h-full absolute"
              // unoptimized
            /> */}
          </div>
          <div className="lg:w-[30%] w-full h-full">
            <div className="lg:h-[70%] h-[60vh] flex flex-col gap-5 mb-5 lg:mb-0">
              <div className="rounded-2xl h-[75%] border-sub overflow-hidden bg-foreground/10">
                 {/* <Image
              loader={cloudinaryLoader}
              src={"/images/homepage/home5.png"}
              alt={`Extraction Image`}
              width={1000}
              height={1000}
              className="object-cover w-full h-full absolute"
              // unoptimized
            /> */}
              </div>
              <div className="lg:h-[25%] flex flex-col gap-3">
                <CategoryTime
                  category="Smartphones"
                  readTime="10 mins read"
                  back={false}
                  bg={true}
                />
                <h2 className="font-semibold text-[1.1rem]">
                                   {title2.split(" ").slice(0, 10).join(" ")}...
                </h2>
              </div>
            </div>
            <div className="lg:h-[30%] border-sub-top flex items-center gap-1 pt-6 ">
              <div className="lg:w-[40%] w-[40%] lg:h-full h-[5.5em] rounded-2xl overflow-hidden bg-foreground/10">
                 {/* <Image
              loader={cloudinaryLoader}
              src={"/images/homepage/home6.png"}
              alt={`Extraction Image`}
              width={1000}
              height={1000}
              className="object-cover w-full h-full absolute"
              // unoptimized
            /> */}
              </div>
              <div className="lg:w-[60%] w-full h-full ">
                <div className="p-2 flex flex-col gap-2">
                  <CategoryTime
                    category="Smartphones"
                    readTime="10 mins read"
                    back={false}
                    bg={true}
                  />
                  <h2 className="font-semibold text-[1.1rem]">
                    {title3.split(" ").slice(0, 10).join(" ")}...
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Link>
  );
};

export default Hero;
