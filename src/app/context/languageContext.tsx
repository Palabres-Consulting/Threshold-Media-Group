"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../lib/translations";

type LanguageContextType = {
  lang: string;
  setLang: (lang: string) => void;
  t: (typeof translations)["en"];
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState("en");

  // Wrap setter to also save in localStorage
  const setLang = (newLang: string) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", newLang);
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) {
      setLangState(saved);
    }
  }, []);

  // Keep <html lang=""> in sync
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t =
    translations[lang as keyof typeof translations] || translations["en"];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
