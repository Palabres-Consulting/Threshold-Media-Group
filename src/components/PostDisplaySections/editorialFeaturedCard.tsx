"use client";

import React from "react";
import Image from "next/image";
import cloudinaryLoader from "@/app/helpers/cloudinary";
import SaveArticleButton from "../utilities/saveArticleButton";
import ShareArticleButton from "../utilities/shareArticleButton";
import LandScapeCard from "../utilities/landScapeCard";

interface EditorialFeaturedCardProps {
  title: string;
  excerpt: string;
  author: string;
  image: string;
  id: number;
  postUrl: string;
  slug: string;
  site: string;
  category: string;
  date: string;
  readTime: string;
}

export default function EditorialFeaturedCard({
  title,
  excerpt,
  author,
  image,
  id,
  postUrl,
  slug,
  site,
  category,
  date,
  readTime,
}: EditorialFeaturedCardProps) {
  return (
    <div className="flex flex-col justify-between h-full min-w-0">
      <div className="flex flex-col gap-3">
        {/* Large Center Feature Image Banner */}
        <div className="relative w-full h-[240px] sm:h-[280px] overflow-hidden bg-[var(--foreground)]/5">
          <Image
            loader={cloudinaryLoader}
            src={image || "/placeholder.jpg"}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Big Bold Headline Title */}
        <h2 className=" text-xl sm:text-2xl font-bold leading-tight text-[var(--foreground)] hover:opacity-85 cursor-pointer transition-opacity">
          {title}
        </h2>

        {/* Italicized Description Excerpt */}
        <p className="text-sm  text-[var(--foreground)]/70  leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* Author Metadata Identification */}
        {/* <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--foreground)]/40">
          {author || "Anonymous Source"}
        </span> */}

        {/* Action Buttons Wrapper Row */}
        <div className="flex justify-between  ">
          <div className="flex items-center gap-1.5 truncate">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5 shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--foreground)]/40">
              {category || "SOURCE"}
            </span>
          </div>

          <div className="flex item-center gap-2">
            <ShareArticleButton
              url={`/journal/${slug || ""}?id=${id || ""}&type=${site}`}
              title={title}
              customRightStyle="static"
            />
            <SaveArticleButton
              postId={id}
              url={postUrl}
              title={title}
              excerpt={excerpt}
            />
          </div>
        </div>
      </div>

      <div className="">
        <LandScapeCard
          date={date}
          readTime={readTime}
          title={title}
          excerpt={excerpt}
          // author={author}
          image={image}
          postId={id}
          postUrl={postUrl}
          slug={slug}
          site={site}
          category={category}
        />
      </div>
    </div>
  );
}
