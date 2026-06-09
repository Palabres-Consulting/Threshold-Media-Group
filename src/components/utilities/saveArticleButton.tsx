"use client";

import React, { memo } from "react";
import { useArticleSave } from "@/app/[locale]/hook/useArticles";
import { Bookmark, BookMarked, BookmarkPlus } from "lucide-react";

interface SaveArticleButtonProps {
  postId: number;
  url: string;
  title: string;
  excerpt?: string;
  overlay?: boolean;
}

const SaveArticleButton = memo(function SaveArticleButton({
  postId,
  url,
  title,
  excerpt = "",
  overlay = false,
}: SaveArticleButtonProps) {
  // 1. We completely ignore isInitializing now
  const { isSaved, isSaving, message, toggleSave } = useArticleSave({
    postId,
    url,
    title,
    excerpt,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave();
  };

  return (
    <div className="z-[60] flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={isSaving} // 2. Only disable if actively saving/removing
        aria-label="Save article"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 disabled:opacity-50   ${
          overlay
            ? isSaved
              ? "bg-foreground/90 border border-foreground text-background shadow-sm"
              : "text-white hover:bg-background/80 backdrop-blur-md shadow-sm"
            : isSaved
              ? "bg-transparent text-green-600"
              : "text-foreground hover:opacity-80"
        }`}
      >
        {/* 3. Removed the spinner. Only show ... during active click, otherwise show icons */}
        {isSaving ? (
          <span className="text-[8px] animate-pulse">...</span>
        ) : isSaved ? (
          <BookMarked size={13} className="text-green-400" />
        ) : (
          <Bookmark size={12} />
        )}
      </button>
      {message && (
        <span
          className={`text-[10px] px-2 py-1 rounded bg-background shadow-md ${isSaved ? "text-green-600" : "text-red-500"}`}
        >
          {message}
        </span>
      )}
    </div>
  );
});

export default SaveArticleButton;
