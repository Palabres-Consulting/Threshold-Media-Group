import React from "react";
import PostCard from "../utilities/postCard";
import AuthorPost from "../utilities/authorPost";
import Image from "next/image";
import cloudinaryLoader from "@/app/lib/cloudinary";
import { Post } from "@/app/lib/fetchLib";
import EmptyFull from "../ui/emptyFull";
import { Locale } from "@/app/lib/locale/i18n/types";
import {
  formatAuthorDate,
  safeText,
  safeTitle,
  truncateText,
} from "@/app/lib/textHelpers";

const MorePosts = ({ posts, lang }: { posts: Post[]; lang: Locale }) => {
  const post0 = posts[0];
  const post1 = posts[1];
  const post2 = posts[2];
  const post3 = posts[3];
  const post4 = posts[4];

  return (
    <section className="flex flex-col border-sub-bottom" id="morePosts">
      {posts.length < 1 ? (
        <div className="lg:flex">
          <EmptyFull lang={lang} />
          <div className="border-sub-side"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:h-[85vh] border-sub-bottom">
            <div className="lg:w-[35%] w-full h-full px-4 py-6">
              <div className="lg:h-[70%] w-full">
                <PostCard
                  category={post0?.type || "posts"}
                  excerpt={truncateText(post0?.excerpt?.rendered, 18)}
                  title={safeTitle(post0?.title?.rendered)}
                  readTime={`${post0?.acf?.reading_time || "10"} mins read`}
                  imageHeight="lg:h-[60%] h-[50vh]"
                  imageSrc="/images/homepage/home4.png"
                  imageAlt={safeTitle(post0?.title?.rendered)}
                />
              </div>
              <div className="h-[30%] mt-5">
                <AuthorPost
                  author={post1?.author || "Author"}
                  image={""}
                  title={safeTitle(post1?.title?.rendered)}
                  date={formatAuthorDate(post1?.date)}
                  readTime={`${post1?.acf?.reading_time || "10"} min Read`}
                />
              </div>
            </div>

            <div className="lg:w-[65%] w-full lg:h-full p-6 border-sub-side">
              <PostCard
                category={post2?.type || "posts"}
                excerpt={truncateText(post2?.excerpt?.rendered, 18)}
                title={safeTitle(post2?.title?.rendered)}
                readTime={`${post2?.acf?.reading_time || "10"} mins read`}
                imageHeight="lg:h-[80%] h-[50vh]"
                imageSrc="/images/homepage/home5.png"
                imageAlt={safeTitle(post2?.title?.rendered)}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row w-full p-6 gap-6 justify-center items-center border-sub-right">
            <div className="rounded-2xl overflow-hidden h-[50vh] w-full lg:w-[50%] bg-foreground/10 border-sub">
              <Image
                loader={cloudinaryLoader}
                src={post3?.slug ? "/images/homepage/home4.png" : "/images/homepage/home4.png"}
                alt={post3 ? safeTitle(post3.title?.rendered) : "Post image"}
                width={1000}
                height={1000}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col lg:w-[50%] gap-2 justify-between">
              {/* <CategoryTime
                back={false}
                bg={true}
                category={post4?.type || "posts"}
                readTime={`${post4?.acf?.reading_time || "10"} mins read`}
              /> */}
              <div>
                <h2 className="text-[1.3rem] font-semibold mb-3">
                  {safeTitle(post4?.title?.rendered.split(" ").slice(0, 10).join(" "))}
                </h2>

                <p className="opacity-50">
                  {safeText(post4?.excerpt?.rendered.split(" ").slice(0, 30).join(" "))}...
                </p>
              </div>

              <div>
                <AuthorPost
                  author={post4?.author || "Author"}
                  image={""}
                  title={safeTitle(post4?.title?.rendered)}
                  date={formatAuthorDate(post4?.date)}
                  readTime={`${post4?.acf?.reading_time || "10"} min Read`}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default MorePosts;
