// components/sections/ThresholdOpinions.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import AuthorPost from "../utilities/authorPost";
import CategoryTime from "../utilities/category&time";
import AuthorTime from "../utilities/author&time";
import EmptyFull from "../ui/emptyFull";
import SaveArticleButton from "../utilities/saveArticleButton";
import ShareArticleButton from "../utilities/shareArticleButton";
import cloudinaryLoader from "@/app/helpers/cloudinary";
import { Locale } from "@/lib/locale/i18n/types";
import { formatAuthorDate, truncateText } from "@/app/helpers/textHelpers";
import { NormalizedPost } from "@/app/types/apiResponse";
import OpinionFeedGrid from "./opinionFeedGrid";

interface ThresholdOpinionsProps {
  posts: NormalizedPost[];
  lang: Locale;
  site: string;
}

const ThresholdOpinions = ({
  posts = [],
  lang,
  site,
}: ThresholdOpinionsProps) => {

  console.log("ThresholdOpinions received posts length:", posts.length);

  if (posts.length < 4) {
    return null;
  }



  // Destructure content slots safely
  const [featuredPost, ...subPosts] = posts;
  // Limit bottom feed strictly to 3 tracking column instances
  const opinionFeed = subPosts.slice(0, 3);
  const opinionFeed2 = subPosts.slice(3, 6);

  return (
    <section
      className="flex flex-col bg-accent-main/5 border-sub-right"
      id="thresholdOpinions"
    >
      <div className="px-6 pt-6">
        {/* <h2 className="text-[2rem] font-bold">Threshold Opinion</h2> */}
      </div>

      {posts.length < 5 ? (
        <div className="flex">
          <EmptyFull lang={lang} />
          <div className="border-sub-side"></div>
        </div>
      ) : (
        <>
          {opinionFeed.length > 0 && (
            <OpinionFeedGrid opinionFeed={opinionFeed} />
          )}
          {/* Top Featured Split Row */}
          {featuredPost && (
            <div className="flex flex-col lg:flex-row w-full p-6 gap-6 justify-center items-center">
              {/* Media Asset Wrapper Container */}
              <div className="relative rounded-2xl overflow-hidden aspect-video w-full lg:w-[50%] bg-foreground/10 border-sub">
                <Link
                  href={featuredPost.postUrl}
                  className="block w-full h-full"
                >
                  <Image
                    loader={cloudinaryLoader}
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-full"
                  />
                </Link>
              </div>

              {/* Text Block Analytics Wrapper */}
              <div className="flex flex-col lg:w-[50%] gap-2 justify-between h-full ">
                <CategoryTime
                  back={false}
                  bg={true}
                  category={featuredPost.topCategory}
                  readTime={featuredPost.readTimeLabel}
                />
                <div>
                  <Link
                    href={featuredPost.postUrl}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <h2 className="text-sm sm:text-sm font-bold leading-snug">
                      {truncateText(featuredPost.title, 15)}
                    </h2>
                  </Link>
                  <p className="opacity-70 mt-2 text-xs leading-relaxed">
                    {truncateText(featuredPost.excerpt, 20)}
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <SaveArticleButton
                      postId={featuredPost.id}
                      url={featuredPost.postUrl}
                      title={featuredPost.title}
                      excerpt={truncateText(featuredPost.excerpt, 18)}
                    />
                    <ShareArticleButton
                      url={`/journal/${featuredPost.slug || ""}?id=${featuredPost.id || ""}&type=${site}`}
                      title={featuredPost.title}
                      customRightStyle=""
                    />
                  </div>
                </div>

                <div className="relative pt-4 ">
                  <Link href={featuredPost.postUrl}>
                    <AuthorPost
                      slug={featuredPost.slug}
                      postId={featuredPost.id}
                      postUrl={featuredPost.postUrl}
                      site={site}
                      excerpt={truncateText(featuredPost.excerpt, 18)}
                      category={featuredPost.topCategory}
                      image={""}
                      title={truncateText(featuredPost.title, 12)}
                      date={formatAuthorDate(featuredPost.date)}
                      readTime={featuredPost.readTimeLabel}
                    />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Layer Variable Column Feed */}
          {opinionFeed2.length > 0 && (
            <OpinionFeedGrid opinionFeed={opinionFeed2} />
          )}
        </>
      )}
    </section>
  );
};

export default ThresholdOpinions;
