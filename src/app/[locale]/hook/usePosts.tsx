"use client";

// hooks/usePosts.ts
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocalization } from "../context/localizationContext";
import {
  fetchThresholdPosts,
  fetchExtractionPosts,
  fetchAsintPosts,
  fetchTopLevelCategories,
  fetchSubCategories,
  fetchPostsByCategory,
} from "../../lib/fetchLib";

// Threshold posts hook
export const useThresholdPosts = (category?: string, limit: number = 10) => {
  const { locale } = useLocalization();

  return useQuery({
    queryKey: ["posts", category, limit, locale],
    queryFn: () =>
      fetchThresholdPosts({
        categories: category,
        per_page: limit,
        lang: locale,
      }),
  });
};

// Extraction posts hook
export const useExtractionPosts = (category?: string, limit: number = 10) => {
  const { locale } = useLocalization();

  return useQuery({
    queryKey: ["extraction-posts", category, limit, locale],
    queryFn: () =>
      fetchExtractionPosts({
        categories: category,
        per_page: limit,
        lang: locale,
      }), 
  });
};

// Generic hook that determines post type based on subdomain
export const usePostsByDomain = (
  domain: "main" | "extraction" | "asint",
  category?: string,
  limit: number = 10
) => {
  const { locale } = useLocalization();

  const fetchFunction = {
    main: fetchThresholdPosts,
    extraction: fetchExtractionPosts,
    asint: fetchAsintPosts,
  }[domain];

  return useQuery({
    queryKey: [`${domain}-posts`, category, limit, locale],
    queryFn: () =>
      fetchFunction({
        categories: category,
        per_page: limit,
        lang: locale,
      }),
  });
};






/**
 * Hook to fetch top-level categories for a specific taxonomy.
 * Taxonomy usually follows: "categories", "asint_categories", "extraction_categories"
 */
export const useTopLevelCategories = (taxonomy: string = "categories", limit: number = 20) => {
  const { locale } = useLocalization();

  return useQuery({
    queryKey: ["top-categories", taxonomy, locale, limit],
    queryFn: () =>
      fetchTopLevelCategories(taxonomy, {
        lang: locale,
        per_page: limit,
      }),
  });
};

/**
 * Hook to fetch sub-categories for a specific parent.
 */
export const useSubCategories = (parentId: number, taxonomy: string = "categories") => {
  const { locale } = useLocalization();

  return useQuery({
    queryKey: ["sub-categories", taxonomy, parentId, locale],
    queryFn: () =>
      fetchSubCategories(parentId, taxonomy, {
        lang: locale,
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
  const { locale } = useLocalization();

  // Mapping domain to the likely WordPress taxonomy slug
  const taxonomyMap = {
    main: "categories",
    extraction: "extraction_categories",
    asint: "asint_categories",
    transverse: "transverse_categories",
  };

  const taxonomy = taxonomyMap[domain];

  return useQuery({
    queryKey: [`${domain}-top-categories`, locale, limit],
    queryFn: () =>
      fetchTopLevelCategories(taxonomy, {
        lang: locale,
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
  const { locale } = useLocalization();

  return useQuery({
    queryKey: ["posts-by-category", postType, categoryId, locale, limit],
    queryFn: () => fetchPostsByCategory(postType, categoryId, {
      lang: locale,
      per_page: limit
    }),
    enabled: !!categoryId, // Don't fetch if categoryId is missing
  });
};