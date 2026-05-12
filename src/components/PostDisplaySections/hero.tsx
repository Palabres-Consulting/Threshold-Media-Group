import cloudinaryLoader from "@/app/helpers/cloudinary";
import Image from "next/image";
import React from "react";
import CategoryTime from "../utilities/category&time";
import Link from "next/link";
import { getTopLevelCategory } from "@/app/helpers/categoriesMap";
import { NormalizedPost, Post } from "@/app/types/apiResponse";
import SaveArticleButton from "../utilities/saveArticleButton"; // <-- Import added
import { calculateReadTime } from "@/app/helpers/readTime";

export const getTitleValue = (data: Post[] | undefined, key: number) => {
  const item = data?.[key];
  const rawTitle =
    typeof item?.title === "string"
      ? item.title
      : item?.title?.rendered || "Default Title";

  // Replace common WP entities
  return rawTitle
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8211;/g, "–") // En dash
    .replace(/&amp;/g, "&");
};

const Hero = ({ site, posts }: { site: string; posts: NormalizedPost[] }) => {

const [mainPost, topSidePost, bottomSidePost] = posts;
  const taxonomy =
    site === "extraction" ? "extraction-category" : `${site}-categories`;


  // console.log("post1:", mainPost);

  return (
    <section className="relative " id="hero">
      <div className="bg-foreground/5 border-sub-y"></div>
      <div className="flex flex-col  lg:flex-row lg:p-5 p-3 gap-8  relative">
        {/* Big Hero Image Container - Post [1] */}
        {mainPost && (
          <div className="lg:w-[70%] aspect-video rounded-2xl relative h-full  overflow-hidden  lg:h-full">
            <Link
              href={`/journal/${mainPost.slug || ""}?id=${mainPost.id || ""}&type=${site}`}
            >
              {/* --- SAVE BUTTON ADDED HERE --- */}
              <SaveArticleButton
                postId={mainPost.id}
                url={`/journal/${mainPost.slug || ""}?id=${mainPost.id || ""}&type=${site}`}
                title={mainPost.title}
                excerpt={mainPost.excerpt} // Stripping HTML tags for clean save
              />

              <Image
                loader={cloudinaryLoader}
                src={mainPost.imageUrl || "/images/homepage/home4.png"}
                alt={`Extraction Image 1`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-3 z-50">
                <CategoryTime
                  category={mainPost.topCategory || "Uncategorized"}
                  readTime={`${mainPost.readTimeLabel || "5 mins read"}`}
                  back={true}
                  bg={true}
                />
                <h1 className="lg:text-[2rem] text-[1.1rem] font-semibold lg:w-[85%] text-white">
                  {mainPost.title.split(" ").slice(0, 10).join(" ")}...
                </h1>
              </div>
            </Link>
          </div>
        )}

        <div className="lg:w-[30%] w-full h-full flex flex-col gap-8">
          {/* Top Right Post - Post [2] */}
          {topSidePost && (
            <Link
              href={`/journal/${topSidePost.slug || ""}?type=${site}`}
              className="lg:h-[70%] h-full  flex flex-col gap-5 mb-5 lg:mb-0 relative group"
            >
              {/* --- SAVE BUTTON ADDED HERE --- */}
              <SaveArticleButton
                postId={topSidePost.id}
                url={`/journal/${topSidePost.slug || ""}?type=${site}`}
                title={topSidePost.title}
                excerpt={topSidePost.excerpt}
              />

              <div className="rounded-2xl aspect-video  h-[75%] border-sub overflow-hidden bg-foreground/10 relative">
                <Image
                  loader={cloudinaryLoader}
                  src={topSidePost.imageUrl || "/images/homepage/home5.png"}
                  alt={`Extraction Image 2`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:h-[25%] flex flex-col gap-3">
                <CategoryTime
                  category={topSidePost.topCategory || "Uncategorized"}
                  readTime={`${topSidePost.readTimeLabel || "5 mins read"}`}
                  back={false}
                  bg={true}
                />
                <h2 className="font-semibold text-[1.1rem]">
                  {topSidePost.title.split(" ").slice(0, 10).join(" ")}...
                </h2>
              </div>
            </Link>
          )}

          {/* Bottom Right Post - Post [3] */}
          {bottomSidePost && (
            <Link
              href={`/journal/${bottomSidePost.slug || ""}?type=${site}`}
              className="lg:h-[30%] h-full border-sub-top flex items-center gap-4 pt-6 relative group "
            >
              {/* --- SAVE BUTTON ADDED HERE --- */}
              <SaveArticleButton
                postId={bottomSidePost.id}
                url={`/journal/${bottomSidePost.slug || ""}?type=${site}`}
                title={bottomSidePost.title}
                excerpt={bottomSidePost.excerpt}
              />

              <div className="w-[40%] aspect-[4/3]  h-full rounded-2xl overflow-hidden bg-foreground/10 relative">
                <Image
                  loader={cloudinaryLoader}
                  src={bottomSidePost.imageUrl || "/images/homepage/home6.png"}
                  alt={`Extraction Image 3`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-[60%] h-full">
                <div className="flex flex-col gap-2">
                  <CategoryTime
                    category={bottomSidePost.topCategory || "Uncategorized"}
                    readTime={`${bottomSidePost.readTimeLabel || "5 mins read"}`}
                    back={false}
                    bg={true}
                  />
                  <h2 className="font-semibold text-[1.1rem]">
                    {bottomSidePost.title.split(" ").slice(0, 8).join(" ")}...
                  </h2>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
