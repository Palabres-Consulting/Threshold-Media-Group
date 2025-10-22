"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { useLocalization } from "../../context/localizationContext";
import { Locale } from "../../context/types";

const ThemeSwitcher: React.FC<{ dict: any }> = ({ dict }) => {
  const [transDropdown, setTransDropdown] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { locale, setLocale } = useLocalization();

  const handleSelect = (newLocale: Locale) => {
    if (newLocale === locale) return;
    const newPath = pathname.replace(/^\/(en|fr|ar)/, `/${newLocale}`);

    setLocale(newLocale);
    if (typeof document === "undefined") return;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${
      60 * 60 * 24 * 365
    }`;
    router.push(newPath);
  };

  return (
    <div className="relative h-fit">
      <div className="flex items-center cursor-pointer justify-between lg:justify-normal px-2 py-1 rounded-md gap-2 border">
        <button
          type="button"
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => setTransDropdown(true)}
        >
          {dict.nav.lang}
        </button>

        <button
          type="button"
          onClick={() => setTransDropdown(!transDropdown)}
          className="cursor-pointer"
        >
          <GoTriangleDown />
        </button>
      </div>

      {transDropdown ? (
        <div
          onMouseLeave={() => setTransDropdown(false)}
          className="rounded-2xl lg:p-5 lg:absolute bg-background top-5 mt-2 shadow-lg lg:w-[8em] z-50"
        >
          <ul className="px-3">
            <li className="py-2 flex lg:justify-center cursor-pointer">
              <button onClick={() => handleSelect("fr")} className="hover:text-accent-main text-center">
                {dict.nav.french}
              </button>
            </li>
            <li className="py-2 flex lg:justify-center cursor-pointer">
              <button onClick={() => handleSelect("en")} className="hover:text-accent-main text-center">
                {dict.nav.english}
              </button>
            </li>
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ThemeSwitcher;
