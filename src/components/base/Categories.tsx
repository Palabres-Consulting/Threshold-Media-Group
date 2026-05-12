"use client"

import { useState } from "react";
import { TranslationSchema } from "@/lib/locale";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export interface CategoriesProps {
  dict: TranslationSchema;
  asintLink: string;
  extractionLink: string;
  mainDomainLink: string; 
}

const Categories: React.FC<CategoriesProps> = ({ dict, asintLink, extractionLink, mainDomainLink }) => {
  // Updated to allow a string key for the hardcoded 'transverse' menu
  const [openMobileIndex, setOpenMobileIndex] = useState<number | string | null>(null);

  // 1. Create the map from the dictionary
  const allCategories = dict.main.nav.categories.map((category, index) => {
    const catSlug = category.slug || category.title.toLowerCase().replace(/\s+/g, '-');
    
    let mainLink = "";

    // Route Subdomains explicitly
    if (index === 0) {
      mainLink = extractionLink;
    } else if (index === 1) {
      mainLink = asintLink;
    } 
    // Force the rest back to the absolute Main Domain URL
    else {
      // Make sure we don't end up with double slashes
      const cleanMainDomain = mainDomainLink.replace(/\/$/, "");
      mainLink = `${cleanMainDomain}/${catSlug}`;
    }

    // Clean trailing slashes
    mainLink = mainLink.replace(/\/$/, "");

    return {
      ...category,
      catSlug,
      mainLink,
    };
  });

  // Keep the first 5 categories visible
  const visibleCategories = allCategories.slice(0, 5);

  const toggleMobile = (index: number | string) => {
    setOpenMobileIndex(openMobileIndex === index ? null : index);
  };

  // Hardcoded Transverse Setup
  const cleanMainDomain = mainDomainLink.replace(/\/$/, "");
  const transverseLink = `${cleanMainDomain}/transverse`;
  const isTransverseOpen = openMobileIndex === 'transverse';
  
  const transverseSubCategories = [
    { title: "AI or Die", slug: "ai-or-die" },
    // { title: "Guinea Means Business", slug: "guinea-means-business" },
    // { title: "One Quarter, One City", slug: "one-quarter-one-city" },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:flex-nowrap lg:items-center lg:p-1 lg:border-[1px] border-foreground/20 rounded-lg lg:gap-2 gap-5 w-full lg:w-auto">
      {visibleCategories.map((category, index) => {
        const isMobileOpen = openMobileIndex === index;

        return (
          <div key={index} className="relative group w-full lg:w-auto">
            <div className="flex items-center justify-between md:w-fit ">
              <Link
                href={category.mainLink}
                className="block flex-grow rounded-lg py-1 lg:px-4 lg:border-sub hover:bg-foreground/10 transition-colors whitespace-nowrap"
              >
                {category.title}
              </Link>
              
              <button 
                onClick={() => toggleMobile(index)}
                className="lg:hidden p-2 text-foreground/60"
              >
                <ChevronDown className={`transition-transform duration-200 ${isMobileOpen ? 'rotate-180' : ''}`} size={16} />
              </button>
            </div>

            {/* Subcategories Dropdown */}
            <div className={`
              lg:absolute lg:left-0 lg:top-full lg:hidden lg:group-hover:block lg:z-50 lg:min-w-[240px] lg:bg-[var(--background)] lg:border lg:border-foreground/10 lg:shadow-xl
              ${isMobileOpen ? "block" : "hidden"} lg:block 
              relative bg-foreground/5 lg:bg-[var(--background)] rounded-md mt-1 lg:mt-0
            `}>
              <div className="flex flex-col py-2">
                {category.categories?.map((sub, subIndex) => {
                  const subSlug = sub.slug || sub.title.toLowerCase().replace(/\s+/g, '-');
                  
                  let subLink = "";
                  
                  // For Extraction (0) and ASINT (1), use the query parameter logic
                  if (index === 0 || index === 1) {
                    subLink = `${category.mainLink}?category=${subSlug}`;
                  } else {
                    subLink = `${category.mainLink}/${subSlug}`;
                  }
                  
                  return (
                    <Link
                      key={subIndex}
                      href={subLink}
                      className="px-8 lg:px-4 py-2 text-sm hover:bg-foreground/5 whitespace-nowrap text-[var(--foreground)]"
                    >
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
            className="block flex-grow rounded-lg py-1 lg:px-4 lg:border-sub hover:bg-foreground/10 transition-colors whitespace-nowrap"
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
          lg:absolute lg:left-0 lg:top-full lg:hidden lg:group-hover:block lg:z-50 lg:min-w-[240px] lg:bg-[var(--background)] lg:border lg:border-foreground/10 lg:shadow-xl
          ${isTransverseOpen ? "block" : "hidden"} lg:block 
          relative bg-foreground/5 lg:bg-[var(--background)] rounded-md mt-1 lg:mt-0
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