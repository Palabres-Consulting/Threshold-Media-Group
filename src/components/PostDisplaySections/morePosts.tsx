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

const MorePosts = ({
  posts,
  lang,
  site,
}: {
  posts: NormalizedPost[];
  lang: Locale;
  site: string;
}) => {
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
                  <SaveArticleButton
                    postId={post0.id}
                    url={post0.postUrl}
                    title={post0.title}
                    excerpt={truncateText(post0.excerpt, 18)}
                  />
                  <ShareArticleButton
                    url={`/journal/${post0.slug || ""}?id=${post0.id || ""}&type=${site}`}
                    title={post0.title}
                    customRightStyle="right-16 absolute" // 👈 Sits to the left of the Save Button
                  />
                  <Link href={post0.postUrl} className="block w-full h-full">
                    <PostCard
                      category={post0.topCategory}
                      excerpt={truncateText(post0.excerpt, 18)}
                      title={post0.title}
                      readTime={post0.readTimeLabel}
                      imageHeight="aspect-video h-full"
                      imageSrc={post0.imageUrl}
                      imageAlt={post0.title}
                    />
                  </Link>
                </div>
              )}

              {/* Post 1 - Bottom Left (Author Post) */}
              {post1 && (
                <div className="relative block h-full mt-5">
                  <SaveArticleButton
                    postId={post1.id}
                    url={post1.postUrl}
                    title={post1.title}
                    excerpt={truncateText(post1.excerpt, 18)}
                  />
                  <ShareArticleButton
                    url={`/journal/${post1.slug || ""}?id=${post1.id || ""}&type=${site}`}
                    title={post1.title}
                    customRightStyle="right-16 absolute" // 👈 Sits to the left of the Save Button
                  />
                  <Link href={post1.postUrl} className="block w-full h-full">
                    <AuthorPost
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

                
                  <SaveArticleButton
                  postId={post2.id}
                  url={post2.postUrl}
                  title={post2.title}
                  excerpt={truncateText(post2.excerpt, 18)}
                  />
                <ShareArticleButton
                  url={`/journal/${post2.slug || ""}?id=${post2.id || ""}&type=${site}`}
                  title={post2.title}
                  customRightStyle="right-16 absolute" // 👈 Sits to the left of the Save Button
                  />
                
                <Link href={post2.postUrl} className="block w-full h-full">
                  <PostCard
                    category={post2.topCategory}
                    excerpt={truncateText(post2.excerpt, 18)}
                    title={post2.title}
                    readTime={post2.readTimeLabel}
                    imageHeight="aspect-video h-full"
                    imageSrc={post2.imageUrl}
                    imageAlt={post2.title}
                  />
                </Link>
            </div>
              </div>
            )}
          </div>

          {/* Bottom Row - Post 3 & 4 */}
          <div className="flex flex-col lg:flex-row w-full p-6 gap-6 justify-center items-center border-sub-right">
            {post3 && (
              <div className="relative block rounded-2xl overflow-hidden aspect-video w-full lg:w-[50%] bg-foreground/10 border-sub">
                <SaveArticleButton
                  postId={post3.id}
                  url={post3.postUrl}
                  title={post3.title}
                  excerpt={truncateText(post3.excerpt, 18)}
                />
                <ShareArticleButton
                  url={`/journal/${post3.slug || ""}?id=${post3.id || ""}&type=${site}`}
                  title={post3.title}
                  customRightStyle="right-16 absolute" // 👈 Sits to the left of the Save Button
                />
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
                  <h2 className="text-[1.3rem] font-semibold mb-3">
                    {post3.title.split(" ").slice(0, 10).join(" ")}
                    {post3.title.split(" ").length > 10 ? "..." : ""}
                  </h2>
                  <p className="opacity-90">
                    {post3.excerpt.split(" ").slice(0, 30).join(" ")}...
                  </p>
                </div>
              )}

              {post4 && (
                <div className="relative mt-4">
                  <SaveArticleButton
                    postId={post4.id}
                    url={post4.postUrl}
                    title={post4.title}
                    excerpt={truncateText(post4.excerpt, 18)}
                  />
                  <ShareArticleButton
                    url={`/journal/${post4.slug || ""}?id=${post4.id || ""}&type=${site}`}
                    title={post4.title}
                    customRightStyle="right-16 absolute" // 👈 Sits to the left of the Save Button
                  />
                  <Link href={post4.postUrl}>
                    <AuthorPost
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
