"use client";

import React from "react";
import Image from "next/image";
import SaveArticleButton from "../utilities/saveArticleButton";
import ShareArticleButton from "../utilities/shareArticleButton";
import cloudinaryLoader from "@/app/helpers/cloudinary";
import Link from "next/link";

interface CardProps {
  title: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  postUrl: string;
  postId: number;
  site: string;
  slug: string;
  excerpt: string;
}

export default function VerticalPostCard({
  title,
  category,
  image,
  postId,
  postUrl,
  site,
  slug,
  excerpt,
}: CardProps) {
  return (
    <div className="flex flex-col rounded-2xl  bg-[var(--background)] border border-[var(--foreground)]/10 overflow-hidden shadow-sm min-w-0">
      {/* Top Card Image Area */}
      <div className="relative w-full h-[110px] shrink-0 bg-[var(--foreground)]/5">
        <Image
          loader={cloudinaryLoader}
          src={image || "/placeholder.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Frame Content Section */}
      <div className="flex flex-col justify-between flex-1 p-3 min-w-0">
        <div>
          <Link href={postUrl}>
            <p className="text-xs sm:text-sm font-bold leading-snug text-[var(--foreground)] line-clamp-2">
              <span className="text-accent-main inline mr-1">{category}.</span>
              {title}
            </p>
          </Link>
        </div>

        <div className="flex items-center justify-between w-full text-[10px] tracking-wider uppercase font-semibold text-[var(--foreground)]/40 mt-2">
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
            <span className="truncate">{category || "SOURCE"}</span>
          </div>

          <div className="flex items-center gap-x-1 shrink-0 ml-2 text-[var(--foreground)]">
            <ShareArticleButton
              url={`/journal/${slug}?id=${postId}&type=${site}`}
              title={title}
              customRightStyle="static"
            />
            <SaveArticleButton
              postId={postId}
              url={postUrl}
              title={title}
              excerpt={excerpt}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
