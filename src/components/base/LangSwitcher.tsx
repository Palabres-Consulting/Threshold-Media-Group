"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { useLocalization } from "../../app/[locale]/context/localizationContext";
import { useHomeLink } from "../base/logo"; // Import useHomeLink to get cookieDomain
import { Locale } from "../../app/[locale]/context/types";
import { Globe } from "lucide-react";
import { getTranslatedSlug } from "@/app/helpers/translateSlug";

const LangSwitcher: React.FC<{ dict: any }> = ({ dict }) => {
  const [transDropdown, setTransDropdown] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { locale, setLocale } = useLocalization();
  const { cookieDomain } = useHomeLink(); // Get the cookie domain

  const handleSelect = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // 1. Split the pathname (e.g., "/fr/strategie-macro" -> ["", "fr", "strategie-macro"])
    const segments = pathname.split("/");
    const currentUrlLocale = segments[1]; // "en", "fr", or "ar"

    // 2. Map over the segments and translate the actual category slugs
    const translatedSegments = segments.map((segment, index) => {
      // Skip the empty string [0] and the locale string [1]
      if (index < 2) return segment;

      // Translate the slug using our utility
      return getTranslatedSlug(segment, currentUrlLocale, newLocale);
    });

    // 3. Swap the locale segment in the array to the new locale
    translatedSegments[1] = newLocale;

    // 4. Rebuild the full translated path
    const newPath = translatedSegments.join("/");

    // 5. Update state and cookies as you had them
    setLocale(newLocale);
    if (typeof document === "undefined") return;

    // Set the cookie with the correct domain for cross-subdomain access
    const isProd = process.env.NODE_ENV === "production";
    const cookieString = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}${cookieDomain ? `; domain=${cookieDomain}` : ""} ${isProd ? "; Secure" : ""}`;
    document.cookie = cookieString;

    // 6. Push the fully translated URL
    router.push(newPath);
    setTransDropdown(false); // Optionally close the dropdown after selection
  };

  return (
    <div 
      className="relative h-fit group "
      onMouseLeave={() => setTransDropdown(false)} // <-- ADDED: Closes click-state on desktop mouse leave
    >
      <div className="flex items-center cursor-pointer  lg:justify-between  lg:px-2 py-1 rounded-md gap-1 lg:border">
        <Globe size={15} />

        <button
          type="button"
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => setTransDropdown(!transDropdown)} // Toggle added here for better UX
        >
          {dict.nav.lang}
        </button>

        <button
          type="button"
          onClick={() => setTransDropdown(!transDropdown)}
          className="cursor-pointer"
        >
          {/* <-- ADDED: Transition and rotation logic based on click OR hover --> */}
          <GoTriangleDown 
            className={`transition-transform duration-200 ${transDropdown ? "rotate-180" : "lg:group-hover:rotate-180"}`} 
          />
        </button>
      </div>

      <div
        className={`rounded-md lg:p-2  absolute lg:bg-background top-full lg:shadow-lg w-[60%] lg:w-[8em] z-50 ${transDropdown ? "block" : "hidden"} lg:group-hover:block`}
      >
        <ul className="px-3">
          <li className="py-2 flex lg:justify-center cursor-pointer">
            <button
              onClick={() => handleSelect("fr")}
              className="hover:text-accent-main text-center cursor-pointer w-full"
            >
              {dict.nav.french}
            </button>
          </li>
          <li className="py-2 flex lg:justify-center cursor-pointer">
            <button
              onClick={() => handleSelect("en")}
              className="hover:text-accent-main text-center cursor-pointer w-full"
            >
              {dict.nav.english}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LangSwitcher;