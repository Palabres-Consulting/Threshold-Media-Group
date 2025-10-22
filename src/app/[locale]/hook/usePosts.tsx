// hooks/usePosts.ts
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  fetchThresholdPosts,
  fetchExtractionPosts,
  fetchAsintPosts,
} from "../../lib/fetchLib";

// Get browser language for Polylang
const useBrowserLanguage = () => {
  if (typeof window !== "undefined") {
    // Try to get browser language
    return navigator.language?.split("-")[0] || "en";
  }
  return "en";
};

// Threshold posts hook
export const useThresholdPosts = (category?: string, limit: number = 10) => {
  const lang = useBrowserLanguage();

  return useQuery({
    queryKey: ["posts", category, limit, lang],
    queryFn: () =>
      fetchThresholdPosts({
        categories: category,
        per_page: limit,
        lang: lang,
      }),
  });
};

// Extraction posts hook
export const useExtractionPosts = (category?: string, limit: number = 10) => {
  const lang = useBrowserLanguage();

  return useQuery({
    queryKey: ["extraction-posts", category, limit, lang],
    queryFn: () =>
      fetchExtractionPosts({
        categories: category,
        per_page: limit,
        lang: lang,
      }),
  });
};

// Generic hook that determines post type based on subdomain
export const usePostsByDomain = (
  domain: "main" | "extraction" | "asint",
  category?: string,
  limit: number = 10
) => {
  const lang = useBrowserLanguage();

  const fetchFunction = {
    main: fetchThresholdPosts,
    extraction: fetchExtractionPosts,
    asint: fetchAsintPosts,
  }[domain];

  return useQuery({
    queryKey: [`${domain}-posts`, category, limit, lang],
    queryFn: () =>
      fetchFunction({
        categories: category,
        per_page: limit,
        lang: lang,
      }),
  });
};
