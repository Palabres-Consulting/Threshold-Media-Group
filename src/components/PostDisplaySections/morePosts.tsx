import React from "react";
import PostCard from "../utilities/postCard";
import AuthorPost from "../utilities/authorPost";
import Image from "next/image";
import cloudinaryLoader from "@/app/helpers/cloudinary";
import Link from "next/link";
import EmptyFull from "../ui/emptyFull";
import { Locale } from "@/lib/locale/i18n/types";
import { formatAuthorDate, truncateText } from "@/app/helpers/textHelpers";
import { NormalizedPost } from "@/app/types/apiResponse"; // <-- New Clean Type
import SaveArticleButton from "../utilities/saveArticleButton";
import ShareArticleButton from "../utilities/shareArticleButton";
import TriSaveShareCategory from "../utilities/triSaveShareCategory";

const MorePosts = ({
  posts,
  lang,
  site,
}: {
  posts: NormalizedPost[];
  lang: Locale;
  site: string;
}) => {
  if (posts.length < 5) {
    return null;
  }

  // 1. Array Destructuring for cleaner variable assignment
  const [post0, post1, post2, post3, post4] = posts || [];

  return (
    <section className="flex flex-col border-sub-bottom" id="morePosts">
      {posts.length < 1 ? (
        <div className="lg:flex">
          <EmptyFull lang={lang} />
          <div className="border-sub-side"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row  border-sub-bottom">
            <div className="lg:w-[35%] w-full h-full px-4 py-6">
              {/* Post 0 - Top Left */}
              {post0 && (
                <div className="relative block lg:h-[70%] w-full">
                  <PostCard
                    slug={post0.slug}
                    postId={post0.id}
                    postUrl={post0.postUrl}
                    site={site}
                    category={post0.topCategory}
                    excerpt={truncateText(post0.excerpt, 18)}
                    title={post0.title}
                    readTime={post0.readTimeLabel}
                    imageHeight="aspect-video h-full"
                    imageSrc={post0.imageUrl}
                    imageAlt={post0.title}
                  />
                </div>
              )}

              {/* Post 1 - Bottom Left (Author Post) */}
              {post1 && (
                <div className="relative block h-full mt-5">
                  <Link href={post1.postUrl} className="block w-full h-full">
                    <AuthorPost
                      slug={post1.slug}
                      postId={post1.id}
                      postUrl={post1.postUrl}
                      site={site}
                      excerpt={truncateText(post1.excerpt, 18)}
                      category={post1.topCategory}
                      image={""}
                      title={
                        post1.title.split(" ").slice(0, 15).join(" ") + "..."
                      }
                      date={formatAuthorDate(post1.date)}
                      readTime={post1.readTimeLabel}
                    />
                  </Link>
                </div>
              )}
            </div>

            {/* Post 2 - Middle Large Column */}
            {post2 && (
              <div className="relative  lg:w-[65%] w-full h-full p-6  border-sub-side">
                <div className="relative">
                  <PostCard
                    slug={post2.slug}
                    postId={post2.id}
                    postUrl={post2.postUrl}
                    site={site}
                    category={post2.topCategory}
                    excerpt={truncateText(post2.excerpt, 18)}
                    title={post2.title}
                    readTime={post2.readTimeLabel}
                    imageHeight="aspect-video h-full"
                    imageSrc={post2.imageUrl}
                    imageAlt={post2.title}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row - Post 3 & 4 */}
          <div className="flex flex-col lg:flex-row w-full p-6 gap-6 justify-center items-center border-sub-right">
            {post3 && (
              <div className="relative block rounded-2xl overflow-hidden aspect-video w-full lg:w-[50%] bg-foreground/10 border-sub">
                <Link href={post3.postUrl} className="block w-full h-full">
                  <Image
                    loader={cloudinaryLoader}
                    src={post3.imageUrl}
                    alt={post3.title}
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-full"
                  />
                </Link>
              </div>
            )}

            <div className="flex flex-col lg:w-[50%] gap-2 justify-between">
              {post3 && (
                <div>
                  <Link href={post3.postUrl} className="block w-full h-full">
                    <h2 className="text-base sm:text-base font-bold leading-snug mb-3">
                      {post3.title.split(" ").slice(0, 10).join(" ")}
                      {post3.title.split(" ").length > 15 ? "..." : ""}
                    </h2>
                  </Link>
                  <p className="opacity-90 text-sm">
                    {post3.excerpt.split(" ").slice(0, 20).join(" ")}...
                  </p>

                  <TriSaveShareCategory
                    category={post3.topCategory}
                    slug={post3.slug}
                    id={post3.id}
                    site={site}
                    title={post3.title}
                    postUrl={post3.postUrl}
                    excerpt={truncateText(post3.excerpt, 18)}
                  />
                </div>
              )}

              {post4 && (
                <div className="relative mt-4">
                  <Link href={post4.postUrl}>
                    <AuthorPost
                      slug={post4.slug}
                      postId={post4.id}
                      postUrl={post4.postUrl}
                      site={site}
                      excerpt={truncateText(post4.excerpt, 18)}
                      category={post4.topCategory}
                      image={""}
                      title={post4.title}
                      date={formatAuthorDate(post4.date)}
                      readTime={post4.readTimeLabel}
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default MorePosts;
