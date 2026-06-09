"use client";

import React from "react";
import Image from "next/image";
import cloudinaryLoader from "@/app/helpers/cloudinary";
import SaveArticleButton from "../utilities/saveArticleButton";

import ShareArticleButton from "../utilities/shareArticleButton";

interface EditorialImageCardProps {
  title: string;
  excerpt: string;
  author: string;
  image: string;
  id: number;
  postUrl: string;
  slug: string;
  site: string;
  category: string;
}

export default function EditorialImageCard({
  title,
  excerpt,
  author,
  image,
  id,
  postUrl,
  slug,
  site,
  category
}: EditorialImageCardProps) {
  return (
    <div className="flex flex-col  gap-2.5 pb-5 last:pb-0 border-b border-[var(--foreground)]/10 last:border-0 min-w-0">
      {/* Article Cover Image */}
      <div className="relative w-full h-[160px] rounded-md overflow-hidden bg-[var(--foreground)]/5">
        <Image 
          loader={cloudinaryLoader}
          src={image || "/placeholder.jpg"} 
          alt={title} 
          fill 
          sizes="(max-width: 1024px) 100vw, 25vw"
          className="object-cover hover:scale-101 transition-transform duration-300" 
        />
      </div>

      {/* Title */}
      <h3 className=" text-base font-bold leading-snug text-[var(--foreground)] hover:opacity-80 cursor-pointer transition-opacity line-clamp-2">
        {title}
      </h3>

      {/* Italicized Excerpt */}
      <p className="text-sm  text-[var(--foreground)]/70  line-clamp-2">
        {excerpt}
      </p>

      {/* Author Label */}
      {/* <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--foreground)]/40">
        {author || "Anonymous"}
      </span> */}

      {/* Action Buttons Wrapper Row */}
      <div className="flex justify-between  mt-1">
        <div className="flex items-center gap-1.5 truncate">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
            <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
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
  );
}