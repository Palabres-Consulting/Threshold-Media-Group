"use client"

import { useState } from "react";
import { TranslationSchema } from "@/app/lib/locale";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export interface CategoriesProps {
  dict: TranslationSchema;
  asintLink: string;
  extractionLink: string;
}

const Categories: React.FC<CategoriesProps> = ({ dict, asintLink, extractionLink }) => {
  const [openMobileIndex, setOpenMobileIndex] = useState<number | null>(null);

  // Helper to determine the base domain/path for the 3 main sections
  const getMainLink = (index: number, categorySlug: string) => {
    switch (index) {
      case 0: return extractionLink; // /fr/industries-resources
      case 1: return asintLink;      // /fr/asint
      default: return `/${categorySlug}`;
    }
  };

  const toggleMobile = (index: number) => {
    setOpenMobileIndex(openMobileIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:flex-nowrap lg:items-center lg:p-1 lg:border-[1px] border-foreground/20 rounded-lg gap-2 w-full lg:w-auto">
      {dict.main.nav.categories.map((category, index) => {
        // Use the slug from the dictionary, fallback to sanitized title if missing
        const catSlug = category.slug || category.title.toLowerCase().replace(/\s+/g, '-');
        const mainLink = getMainLink(index, catSlug);
        const isMobileOpen = openMobileIndex === index;

        return (
          <div key={index} className="relative group w-full lg:w-auto">
            <div className="flex items-center justify-between w-fit ">
              <Link
                href={mainLink}
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
                {category.categories.map((sub, subIndex) => {
                  // Use sub.slug directly from your dictionary
                  const subSlug = sub.slug || sub.title.toLowerCase().replace(/\s+/g, '-');
                  const subLink = `${mainLink}/${subSlug}`;

                  return (
                    <Link
                      key={subIndex}
                      href={subLink}
                      className="px-8 lg:px-4 py-2 text-sm hover:bg-foreground/5 whitespace-nowrap text-[var(--foreground)]"
                    >
                      {sub.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Categories;