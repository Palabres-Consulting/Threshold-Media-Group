// lib/useTranslation.ts
"use client";
import { translations } from "./translations";
import { useSearchParams } from "next/navigation";

export function useTranslation() {
  const params = useSearchParams();
  const lang = (params.get("lang") as keyof typeof translations) || "en"; // fallback English

  return (path: string) => {
    const keys = path.split(".");
    let result: any = translations[lang as keyof typeof translations];
    for (const key of keys) {
      result = result?.[key];
    }
    return result ?? path; // fallback to key string
  };
}
