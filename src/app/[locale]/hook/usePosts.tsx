"use client";

// hooks/usePosts.ts
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  fetchThresholdPosts,
  fetchExtractionPosts,
  fetchAsintPosts,
  fetchTopLevelCategories,
  fetchSubCategories,
  fetchPostsByCategory,
} from "../../lib/fetchLib";

// Get browser language for Polylang
export const useBrowserLanguage = () => {
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






/**
 * Hook to fetch top-level categories for a specific taxonomy.
 * Taxonomy usually follows: "categories", "asint_categories", "extraction_categories"
 */
export const useTopLevelCategories = (taxonomy: string = "categories", limit: number = 20) => {
  const lang = useBrowserLanguage();

  return useQuery({
    queryKey: ["top-categories", taxonomy, lang, limit],
    queryFn: () =>
      fetchTopLevelCategories(taxonomy, {
        lang: lang,
        per_page: limit,
      }),
  });
};

/**
 * Hook to fetch sub-categories for a specific parent.
 */
export const useSubCategories = (parentId: number, taxonomy: string = "categories") => {
  const lang = useBrowserLanguage();

  return useQuery({
    queryKey: ["sub-categories", taxonomy, parentId, lang],
    queryFn: () =>
      fetchSubCategories(parentId, taxonomy, {
        lang: lang,
      }),
    // Only fetch if we actually have a parentId
    enabled: !!parentId,
  });
};

/**
 * Domain-aware category hook.
 * Maps your site domains to their respective WordPress taxonomy slugs.
 */
export const useCategoriesByDomain = (
  domain: "main" | "extraction" | "asint" | "transverse",
  limit: number = 20
) => {
  const lang = useBrowserLanguage();

  // Mapping domain to the likely WordPress taxonomy slug
  const taxonomyMap = {
    main: "categories",
    extraction: "extraction_categories",
    asint: "asint_categories",
    transverse: "transverse_categories",
  };

  const taxonomy = taxonomyMap[domain];

  return useQuery({
    queryKey: [`${domain}-top-categories`, lang, limit],
    queryFn: () =>
      fetchTopLevelCategories(taxonomy, {
        lang: lang,
        per_page: limit,
      }),
  });
};


// hooks/usePosts.ts
export const usePostsByCategory = (
  postType: "posts" | "extraction" | "asint" | "guinea_intel" | "innovation" | "transverse",
  categoryId: number,
  limit: number = 10
) => {
  const lang = useBrowserLanguage();

  return useQuery({
    queryKey: ["posts-by-category", postType, categoryId, lang, limit],
    queryFn: () => fetchPostsByCategory(postType, categoryId, {
      lang,
      per_page: limit
    }),
    enabled: !!categoryId, // Don't fetch if categoryId is missing
  });
};