import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

const API_BASE = "https://wp.tresholdmediagroup.com/wp-json/wp/v2";

export interface Post {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string; // Used for routing
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: "post" | "extraction" | "asint" | string; // The CPT name
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: string;
  featured_media: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  sticky: boolean;
  template: string;
  format:
    | "standard"
    | "aside"
    | "gallery"
    | "link"
    | "image"
    | "quote"
    | "status"
    | "video"
    | "audio"
    | "chat";
  meta: any;

  // Taxonomies
  categories?: number[];
  tags?: number[];
  // This allows for 'extraction-category', 'asint-category', etc.
  [key: string]: any;

  // Polylang / Multilingual
  lang?: string;

  // ACF (Advanced Custom Fields)
  acf?: {
    reading_time?: string | number;
    is_featured?: boolean;
    priority?: number;
    [key: string]: any;
  };

  // Embedded data (if using _embed=true)
  _embedded?: {
    author?: any[];
    "wp:featuredmedia"?: any[];
    "wp:term"?: any[][];
    [key: string]: any;
  };

  _links?: Record<string, Array<{ href: string; embeddable?: boolean }>>;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export const fetchPostById = async (
  postType: "posts" | "extraction" | "asint",
  id: number,
  lang: string = "en",
): Promise<Post | null> => {
  // Polylang pairs: English ID, French ID = English ID + 1
  // console.log(`Fetching post by ID: ${id} for type: ${postType} and lang: ${lang}`);

  // First, try the provided ID
  try {
    const { data } = await axios.get(`${API_BASE}/${postType}/${id}`, {
      params: {
        lang: lang,
        _embed: true,
      },
    });

    if (data && data.lang === lang) {
      return data;
    }
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 404) {
      // console.error(`Error fetching post by id ${id}:`, error);
    }
  }

  // If not found or wrong language, try the paired ID
  const pairedId = lang === 'fr' ? id + 1 : id - 1;

  try {
    const { data } = await axios.get(`${API_BASE}/${postType}/${pairedId}`, {
      params: {
        lang: lang,
        _embed: true,
      },
    });

    if (data && data.lang === lang) {
      return data;
    }
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 404) {
      // console.error(`Error fetching paired post by id ${pairedId}:`, error);
    }
  }

  return null;
};

export const fetchPostBySlug = async (
  postType: "posts" | "extraction" | "asint",
  slug: string,
  lang: string = "en",
): Promise<Post | null> => {
  // First, try to fetch with lang
  const { data } = await axios.get(`${API_BASE}/${postType}`, {
    params: {
      slug: slug,
      lang: lang,
      _embed: true,
    },
  });

  if (data.length > 0) {
    return data[0];
  }

  // If not found, try without lang to find the base post
  const { data: baseData } = await axios.get(`${API_BASE}/${postType}`, {
    params: {
      slug: slug,
      _embed: true,
    },
  });

  if (baseData.length > 0) {
    const basePost = baseData[0];
    // Check if it has the desired lang
    if (basePost.lang === lang) {
      return basePost;
    }
    // Check translations
    if (basePost.meta && basePost.meta.polylang && basePost.meta.polylang.translations && basePost.meta.polylang.translations[lang]) {
      const translatedId = basePost.meta.polylang.translations[lang];
      return await fetchPostById(postType, translatedId, lang);
    }
  }

  return null;
};

// Generic fetch function for any post type
export const fetchPostsByType = async (
  postType:
    | "posts"
    | "extraction"
    | "asint"
    | "guinea_intel"
    | "innovation"
    | "transverse",
  params?: {
    categories?: string;
    per_page?: number;
    lang?: string; // For Polylang
    meta_key?: string;
    meta_value?: string;
  },
): Promise<Post[]> => {
  const queryParams = new URLSearchParams();

  // console.log("Lang in fetchPostsByType:", params?.lang);

  if (params?.categories) queryParams.append("categories", params.categories);
  if (params?.per_page)
    queryParams.append("per_page", params.per_page.toString());
  if (params?.lang) queryParams.append("lang", params.lang); // Polylang parameter
  if (params?.meta_key) queryParams.append("meta_key", params.meta_key);
  if (params?.meta_value) queryParams.append("meta_value", params.meta_value);

  queryParams.append("_embed", "true");

  try {
    const { data }: { data: Post[] } = await axios.get(
      `${API_BASE}/${postType}?${queryParams}`,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // console.log(
      //   `No posts found for ${postType} with params: ${queryParams.toString()} (404).`,
      // );
      return [];
    }
    // console.error(`An error occurred while fetching ${postType}:`, error);
    return [];
  }
};

// Specific functions for each site
export const fetchThresholdPosts = (params?: any) =>
  fetchPostsByType("posts", params);

export const fetchExtractionPosts = (params?: any) =>
  fetchPostsByType("extraction", params);

export const fetchAsintPosts = (params?: any) =>
  fetchPostsByType("asint", params);

export const fetchGuineaIntelPosts = (params?: any) =>
  fetchPostsByType("guinea_intel", params);

export const fetchInnovationPosts = (params?: any) =>
  fetchPostsByType("innovation", params);

export const fetchTransversePosts = (params?: any) =>
  fetchPostsByType("transverse", params);

export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  parent: number;
}

/**
 * Fetches top-level categories (parent: 0) for a given taxonomy.
 * For standard posts, taxonomy is "categories".
 * For CPTs, it's usually "{post_type}_categories" or "categories".
 */
export const fetchTopLevelCategories = async (
  taxonomy: string = "categories",
  params?: { lang?: string; per_page?: number },
): Promise<Category[]> => {
  const queryParams = new URLSearchParams();

  // "parent: 0" is the WP API way to say "Top Level Only"
  queryParams.append("parent", "0");
  queryParams.append("hide_empty", "false"); // Set to true if you want to hide empty cats

  if (params?.per_page)
    queryParams.append("per_page", params.per_page.toString());
  if (params?.lang) queryParams.append("lang", params.lang);

  const { data } = await axios.get(`${API_BASE}/${taxonomy}?${queryParams}`);
  return data;
};

/**
 * Fetches sub-categories for a specific parent category ID.
 */
export const fetchSubCategories = async (
  parentId: number,
  taxonomy: string = "categories",
  params?: { lang?: string },
): Promise<Category[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append("parent", parentId.toString());
  queryParams.append("hide_empty", "false");

  if (params?.lang) queryParams.append("lang", params.lang);

  const { data } = await axios.get(`${API_BASE}/${taxonomy}?${queryParams}`);
  return data;
};

/**
 * Fetches posts filtered by a specific category.
 * Handles standard 'posts' or CPTs like 'extraction' and 'asint'.
 */
export const fetchPostsByCategory = async (
  postType:
    | "posts"
    | "extraction"
    | "asint"
    | "guinea_intel"
    | "innovation"
    | "transverse",
  categoryId: number,
  params?: {
    per_page?: number;
    lang?: string;
    page?: number;
  },
): Promise<Post[]> => {
  const queryParams = new URLSearchParams();

  // WordPress uses the 'categories' parameter for default posts.
  // NOTE: If your CPTs (ASINT/Extraction) use a custom taxonomy
  // (e.g., 'asint_categories'), the REST API parameter might
  // actually be that taxonomy name instead of 'categories'.
  // Most standard setups use 'categories' if registered that way.

  // Inside fetchPostsByCategory
  const categoryParam =
    postType === "posts" ? "categories" : `${postType}_categories`;
  queryParams.append(categoryParam, categoryId.toString());

  if (params?.per_page)
    queryParams.append("per_page", params.per_page.toString());
  if (params?.lang) queryParams.append("lang", params.lang);
  if (params?.page) queryParams.append("page", params.page.toString());

  queryParams.append("_embed", "true");

  const { data } = await axios.get(`${API_BASE}/${postType}?${queryParams}`);
  return data;
};

export const postKeys = {
  all: (postType: string, locale: string) => [postType, locale] as const,
  list: (postType: string, locale: string, category?: string, limit?: number) =>
    [...postKeys.all(postType, locale), { category, limit }] as const,
};

export const getPosts = async (
  postType: string,
  locale: string,
  limit = 10,
  category?: string,
) => {
  return fetchPostsByType(postType as any, {
    per_page: limit,
    lang: locale,
    categories: category,
  });
};
export const prefetchUniversalPosts = async (
  queryClient: QueryClient,
  postType: string,
  locale: string,
  limit = 10,
  category?: string,
) => {
  return queryClient.prefetchQuery({
    queryKey: postKeys.list(postType, locale, category, limit),
    queryFn: () => getPosts(postType, locale, limit, category),
  });
};
