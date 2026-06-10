"use client";

import React, { useTransition } from "react";
import { useQueryState } from "nuqs";
import { Search, Loader2, Newspaper } from "lucide-react";
import { searchParamsParsers } from "@/app/helpers/searchParams";
import LandScapeCard from "../utilities/landScapeCard";
import { NormalizedPost } from "@/app/types/apiResponse";

interface SearchInterfaceClientProps {
  initialQuery: string;
  site: string;
  results: {
    innovation: any[];
    extraction: any[];
    asint: any[];
  };
}

export default function SearchInterfaceClient({
  initialQuery,
  site,
  results,
}: SearchInterfaceClientProps) {
  const [isPending, startTransition] = useTransition();

  // Sync search input and navigation state directly to URL search states via nuqs
  const [query, setQuery] = useQueryState(
    "q",
    searchParamsParsers.q.withOptions({
      shallow: false, // Triggers server-side re-evaluation on search updates
      startTransition,
    }),
  );

  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    searchParamsParsers.tab.withOptions({
      shallow: true, // Shallow state switching for instant response tabs without server refetches
    }),
  );

  const activeResults = results[activeTab as keyof typeof results] || [];

  const tabMeta = [
    { id: "innovation", name: "Innovation & Tech", count: results.innovation.length },
    {
      id: "extraction",
      name: "Extraction Intel",
      count: results.extraction.length,
    },
    { id: "asint", name: "ASINT Network", count: results.asint.length },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Debounce or update on input action directly
    setQuery(val || null);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Search Input Control Shell */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
        <input
          type="text"
          defaultValue={initialQuery}
          onChange={handleInputChange}
          placeholder="Type search terms across indices (e.g. AI, Minerals, Defense)..."
          className="w-[50%] pl-12 pr-12 py-2 bg-foreground/[0.03] border border-sub/20 rounded-2xl  font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        {isPending && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}
      </div>

      {/* Conditional Subtree: Display results or empty states */}
      {initialQuery.trim().length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-sub/20 rounded-3xl bg-foreground/[0.005]">
          <Search className="w-12 h-12 text-foreground/20 mb-4" />
          <h3 className="text-xl font-bold tracking-tight">
            Awaiting Search Request
          </h3>
          <p className="text-sm text-foreground/40 max-w-sm mt-1">
            Enter queries above to look up articles across global network
            categories.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Navigation Tabs Layer */}
          <div className="flex border-b border-foreground/10 gap-2 overflow-x-auto scrollbar-none">
            {tabMeta.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm font-bold uppercase tracking-tight whitespace-nowrap px-4 pb-4 transition-all relative ${
                    isActive
                      ? "text-foreground border-b-2 border-foreground"
                      : "text-foreground/40 hover:text-foreground"
                  }`}
                >
                  {tab.name}
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-foreground text-background"
                        : "bg-foreground/5 text-foreground/50"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results Output Field Matrix */}
          {/* Results Output Field Matrix */}
          {activeResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {activeResults.map((post: NormalizedPost) => {
                // 1. Safely resolve dynamic URLs based on subdomain routing rules
                const finalSite = post.type || activeTab;

                // Adapt your routing strategy depending on if it's main vs subdomain architectures
               
                return (
                  <LandScapeCard
                    key={post.id}
                    postId={post.id}
                    slug={post.slug}
                    title={post.title || ""}
                    excerpt={post.excerpt || ""}
                    image={post.imageUrl || ""}
                    category={post.topCategory || "General"}
                    date={post.date || ""}
                    readTime={post.readTimeLabel || "3 Min"}
                    site={finalSite}
                    postUrl={post.postUrl}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-sub/10 rounded-2xl bg-foreground/[0.005]">
              <Newspaper className="w-10 h-10 text-foreground/20 mb-3" />
              <h3 className="text-lg font-bold">No Records Documented</h3>
              <p className="text-sm text-foreground/40 max-w-xs mt-1">
                No matching instances verified inside this specific sub-channel
                segment.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
