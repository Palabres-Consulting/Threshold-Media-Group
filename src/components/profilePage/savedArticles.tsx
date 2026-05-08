"use client";

import React from "react";
import CategoryTime from "../utilities/category&time";
import Link from "next/link";
import SaveArticleButton from "../utilities/saveArticleButton"; // Adjust path
import { useSavedArticles } from "@/app/[locale]/hook/useArticles"; // Adjust path

const SavedArticles = () => {
  const { data: articles, isLoading, isError } = useSavedArticles();

  if (isLoading) {
    return (
      <div className="flex justify-center p-10 text-foreground/50">
        Loading saved articles...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-red-500">
        Failed to load saved articles. Please try again later.
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="p-10 text-center text-foreground/50 border border-sub rounded-2xl">
        You haven't saved any articles yet.
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-5" id="savedArticles">
      {articles.map((article, index) => {
        return (
          <div
            key={article.id}
            className={`${
              index !== articles.length - 1 ? "border-sub-bottom pb-6" : ""
            } flex gap-5 lg:flex-row flex-col relative`}
          >
            {/* Wrap image placeholder in Link so it's clickable */}
            <Link
              href={article.wp_url}
              className="lg:w-[20%] relative h-[10em] lg:h-[7.5em] rounded-2xl overflow-hidden bg-foreground/10 block"
            >
              {/* Future Image Component goes here */}
            </Link>

            <div className="lg:w-[80%] h-full flex lg:gap-5 gap-2 justify-between items-start">
              <Link href={article.wp_url} className="p-2 flex flex-col gap-2 flex-grow">
                <CategoryTime
                  category="Saved" // We don't save category strictly, so generic fallback
                  readTime="" 
                  back={false}
                  bg={true}
                />
                <h2 className="font-semibold text-[1.3rem]">{article.title}</h2>
                {article.excerpt && (
                  <p className="text-sm text-foreground/60 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </Link>

              {/* Replacing the static bookmark with our working button! */}
              {/* The wrapper div ensures absolute positioning stays localized */}
              <div className="relative w-12 h-12 shrink-0">
                <SaveArticleButton
                  postId={article.post_id}
                  url={article.wp_url}
                  title={article.title}
                  excerpt={article.excerpt || ""}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default SavedArticles;