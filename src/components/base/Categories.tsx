"use client"

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TranslationSchema } from "@/lib/locale";
import Link from "next/link";
import { ChevronDown, Home } from "lucide-react";

export interface CategoriesProps {
  dict: TranslationSchema;
  asintLink: string;
  extractionLink: string;
  mainDomainLink: string; 
}

const Categories: React.FC<CategoriesProps> = ({ dict, asintLink, extractionLink, mainDomainLink }) => {
  const [openMobileIndex, setOpenMobileIndex] = useState<number | string | null>(null);
  const [clientHost, setClientHost] = useState<string>("");
  
  const pathname = usePathname(); 
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientHost(window.location.host);
    }
  }, [pathname]);

  // Clean local pathname by stripping the locale prefix safely (e.g., /en/innovation/ai -> /innovation/ai)
  const cleanPathname = pathname ? pathname.replace(/^\/[a-z]{2}(\/|$)/i, "/") : "/";

  // Check active state acknowledging nested child paths
  const getActiveState = (index: number, catSlug: string, isTransverse = false) => {
    if (isTransverse) {
      // Matches /transverse OR /transverse/any-child-route
      return cleanPathname === "/transverse" || cleanPathname.startsWith("/transverse/");
    }
    
    // Subdomains (Extraction = 0, ASINT = 1) -> verified via client host state
    if (index === 0 || index === 1) {
      if (!clientHost) return false;
      const targetHost = index === 0 ? extractionLink : asintLink;
      return clientHost === targetHost.replace(/^https?:\/\//, "").replace(/\/$/, "");
    }

    // Standard local paths (e.g., /innovation)
    const targetPath = `/${catSlug}`;
    // Matches exact parent path OR parent path followed by a child slash segment
    return cleanPathname === targetPath || cleanPathname.startsWith(`${targetPath}/`);
  };

  // Map categories from dictionary
  const allCategories = dict.main.nav.categories.map((category, index) => {
    const catSlug = category.slug || category.title.toLowerCase().replace(/\s+/g, '-');
    let mainLink = "";

    if (index === 0) {
      mainLink = extractionLink;
    } else if (index === 1) {
      mainLink = asintLink;
    } else {
      const cleanMainDomain = mainDomainLink.replace(/\/$/, "");
      mainLink = `${cleanMainDomain}/${catSlug}`;
    }

    return {
      ...category,
      catSlug,
      mainLink: mainLink.replace(/\/$/, ""),
    };
  });

  const visibleCategories = allCategories.slice(0, 5);

  const toggleMobile = (index: number | string) => {
    setOpenMobileIndex(openMobileIndex === index ? null : index);
  };

  const cleanMainDomain = mainDomainLink.replace(/\/$/, "");
  const transverseLink = `${cleanMainDomain}/transverse`;
  const isTransverseOpen = openMobileIndex === 'transverse';
  const isTransverseActive = getActiveState(-1, "", true);
  
  const transverseSubCategories = [
    { title: "AI or Die", slug: "ai-or-die" },
  ];

  const isMainDomain = clientHost === mainDomainLink.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="flex flex-col rounded-3xl lg:flex-row lg:flex-nowrap lg:items-center lg:p-1 lg:border-[1px] border-foreground/20 lg:gap-2 gap-5 w-full lg:w-auto">
      
      {/* HOME LINK */}
      <Link href={mainDomainLink} className={`block flex-grow py-1 text-[#F15901] lg:px-4 lg:border-sub rounded-2xl transition-colors whitespace-nowrap hover:bg-foreground/10 ${isMainDomain ? "bg-[#F15901]/70 text-white" : ""}`}>
        <Home size={18} />
      </Link>

      {visibleCategories.map((category, index) => {
        const isMobileOpen = openMobileIndex === index;
        const linkActive = getActiveState(index, category.catSlug);
        const isSubdomain = index === 0 || index === 1;

        const linkStyles = `block flex-grow py-1 lg:px-4 lg:border-sub rounded-2xl transition-colors whitespace-nowrap ${
          linkActive 
            ? "bg-accent-main/70 text-white" 
            : "hover:bg-foreground/10"
        }`;

        return (
          <div key={index} className="relative group w-full lg:w-auto">
            <div className="flex items-center justify-between md:w-fit ">
              {isSubdomain ? (
                <a href={category.mainLink} className={linkStyles}>
                  {category.title}
                </a>
              ) : (
                <Link href={category.mainLink} className={linkStyles}>
                  {category.title}
                </Link>
              )}
              
              <button 
                onClick={() => toggleMobile(index)}
                className="lg:hidden p-2 text-foreground/60"
              >
                <ChevronDown className={`transition-transform duration-200 ${isMobileOpen ? 'rotate-180' : ''}`} size={16} />
              </button>
            </div>

            {/* Subcategories Dropdown */}
            <div className={`
              lg:absolute lg:left-0 lg:top-full lg:hidden rounded-2xl lg:group-hover:block lg:z-50 lg:min-w-[240px] lg:bg-[var(--background)] lg:border lg:border-foreground/10 lg:shadow-xl
              ${isMobileOpen ? "block" : "hidden"} lg:block 
              relative bg-foreground/5 lg:bg-[var(--background)] mt-1 lg:mt-0
            `}>
              <div className="flex flex-col py-2">
                {category.categories?.map((sub, subIndex) => {
                  const subSlug = sub.slug || sub.title.toLowerCase().replace(/\s+/g, '-');
                  const subLink = isSubdomain 
                    ? `${category.mainLink}?category=${subSlug}`
                    : `${category.mainLink}/${subSlug}`;
                  
                  const subStyles = "px-8 lg:px-4 py-2 text-sm hover:bg-foreground/5 whitespace-nowrap text-[var(--foreground)]";

                  return isSubdomain ? (
                    <a key={subIndex} href={subLink} className={subStyles}>
                      {category.title === "Extraction" && sub.title === "Simandou 2040" 
                        ? "Simandou 2040" 
                        : sub.title}
                    </a>
                  ) : (
                    <Link key={subIndex} href={subLink} className={subStyles}>
                      {category.title === "Extraction" && sub.title === "Simandou 2040" 
                        ? "Simandou 2040" 
                        : sub.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* --- Hardcoded Transverse Section --- */}
      <div className="relative group w-full lg:w-auto">
        <div className="flex items-center justify-between md:w-fit ">
          <Link
            href={transverseLink}
            className={`block flex-grow rounded-2xl py-1 lg:px-4 lg:border-sub transition-colors whitespace-nowrap ${
              isTransverseActive 
                ? "bg-accent-main/70 text-white" 
                : "hover:bg-foreground/10"
            }`}
          >
            Transverse
          </Link>
          
          <button 
            onClick={() => toggleMobile('transverse')}
            className="lg:hidden p-2 text-foreground/60"
          >
            <ChevronDown className={`transition-transform duration-200 ${isTransverseOpen ? 'rotate-180' : ''}`} size={16} />
          </button>
        </div>

        {/* Transverse Subcategories Dropdown */}
        <div className={`
          lg:absolute lg:left-0 lg:top-full rounded-2xl lg:hidden lg:group-hover:block lg:z-50 lg:min-w-[240px] lg:bg-[var(--background)] lg:border lg:border-foreground/10 lg:shadow-xl
          ${isTransverseOpen ? "block" : "hidden"} lg:block 
          relative bg-foreground/5 lg:bg-[var(--background)] mt-1 lg:mt-0
        `}>
          <div className="flex flex-col py-2">
            {transverseSubCategories.map((sub, subIndex) => (
              <Link
                key={subIndex}
                href={`${transverseLink}?type=${sub.slug}`}
                className="px-8 lg:px-4 py-2 text-sm hover:bg-foreground/5 whitespace-nowrap text-[var(--foreground)]"
              >
                {sub.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;