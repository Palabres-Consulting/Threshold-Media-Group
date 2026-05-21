"use client";

import React, { memo } from "react";
import { useArticleSave } from "@/app/[locale]/hook/useArticles";

interface SaveArticleButtonProps {
  postId: number;
  url: string;
  title: string;
  excerpt?: string;
}

const SaveArticleButton = memo(function SaveArticleButton({
  postId,
  url,
  title,
  excerpt = "",
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
    <div className="absolute top-4 right-4 z-[60] flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={isSaving} // 2. Only disable if actively saving/removing
        aria-label="Save article"
        className={`flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md border transition-all duration-300 shadow-sm ${
          isSaved
            ? "bg-foreground/90 border-foreground text-background"
            : "bg-background/50 border-foreground/20 text-foreground hover:bg-background/80"
        } disabled:opacity-50`}
      >
        {/* 3. Removed the spinner. Only show ... during active click, otherwise show icons */}
        {isSaving ? (
          <span className="text-[8px] animate-pulse">...</span>
        ) : isSaved ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
        )}
      </button>
      {message && (
        <span className={`text-[10px] px-2 py-1 rounded bg-background shadow-md ${isSaved ? "text-green-600" : "text-red-500"}`}>
          {message}
        </span>
      )}
    </div>
  );
});

export default SaveArticleButton;