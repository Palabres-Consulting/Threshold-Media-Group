"use client"
import React from "react";
import EmptyState from "./empty";
import { useLocalization } from "../../context/localizationContext";

interface EmptyStateProps {
  lang: "en" | "fr";
  title?: string;
  description?: string;
}

const EmptyFull = ({ lang, title, description }: EmptyStateProps) => {
  const { locale } = useLocalization();

  return (
    <div className=" text-[var(--foreground)]  top-0 left-0 w-full h-full z-[999] stick">
      <div className="w-full py-20  backdrop-blur-xs flex items-center justify-center">
        {/* <header className="mb-12 border-b border-[var(--foreground)]/10 pb-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              {site.toUpperCase()}
            </h1>
          </header> */}

        {/* Empty State Call */}
        <div className="container mx-auto px-4">
          <EmptyState
            title={title}
            description={description}
            locale={lang as "en" | "fr"}
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyFull;
