"use client";

import React from "react";
import SaveArticleButton from "../utilities/saveArticleButton";
import ShareArticleButton from "../utilities/shareArticleButton";
import TriSaveShareCategory from "../utilities/triSaveShareCategory";

interface EditorialTextCardProps {
  title: string;
  excerpt: string;
  author: string;
  id: number;
  postUrl: string;
  slug: string;
  site: string;
  category: string;
}

export default function EditorialTextCard({
  title,
  excerpt,
  author,
  id,
  postUrl,
  slug,
  site,
  category,
}: EditorialTextCardProps) {
  return (
    <div className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 border-b border-[var(--foreground)]/10 last:border-0 min-w-0">
      {/* Title */}
      <h3 className="text-base font-bold leading-snug text-[var(--foreground)] hover:opacity-80 cursor-pointer transition-opacity">
        {title}
      </h3>
      
      {/* Italicized Excerpt */}
      <p className="text-sm  text-[var(--foreground)]/70  line-clamp-3">
        {excerpt}
      </p>

      {/* Author Label */}
      {/* <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--foreground)]/40 mt-1">
        {author || "Anonymous"}
      </span> */}

      {/* Action Buttons Wrapper Row */}
      <TriSaveShareCategory
        category={category}
        slug={slug}
        id={id}
        site={site}
        title={title}
        postUrl={postUrl}
        excerpt={excerpt}
      />
    </div>
  );
}