"use client";

import React from "react";
import { useArticleSave } from "@/app/[locale]/hook/useArticles"; // Adjust path to your hook

interface SaveArticleButtonProps {
  postId: number; // <-- 1. ADDED THIS
  url: string;
  title: string;
  excerpt?: string;
}

export default function SaveArticleButton({
  postId, // <-- Destructured here
  url,
  title,
  excerpt = "",
}: SaveArticleButtonProps) {
  
  // 2. FIXED: Use the props passed into this component, not the UniquePost variables
  const { isSaved, isInitializing, isSaving, message, toggleSave } = useArticleSave({
    postId: postId,
    url: url,
    title: title,
    excerpt: excerpt,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the parent <Link> from navigating when clicked
    e.stopPropagation(); // Stops the click event from bubbling up
    toggleSave();
  };

  // 3. FIXED: Combine isInitializing and isSaving for the disabled state
  const isButtonDisabled = isInitializing || isSaving;

  return (
    <div className="absolute top-4 right-4 z-[60] flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={isButtonDisabled} 
        aria-label="Save article"
        className={`flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border transition-all duration-300 shadow-sm ${
          isSaved
            ? "bg-foreground/90 border-foreground text-background"
            : "bg-background/50 border-foreground/20 text-foreground hover:bg-background/80"
        } disabled:opacity-50`}
      >
        {isInitializing ? (
           // Show a tiny spinner when the page is first loading the user's saved list
          <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin"></span>
        ) : isSaving ? (
          // Show ... when the user actually clicks the button
          <span className="text-[10px]">...</span>
        ) : isSaved ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
        )}
      </button>
      {message && (
        <span className={`text-[10px] px-2 py-1 rounded bg-background shadow-md ${isSaved ? "text-green-600" : "text-foreground"}`}>
          {message}
        </span>
      )}
    </div>
  );
}