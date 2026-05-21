"use client"; // 💡 Added to allow client-side DOM layout tracking

import React, { useEffect, useRef } from "react";
import Link from "next/link";

interface SharedHeaderProps {
  title: string;
  locale: "en" | "fr";
  activeCategory?: string; // The current slug
  context?: any; // The result from getCategoryContext
  
  // Specific to Home.tsx (Query Routing)
  isQueryRouting?: boolean;
  topLevelCategory?: any;
  
  // Specific to SharedCategoryLayout (Path Routing)
  basePath?: string;
  rootCategorySlug?: string;
}

export default function SharedHeader({
  title,
  locale,
  activeCategory,
  context,
  isQueryRouting = false,
  topLevelCategory,
  basePath = "",
  rootCategorySlug = "",
}: SharedHeaderProps) {
  
  // 💡 References hooked to target horizontal scroll wrappers
  const layer12NavRef = useRef<HTMLElement>(null);
  const layer3NavRef = useRef<HTMLElement>(null);

  // 💡 Automatically center the active tabs inside viewport boundaries
  useEffect(() => {
    const scrollToActive = (container: HTMLElement | null) => {
      if (!container) return;
      const activeEl = container.querySelector("[data-active='true']");
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center", // Keeps the chosen item neatly centered on screen
        });
      }
    };

    scrollToActive(layer12NavRef.current);
    scrollToActive(layer3NavRef.current);
  }, [activeCategory, context]); // Fires instantly when categories or contexts refresh

  // Helper to cleanly generate URLs based on the routing strategy
  const getHref = (targetSlug?: string, isParentLink = false) => {
    if (isQueryRouting) {
      if (!targetSlug) return `/${locale}`; // The "Overview" link
      return `/${locale}?category=${targetSlug}`;
    } else {
      // Path routing (SharedCategoryLayout)
      if (isParentLink && targetSlug === rootCategorySlug) {
        return basePath; // Go back to the absolute root path
      }
      return `${basePath}/${targetSlug}`;
    }
  };

  return (
    <header className="px-3 border-b border-[var(--foreground)]/10 pb-4 pt-10 ">
      <h1 className="text-4xl lg:text-3xl font-black uppercase tracking-tighter mb-6">
        {title}
      </h1>

      <div className="flex flex-col gap-3 mb-2 w-full overflow-hidden">
        {/* --- LEVEL 1 & 2 ROW (Main Navigation) --- */}
        <nav 
          ref={layer12NavRef} // 💡 Ref added
          className="flex flex-nowrap items-center gap-x-6 overflow-x-auto whitespace-nowrap pb-2 text-sm md:text-base [scrollbar-width:thin] [&::-webkit-scrollbar]:h-[2px] [&::-webkit-scrollbar-thumb]:bg-[var(--foreground)]/10 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {/* === HOME.TSX SPECIFIC: Top-Level Children (When no category is active) === */}
          {isQueryRouting && !activeCategory && topLevelCategory?.categories?.map((link: any) => (
            <Link
              key={link.slug}
              href={getHref(link.slug)}
              className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors pb-1 shrink-0"
            >
              {link.title}
            </Link>
          ))}

          {/* === SHARED CONTEXT: Render Parent and Siblings === */}
          {((isQueryRouting && activeCategory && context) || (!isQueryRouting && context)) && (
            <>
              {context.parentLink && (
                <Link 
                  href={getHref(context.parentLink.slug, true)} 
                  className="font-bold border-b-2 border-[var(--foreground)] text-accent-main pb-1 shrink-0"
                >
                  {context.parentLink.title}
                </Link>
              )}

              {context.navLinks?.map((link: any) => {
                // Determine if this sibling is the active one
                const isActive = context.activeLevel2Slug === link.slug || (!context.activeLevel2Slug && activeCategory === link.slug);
                return (
                  <Link 
                    key={link.slug} 
                    href={getHref(link.slug)} 
                    data-active={isActive ? "true" : "false"} // 💡 Target tag added
                    className={`pb-1 transition-colors shrink-0 ${
                      isActive 
                        ? "font-bold border-b-2 border-[var(--foreground)] text-[var(--foreground)]" 
                        : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* --- LEVEL 3 ROW (Subcategories rendered as pills) --- */}
        {context?.childLinks?.length > 0 && (
          <nav 
            ref={layer3NavRef} // 💡 Ref added
            className="flex flex-nowrap items-center gap-x-4 overflow-x-auto whitespace-nowrap pt-2 pb-2 border-t border-[var(--foreground)]/5 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-[2px] [&::-webkit-scrollbar-thumb]:bg-[var(--foreground)]/10 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            {context.childLinks.map((child: any) => {
              const isChildActive = activeCategory === child.slug;
              return (
                <Link
                  key={child.slug}
                  href={getHref(child.slug)}
                  data-active={isChildActive ? "true" : "false"} // 💡 Target tag added
                  className={`transition-colors px-3 py-1 rounded-full shrink-0 ${
                    isChildActive
                      ? "bg-[var(--foreground)] text-[var(--background)] font-medium"
                      : "bg-[var(--foreground)]/5 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/10"
                  }`}
                >
                  {child.title}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}