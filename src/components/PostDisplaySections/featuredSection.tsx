"use client";

import React from "react";
import { NormalizedPost } from "@/app/types/apiResponse";
import EditorialTextCard from "./editorialTextCard";
import EditorialFeaturedCard from "./editorialFeaturedCard";
import EditorialImageCard from "./editorialImageCard";

interface FeaturedSectionProps {
  site: string;
  sectionTitle?: string;
  posts: NormalizedPost[];
}

export default function FeaturedSection({
  site,
  sectionTitle = "Culture",
  posts,
}: FeaturedSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  // Distribute across columns securely based on array positions
  const leftColumnPosts = posts.slice(0, 3); // Position indices 0, 1, 2
  const mainFeaturedPost = posts[3]; // Position index 3
  const rightColumnPosts = posts.slice(4, 6); // Position indices 4, 5

  return (
    <section className="w-full bg-[var(--background)] px-4 py-6">
      {/* 1. Header String Element with Full-Width Line Boundary */}
      <div className="w-full mb-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] pb-2 border-b border-[var(--foreground)]/20">
          {sectionTitle}
        </h2>
      </div>

      {/* 2. Asymmetrical Editorial Bento Grid Layout Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 items-start">
        {/* COLUMN A: Text-Only Stack Modules (Left 25% span area) */}
        <div className="flex flex-col h-full lg:border-r border-[var(--foreground)]/10 lg:pr-6 md:col-span-1">
          {leftColumnPosts.length > 0 ? (
            leftColumnPosts.map((post) => (
              <EditorialTextCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                author={post.authorName}
                postUrl={post.postUrl}
                id={post.id}
                slug={post.slug}
                site={site}
                category={post.topCategory}
              />
            ))
          ) : (
            <p className="text-xs text-[var(--foreground)]/40">
              No news text entries.
            </p>
          )}
        </div>

        {/* COLUMN B: Prominent Feature Hero Slot Frame (Middle 50% span area) */}
        <div className="md:col-span-2 h-full lg:px-2">
          {mainFeaturedPost ? (
            <EditorialFeaturedCard
              title={mainFeaturedPost.title}
              excerpt={mainFeaturedPost.excerpt}
              author={mainFeaturedPost.authorName}
              image={mainFeaturedPost.imageUrl}
              id={mainFeaturedPost.id}
              postUrl={mainFeaturedPost.postUrl}
              slug={mainFeaturedPost.slug}
              site={site}
              date={mainFeaturedPost.date || ""}
              readTime={mainFeaturedPost.readTimeLabel || ""}
              category={mainFeaturedPost.topCategory || "Uncategorized"}
            />
          ) : (
            <p className="text-xs text-[var(--foreground)]/40">
              Feature slot undefined.
            </p>
          )}
        </div>

        {/* COLUMN C: Cover Photo Stack Block Modules (Right 25% span area) */}
        <div className="flex flex-col gap-6 h-full lg:border-l border-[var(--foreground)]/10 lg:pl-6 md:col-span-1">
          {rightColumnPosts.length > 0 ? (
            rightColumnPosts.map((post) => (
              <EditorialImageCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                author={post.authorName}
                image={post.imageUrl}
                id={post.id}
                postUrl={post.postUrl}
                slug={post.slug}
                site={site}
                category={post.topCategory || "Uncategorized"}
              />
            ))
          ) : (
            <p className="text-xs text-[var(--foreground)]/40">
              No media entries.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
