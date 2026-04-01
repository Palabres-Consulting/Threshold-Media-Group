"use client";

import { StickyNote } from "lucide-react";
import React from "react";

interface EmptyStateProps {
  locale: "en" | "fr";
  title?: string;
}

const EmptyState = ({ locale, title }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-500">
      {/* Icon Container with subtle border using foreground opacity */}
      <div className="mb-6 p-6 rounded-full border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.02]">
        <StickyNote 
          className="w-12 h-12 text-[var(--foreground)]/40 animate-pulse" 
          strokeWidth={1.5}
        />
      </div>

      {/* Text Content using theme variables */}
      <div className="max-w-md space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {title ? title : (locale === "fr" ? "Articles à venir" : "Articles Coming Soon")}
        </h2>
        
        <p className="text-[var(--foreground)]/60 text-base leading-relaxed">
          {locale === "fr" 
            ? "Le contenu de cette section est en cours de préparation. Merci de votre patience." 
            : "Content for this section is currently being prepared. Thank you for your patience."}
        </p>
      </div>

      {/* Loading/Waiting Dots */}
      <div className="mt-10 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div 
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[var(--foreground)]/20 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default EmptyState;