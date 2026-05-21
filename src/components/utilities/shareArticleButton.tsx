"use client";

import React, { useState, useEffect } from "react";
import { Share2, Check } from "lucide-react"; // Lightweight icon set

interface ShareArticleButtonProps {
  url: string;       // Relative path from your app, e.g., /journal/slug?type=extraction
  title: string;     // The article title string
  customRightStyle?: string; // 💡 Allows adjusting positioning offsets per card layout variant
}

export default function ShareArticleButton({
  url,
  title,
  customRightStyle = "right-16", // Default positioning sits next to SaveButton (right-4)
}: ShareArticleButtonProps) {
  const [copied, setCopied] = useState(false);

  // Clear clipboard confirmation state automatically after a delay
  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();  // Prevents parent Next.js <Link> wrapper from navigating
    e.stopPropagation(); // Stifles bubbling so card elements don't conflict

    // Build absolute path dynamically based on whatever deployment host environment is active
    const absoluteUrl = `${window.location.origin}${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this article: ${title}`,
          url: absoluteUrl,
        });
      } catch (err) {
        // Handle silently or ignore if user manually aborts choice window sheet
        console.debug("Web share skipped or dismissed:", err);
      }
    } else {
      // 💡 Fallback Engine: Secure Clipboard API Execution
      try {
        await navigator.clipboard.writeText(absoluteUrl);
        setCopied(true);
      } catch (err) {
        console.error("Could not copy link text automatically: ", err);
      }
    }
  };

  return (
    <div className={`absolute top-4 ${customRightStyle} z-[60] flex flex-col items-end gap-1`}>
      <button
        onClick={handleShareClick}
        type="button"
        aria-label="Share article link"
        className={`flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md border transition-all duration-300 shadow-sm ${
          copied
            ? "bg-green-600 border-green-600 text-white"
            : "bg-background/50 border-foreground/20 text-foreground hover:bg-background/80"
        }`}
      >
        {copied ? (
          <Check size={16} className="animate-scaleUp" />
        ) : (
          <Share2 size={16} />
        )}
      </button>

      {copied && (
        <span className="text-[9px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-background text-green-600 shadow-md border border-sub">
          Copied!
        </span>
      )}
    </div>
  );
}