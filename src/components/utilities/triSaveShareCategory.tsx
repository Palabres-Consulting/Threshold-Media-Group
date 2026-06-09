import React from "react";
import ShareArticleButton from "./shareArticleButton";
import SaveArticleButton from "./saveArticleButton";

interface TriSaveShareCategoryProps {
  category: string;
  slug: string;
  id: number;
  site: string;
  title: string;
  postUrl: string;
  excerpt: string;
}

const TriSaveShareCategory = ({
  category,
  slug,
  id,
  site,
  title,
  postUrl,
  excerpt,
}: TriSaveShareCategoryProps) => {
  return (
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
  );
};

export default TriSaveShareCategory;
