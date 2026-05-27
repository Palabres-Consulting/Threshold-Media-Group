// components/sections/GreatReads.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import CategoryTime from "../utilities/category&time";
import EmptyFull from "../ui/emptyFull";
import SaveArticleButton from "../utilities/saveArticleButton";
import ShareArticleButton from "../utilities/shareArticleButton";
import cloudinaryLoader from "@/app/helpers/cloudinary";
import { Locale } from "@/lib/locale/i18n/types";
import { truncateText } from "@/app/helpers/textHelpers";
import { NormalizedPost } from "@/app/types/apiResponse";

interface GreatReadsProps {
  posts: NormalizedPost[];
  lang: Locale;
  site: string;
}

const GreatReads = ({ posts = [], lang, site }: GreatReadsProps) => {
  return (
    <section className="lg:p-6 p-3 border-sub-right" id="greatReads">
      <h2 className="text-[1.5rem] font-bold mb-8">Great Reads</h2>
      
      {posts.length < 1 ? (
        <EmptyFull lang={lang} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 grid-cols-1">
          {posts.map((post) => {
            return (
              <div
                key={post.id}
                className="group rounded-2xl h-[60vh] flex items-end relative overflow-hidden bg-foreground/5 border border-sub shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Action Controls Header Overlay Layer */}
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                  <ShareArticleButton
                    url={`/journal/${post.slug || ""}?id=${post.id || ""}&type=${site}`}
                    title={post.title}
                    customRightStyle="relative right-0"
                  />
                  <SaveArticleButton
                    postId={post.id}
                    url={post.postUrl}
                    title={post.title}
                    excerpt={truncateText(post.excerpt, 15)}
                    // customRightStyle="relative right-0 top-0"
                  />
                </div>

                {/* Typography Information Panel Base */}
                <div className="p-6 z-40 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-24 text-white">
                  <CategoryTime
                    back={false}
                    bg={true}
                    category={post.topCategory}
                    readTime={post.readTimeLabel}
                  />
                  <Link href={post.postUrl} className="block group-hover:underline mt-3">
                    <h2 className="font-semibold lg:text-[1.4rem] text-[1.1rem] leading-snug drop-shadow-sm text-white">
                      {post.title}
                    </h2>
                  </Link>
                </div>

                {/* Background Backdrop Structural Layer */}
                <div className="absolute inset-0 h-full w-full overflow-hidden z-10">
                  <Image
                    loader={cloudinaryLoader}
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default GreatReads;