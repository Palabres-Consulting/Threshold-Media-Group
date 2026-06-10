"use client";

import React from "react";
import SaveArticleButton from "../utilities/saveArticleButton";
import ShareArticleButton from "../utilities/shareArticleButton";
import Link from "next/link";

interface CardProps {
  title: string;
  category: string;
  postUrl: string;
  postId: number;
  site: string;
  slug: string;
  excerpt: string;
}

export default function TextOnlyCard({
  title,
  category,
  postUrl,
  postId,
  site,
  slug,
  excerpt,
}: CardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-[var(--background)] border border-[var(--foreground)]/10  p-4 shadow-sm min-w-0">
      <div className="min-w-0">
        <Link href={postUrl}>
          <p className="text-xs sm:text-sm font-bold  leading-snug text-[var(--foreground)] line-clamp-4">
            <span className="text-accent-main inline mr-1">{category}.</span>
            {title}
          </p>
        </Link>
      </div>

      <div className="flex items-center justify-between w-full text-[10px] tracking-wider uppercase font-semibold text-[var(--foreground)]/40 mt-3 pt-2 border-t border-[var(--foreground)]/5">
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
  );
}
