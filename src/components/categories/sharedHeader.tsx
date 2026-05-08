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

      <div className="flex flex-col gap-3 mb-2">
        {/* --- LEVEL 1 & 2 ROW (Main Navigation) --- */}
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm md:text-base">
          
          {/* === HOME.TSX SPECIFIC: Overview Link === */}
          {/* {isQueryRouting && topLevelCategory && (
            <Link
              href={getHref()}
              className={`pb-1 transition-colors ${
                !activeCategory 
                  ? "font-bold border-b-2 border-[var(--foreground)] text-[var(--foreground)]" 
                  : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
              }`}
            >
              {overviewText}
            </Link>
          )} */}

          {/* === HOME.TSX SPECIFIC: Top-Level Children (When no category is active) === */}
          {isQueryRouting && !activeCategory && topLevelCategory?.categories?.map((link: any) => (
            <Link
              key={link.slug}
              href={getHref(link.slug)}
              className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors pb-1"
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
                  className="font-bold border-b-2 border-[var(--foreground)] text-accent-main pb-1"
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
                    className={`pb-1 transition-colors ${
                      isActive 
                        ? "font-bold border-b- border-[var(--foreground)] text-[var(--foreground)]" 
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
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm pt-2 border-t border-[var(--foreground)]/5">
            {context.childLinks.map((child: any) => {
              const isChildActive = activeCategory === child.slug;
              return (
                <Link
                  key={child.slug}
                  href={getHref(child.slug)}
                  className={`transition-colors px-3 py-1 rounded-full ${
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