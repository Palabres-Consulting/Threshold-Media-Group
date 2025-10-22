// LocalizationContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";

// import en from "@/app/lib/locale/en.json";
// import "@/app/lib/locale/fr.json";
import { useSubdomain } from "./subDomainContext";

export type Site = "main" | "extraction" | "asint";
export type Locale = "en" | "fr";
type Dict = any;

const LocalizationContext = createContext<
  | {
      dict: Dict;
      site: Site;
      locale: Locale;
      setLocale: (l: Locale) => void;
    }
  | undefined
>(undefined);

export function LocalizationProvider({
  locale,
  dict,
  site,
  children,
}: {
  locale: Locale;
  dict: Dict;
  site: string;
  children: React.ReactNode;
}) {
  const [currentLocale, setCurrentLocale] = useState(locale);
  const [currentDict, setCurrentDict] = useState<Dict>(dict);

  // const subdomain = useSubdomain();

  useEffect(() => {
    // Persist to localStorage
    localStorage.setItem("locale", currentLocale);
  }, [currentLocale]);

  // Optional: if you want dynamic dictionary loading
  const setLocale = async (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    const newDict = await import(
      `@/app/lib/locale/${site}/${newLocale}.json`
    ).then((m) => m.default);
    setCurrentLocale(newLocale);
    setCurrentDict(newDict);
  };

  return (
    <LocalizationContext.Provider
      value={{
        dict: currentDict,
        locale: currentLocale,
        setLocale,
        site: site as Site,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context)
    throw new Error("useLocalization must be used within LocalizationProvider");
  return context;
};
