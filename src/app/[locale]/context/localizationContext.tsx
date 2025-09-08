// LocalizationContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";

import "@/app/lib/locale/en.json";
import "@/app/lib/locale/fr.json";

type Locale = "en" | "fr";
type Dict = any;

const LocalizationContext = createContext<
  { dict: Dict; locale: Locale; setLocale: (l: Locale) => void } | undefined
>(undefined);

export function LocalizationProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dict;
  children: React.ReactNode;
}) {
  const [currentLocale, setCurrentLocale] = useState(locale);
  const [currentDict, setCurrentDict] = useState<Dict>(dict);

  useEffect(() => {
    // Persist to localStorage
    localStorage.setItem("locale", currentLocale);
  }, [currentLocale]);

  // Optional: if you want dynamic dictionary loading
  const setLocale = async (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    const newDict = await import(`@/app/lib/locale/${newLocale}.json`).then(
      (m) => m.default
    );
    setCurrentLocale(newLocale);
    setCurrentDict(newDict);
  };

  return (
    <LocalizationContext.Provider
      value={{ dict: currentDict, locale: currentLocale, setLocale }}
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
