import React from "react";
import PostCard from "../utilities/postCard";
import AuthorPost from "../utilities/authorPost";
import Image from "next/image";
import cloudinaryLoader from "@/app/lib/cloudinary";
import Link from "next/link";
import EmptyFull from "../ui/emptyFull";
import { Locale } from "@/app/lib/locale/i18n/types";
import {
  formatAuthorDate,
  safeText,
  safeTitle,
  truncateText,
} from "@/app/lib/textHelpers";
import { Post } from "@/app/types/apiResponse";
import SaveArticleButton from "../utilities/saveArticleButton"; // <-- Import added

const MorePosts = ({ posts, lang }: { posts: Post[]; lang: Locale }) => {
  const post0 = posts[0];
  const post1 = posts[1];
  const post2 = posts[2];
  const post3 = posts[3];
  const post4 = posts[4];

  // Helper to generate URLs cleanly
  const getPostUrl = (p: Post) =>
    `/journal/${p.slug || ""}?id=${p.id || ""}&type=${p.type === "post" ? "main" : p.type || "main"}`;

  return (
    <section className="flex flex-col border-sub-bottom" id="morePosts">
      {posts.length < 1 ? (
        <div className="lg:flex">
          <EmptyFull lang={lang} />
          <div className="border-sub-side"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:h-[95vh] border-sub-bottom">
            <div className="lg:w-[35%] w-full h-full px-4 py-6">
              {post0 && (
                <div className="relative block lg:h-[70%] w-full">
                  <SaveArticleButton
                    postId={post0.id}
                    url={getPostUrl(post0)}
                    title={safeTitle(post0.title?.rendered)}
                    excerpt={truncateText(post0.excerpt?.rendered, 18)}
                  />
                  <Link
                    href={getPostUrl(post0)}
                    className="block w-full h-full"
                  >
                    <PostCard
                      category={post0.type || "posts"}
                      excerpt={truncateText(post0.excerpt?.rendered, 18)}
                      title={safeTitle(post0.title?.rendered)}
                      readTime={`${post0.acf?.reading_time || "10"} mins read`}
                      imageHeight="lg:h-[60%] h-[50vh]"
                      imageSrc="/images/homepage/home4.png"
                      imageAlt={safeTitle(post0.title?.rendered)}
                    />
                  </Link>
                </div>
              )}
              {post1 && (
                <div className="relative block h-[30%] mt-5">
                  <SaveArticleButton
                    postId={post1.id}
                    url={getPostUrl(post1)}
                    title={safeTitle(post1.title?.rendered)}
                    excerpt={post1.excerpt?.rendered?.replace(
                      /(<([^>]+)>)/gi,
                      "",
                    )}
                  />
                  <Link
                    href={getPostUrl(post1)}
                    className="block w-full h-full"
                  >
                    <AuthorPost
                      author={post1.author || "Author"}
                      image={""}
                      title={
                        safeTitle(post1.title?.rendered)
                          .split(" ")
                          .slice(0, 15)
                          .join(" ") + "..."
                      }
                      date={formatAuthorDate(post1.date)}
                      readTime={`${post1.acf?.reading_time || "10"} min Read`}
                    />
                  </Link>
                </div>
              )}
            </div>

            {post2 && (
              <div className="relative block lg:w-[65%] w-full lg:h-full p-6 border-sub-side">
                <SaveArticleButton
                  postId={post2.id}
                  url={getPostUrl(post2)}
                  title={safeTitle(post2.title?.rendered)}
                  excerpt={truncateText(post2.excerpt?.rendered, 18)}
                />
                <Link href={getPostUrl(post2)} className="block w-full h-full">
                  <PostCard
                    category={post2.type || "posts"}
                    excerpt={truncateText(post2.excerpt?.rendered, 18)}
                    title={safeTitle(post2.title?.rendered)}
                    readTime={`${post2.acf?.reading_time || "10"} mins read`}
                    imageHeight="lg:h-[80%] h-[50vh]"
                    imageSrc="/images/homepage/home5.png"
                    imageAlt={safeTitle(post2.title?.rendered)}
                  />
                </Link>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row w-full p-6 gap-6 justify-center items-center border-sub-right">
            {post3 && (
              <div className="relative block rounded-2xl overflow-hidden h-[50vh] w-full lg:w-[50%] bg-foreground/10 border-sub">
                <SaveArticleButton
                  postId={post3.id}
                  url={getPostUrl(post3)}
                  title={safeTitle(post3.title?.rendered)}
                  excerpt={post3.excerpt?.rendered?.replace(
                    /(<([^>]+)>)/gi,
                    "",
                  )}
                />
                <Link href={getPostUrl(post3)} className="block w-full h-full">
                  <Image
                    loader={cloudinaryLoader}
                    src={"/images/homepage/home4.png"}
                    alt={safeTitle(post3.title?.rendered)}
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-full"
                  />
                </Link>
              </div>
            )}
            <div className="flex flex-col lg:w-[50%] gap-2 justify-between">
              <div>
                <h2 className="text-[1.3rem] font-semibold mb-3">
                  {post3
                    ? safeTitle(post3.title?.rendered)
                        .split(" ")
                        .slice(0, 10)
                        .join(" ")
                    : ""}
                </h2>

                <p className="opacity-50">
                  {post3
                    ? safeText(post3.excerpt?.rendered)
                        .split(" ")
                        .slice(0, 30)
                        .join(" ")
                    : ""}
                  ...
                </p>
              </div>
              {post4 && (
                <div className="relative mt-4">
                  <SaveArticleButton
                    postId={post4.id}
                    url={getPostUrl(post4)}
                    title={safeTitle(post4.title?.rendered)}
                    excerpt={post4.excerpt?.rendered?.replace(
                      /(<([^>]+)>)/gi,
                      "",
                    )}
                  />
                  <Link href={getPostUrl(post4)}>
                    <AuthorPost
                      author={post4.author || "Author"}
                      image={""}
                      title={safeTitle(post4.title?.rendered)}
                      date={formatAuthorDate(post4.date)}
                      readTime={`${post4.acf?.reading_time || "10"} min Read`}
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
