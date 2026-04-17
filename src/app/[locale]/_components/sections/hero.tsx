
import cloudinaryLoader from "@/app/lib/cloudinary";
import Image from "next/image";
import React from "react";
import CategoryTime from "../utilities/category&time";
import EmptyState from "../ui/empty";
import Link from "next/link";
import { Post } from "@/app/lib/fetchLib";

export const getTitleValue = (data: Post[] | undefined, key: number) => {
  const item = data?.[key];
  const rawTitle = typeof item?.title === "string" 
    ? item.title 
    : item?.title?.rendered || "Default Title";

  // Replace common WP entities
  return rawTitle
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8211;/g, "–") // En dash
    .replace(/&amp;/g, "&");
};
const Hero = ({ site, posts }: { site: string, posts: Post[] | undefined}) => {
const data = posts;

  // console.log("Posts for site:", site, data);


  const title1 = getTitleValue(data, 0);
  const title2 = getTitleValue(data, 1);
  const title3 = getTitleValue(data, 2);

  const demoTitle1 = data?.[0]?.title?.rendered;

  // console.log( "DEMO TITLE ", demoTitle1);

  return (
    <section className="relative" id="hero">
      <div className="bg-foreground/5 border-sub-y"></div>
      <div className="flex flex-col lg:h-[85vh] lg:flex-row lg:p-5 p-3 gap-8">
        
        {/* Big Hero Image Container - Post [1] */}
        <div className="lg:w-[70%] rounded-2xl relative overflow-hidden h-[70vh] lg:h-full">
          <Link href={`/journal/${data?.[0]?.slug || ""}?id=${data?.[0]?.id || ""}&type=${site}`}>
            <Image
              loader={cloudinaryLoader}
              src={"/images/homepage/home4.png"}
              alt={`Extraction Image 1`}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-3 z-50">
              {/* <CategoryTime
                category={site}
                readTime="10 mins read"
                back={true}
                bg={true}
              /> */}
              <h1 className="lg:text-[2rem] text-[1.1rem] font-semibold lg:w-[85%] text-white">
                {title1.split(" ").slice(0, 10).join(" ")}...
              </h1>
            </div>
          </Link>
        </div>

        <div className="lg:w-[30%] w-full h-full flex flex-col gap-5">
          {/* Top Right Post - Post [2] */}
          <Link href={`/journal/${data?.[1]?.slug || ""}?type=${site}`} className="lg:h-[70%] h-[60vh] flex flex-col gap-5 mb-5 lg:mb-0">
            <div className="rounded-2xl h-[75%] border-sub overflow-hidden bg-foreground/10 relative">
              <Image
                loader={cloudinaryLoader}
                src={"/images/homepage/home5.png"}
                alt={`Extraction Image 2`}
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:h-[25%] flex flex-col gap-3">
              {/* <CategoryTime
                category={site}
                readTime="10 mins read"
                back={false}
                bg={true}
              /> */}
              <h2 className="font-semibold text-[1.1rem]">
                {title2.split(" ").slice(0, 10).join(" ")}...
              </h2>
            </div>
          </Link>

          {/* Bottom Right Post - Post [3] */}
          <Link href={`/journal/${data?.[2]?.slug || ""}?type=${site}`} className="lg:h-[30%] border-sub-top flex items-center gap-4 pt-6">
            <div className="w-[40%] aspect-square lg:h-full rounded-2xl overflow-hidden bg-foreground/10 relative">
              <Image
                loader={cloudinaryLoader}
                src={"/images/homepage/home6.png"}
                alt={`Extraction Image 3`}
                fill
                className="object-cover"
              />
            </div>
            <div className="w-[60%] h-full">
              <div className="flex flex-col gap-2">
                {/* <CategoryTime
                  category={site}
                  readTime="10 mins read"
                  back={false}
                  bg={true}
                /> */}
                <h2 className="font-semibold text-[1.1rem]">
                  {title3.split(" ").slice(0, 8).join(" ")}...
                </h2>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default Hero;