"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { useLocalization } from "../../context/localizationContext";
import { Locale } from "../../context/types";
import { Globe } from "lucide-react";

const LangSwitcher: React.FC<{ dict: any }> = ({ dict }) => {
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
    <div className="relative h-fit group ">
      <div className="flex items-center cursor-pointer  lg:justify-between  px-2 py-1 rounded-md gap-1 lg:border">
       
        <Globe size={15} />
       
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

      
        <div

          className="rounded-md lg:hidden group-hover:block lg:p-2 right-0 absolute bg-background top-full  shadow-lg w-[90%] lg:w-[8em]  z-50"
        >
          <ul className="px-3">
            <li className="py-2 flex lg:justify-center cursor-pointer">
              <button onClick={() => handleSelect("fr")} className="hover:text-accent-main text-center cursor-pointer">
                {dict.nav.french}
              </button>
            </li>
            <li className="py-2 flex lg:justify-center cursor-pointer">
              <button onClick={() => handleSelect("en")} className="hover:text-accent-main text-center cursor-pointer">
                {dict.nav.english}
              </button>
            </li>
          </ul>
        </div>
      
    </div>
  );
};

export default LangSwitcher;
