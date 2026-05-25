// components/PostDisplaySections/sidebar.tsx
"use client";

import React from "react";
import { usePostsByDomain } from "@/app/[locale]/hook/usePosts"; 
import Subscribe from "../forms/subscribe";
import FeaturedPosts from "./featuredPosts"; 
import PopularPosts from "./popularPosts";   
import { Locale } from "@/lib/locale/i18n/types";
import { normalizePosts } from "@/app/helpers/normalizeData";

interface SidebarProps {
  lang: Locale;
  site: "main" | "extraction" | "asint";
}

const Sidebar = ({ lang, site }: SidebarProps) => {
  // Fetch latest posts as a placeholder for "Popular/Featured" (Never leaves it empty)
  const { data: recentPosts, isLoading: isPostsLoading } = usePostsByDomain(site, undefined, 30);

  const normalizedRecentPosts = normalizePosts(recentPosts || [], site); 

  console.log("Sidebar - Recent Posts:", normalizedRecentPosts.length);

  if (isPostsLoading) {
    return (
      <div className="p-6 text-sm text-foreground/50 animate-pulse border-l border-sub min-h-screen">
        Loading sidebar content...
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col border-l border-sub min-h-screen">
      <div className="p-6 flex flex-col gap-6">
        
        {/* 1. Featured / Recent Posts (Top 2 items) */}
        {normalizedRecentPosts && normalizedRecentPosts.length > 0 && (
          <FeaturedPosts posts={normalizedRecentPosts.slice(1, 5)} lang={lang} />
        )}

        {/* 2. Newsletter Subscription Card */}
        {/* <div className="py-6 ">
          <div className="rounded-2xl bg-zinc-900 text-white p-6 relative flex flex-col justify-center items-center overflow-hidden min-h-[180px]">
            <div className="z-10 text-center">
              <h3 className="text-[1.2rem] font-semibold mb-4 leading-snug">
                Stay ahead: Subscribe for executive insights
              </h3>
              <Subscribe />
            </div>
            <div className="bg-gradient-to-br from-neutral-800 to-black opacity-40 absolute inset-0"></div>
          </div>
        </div> */}

        {/* 3. Popular Posts (Remaining 3 items) */}
        {normalizedRecentPosts && normalizedRecentPosts.length > 2 && (
          <PopularPosts posts={normalizedRecentPosts.slice(5, 10)} lang={lang} />
        )}
        
      </div>
    </section>
  );
};

export default Sidebar;