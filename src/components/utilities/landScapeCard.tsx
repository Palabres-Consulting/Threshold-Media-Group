"use client";

import React from "react";
import Image from "next/image";
import SaveArticleButton from "./saveArticleButton";
import ShareArticleButton from "./shareArticleButton";
import { truncateText } from "@/app/helpers/textHelpers";
import cloudinaryLoader from "@/app/helpers/cloudinary";
import Link from "next/link";

const LandScapeCard: React.FC<{
  category: string;
  image: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  postId: number;
  postUrl: string;
  site: string;
  slug: string;
}> = ({
  category,
  image,
  title,
  date,
  readTime,
  excerpt,
  postId,
  postUrl,
  site,
  slug,
}) => {
  return (
    <div className="flex flex-row bg-[var(--background)] rounded-2xl overflow-hidden border border-[var(--foreground)]/10 shadow-sm w-full h-[110px] sm:h-[120px]">
      {/* Left Column: Cover Image Image Area */}
      <div className="relative h-full w-[120px] sm:w-[150px] shrink-0">
        <Image
          src={image || "/placeholder.png"} // Fallback handling
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Column: Dynamic Content Frame Area */}
      <div className="flex flex-col justify-between flex-1 p-3 min-w-0">
        {/* Top Text Segment */}
        <div className="min-w-0">
          <Link href={postUrl}>
            <p className="text-[13px] sm:text-base font-bold leading-snug text-[var(--foreground)] line-clamp-2">
              {/* Category Prefix Tag */}
              <span className="text-accent-main inline mr-1">
                {category.replace("&amp;", "&").replace("&quot;", '"')}.
              </span>
              {truncateText(title, 60)}
            </p>
          </Link>
        </div>

        {/* Bottom Metadata Bar with Buttons */}
        <div className="flex items-center justify-between w-full text-[10px] tracking-wider uppercase font-semibold text-[var(--foreground)]/40 mt-1">
          {/* Subtitle Metadata Brand string Label */}
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
            <span className="truncate">{site || "EXPAT MAIL"}</span>
          </div>

          {/* Clean Interactive Action Buttons Wrapper Frame */}
          <div className="flex items-center gap-x-1 shrink-0 ml-2 text-[var(--foreground)]">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <ShareArticleButton
                url={`/journal/${slug || ""}?id=${postId || ""}&type=${site}`}
                title={title}
                customRightStyle="static" // 👈 Strips absolute offsets
              />
            </div>
            <div className="relative w-7 h-7 flex items-center justify-center">
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
    </div>
  );
};

export default LandScapeCard;
