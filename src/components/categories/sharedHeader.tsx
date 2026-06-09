"use client"; 

import React, { useEffect, useRef } from "react";
import Link from "next/link";

interface SharedHeaderProps {
  title: string;
  locale: "en" | "fr";
  activeCategory?: string; 
  context?: any; // The result from getCategoryContext
  
  // Specific to Home.tsx (Query Routing)
  isQueryRouting?: boolean;
  topLevelCategory?: any;
  
  // Specific to SharedCategoryLayout (Path Routing)
  basePath?: string;
  rootCategorySlug?: string;
}

export default function SharedHeader({
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
    <header className="w-full bg-[var(--background)] px-4">
      {/* Top Thick Solid Border */}
      <div className=" py-4">
        
        {/* --- MAIN NAVIGATION ROW (Centered) --- */}
        <nav 
          ref={layer12NavRef}
          className="flex flex-nowrap items-center justify-left gap-x-4 overflow-x-auto whitespace-nowrap text-xs md:text-sm tracking-wider font-medium text-[var(--foreground)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* === HOME.TSX SPECIFIC: Top-Level Children === */}
          {isQueryRouting && !activeCategory && topLevelCategory?.categories?.map((link: any, index: number) => (
            <React.Fragment key={link.slug}>
              {index > 0 && <span className="text-[var(--foreground)]/20 font-light text-xs">|</span>}
              <Link
                href={getHref(link.slug)}
                className="hover:text-[var(--foreground)] transition-colors text-[var(--foreground)]/70"
              >
                {link.title}
              </Link>
            </React.Fragment>
          ))}

          {/* === SHARED CONTEXT: Render Parent and Siblings === */}
          {((isQueryRouting && activeCategory && context) || (!isQueryRouting && context)) && (
            <>
              {context.parentLink && (
                <>
                  {/* <Link 
                    href={getHref(context.parentLink.slug, true)} 
                    className="font-bold text-[var(--foreground)] border-b border-[var(--foreground)]"
                  >
                    {context.parentLink.title}
                  </Link>
                  <span className="text-[var(--foreground)]/20 font-light text-xs">|</span> */}
                </>
              )}

              {context.navLinks?.map((link: any, index: number) => {
                const isActive = context.activeLevel2Slug === link.slug || (!context.activeLevel2Slug && activeCategory === link.slug);
                return (
                  <React.Fragment key={link.slug}>
                    {index > 0 && <span className="text-[var(--foreground)]/20 font-light text-xs">|</span>}
                    <Link 
                      href={getHref(link.slug)} 
                      data-active={isActive ? "true" : "false"}
                      className={`transition-colors ${
                        isActive 
                          ? "font-bold text-[var(--foreground)] border-b border-[var(--foreground)]" 
                          : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
                      }`}
                    >
                      {link.title}
                    </Link>
                  </React.Fragment>
                );
              })}
            </>
          )}
        </nav>
      </div>

      {/* Bottom Thin Border */}
      <div className="border-[var(--foreground)]/20 w-full mb-3" />

      {/* --- LAYER 3 SUB-ROW (Subcategories) --- */}
      {context?.childLinks?.length > 0 && (
        <nav 
          ref={layer3NavRef}
          className="flex flex-nowrap items-center justify-left gap-x-2 overflow-x-auto whitespace-nowrap pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {context.childLinks.map((child: any) => {
            const isChildActive = activeCategory === child.slug;
            return (
              <Link
                key={child.slug}
                href={getHref(child.slug)}
                data-active={isChildActive ? "true" : "false"}
                className={`transition-colors px-3 py-1 rounded-full text-xs shrink-0 ${
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
    </header>
  );
}