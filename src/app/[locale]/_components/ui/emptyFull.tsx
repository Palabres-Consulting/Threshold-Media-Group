import React from "react";
import EmptyState from "./empty";
import { useBrowserLanguage } from "../../hook/usePosts";

interface EmptyStateProps {
  locale: "en" | "fr";
  title?: string;
  description?: string;
}

const EmptyFull = ({ locale, title, description }: EmptyStateProps) => {
  const lang = useBrowserLanguage();
  return (
    <div className="bg-[var(--background)]/50  text-[var(--foreground)]  top-0 left-0 w-full h-full z-[999] sticky">
      <div className="w-full h-screen bg-[var(--background)]/40 backdrop-blur-xs flex items-center justify-center">
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
