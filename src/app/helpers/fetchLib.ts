import axios from "axios";
import { Post } from "../types/apiResponse";

const API_BASE = "https://wp.tresholdmediagroup.com/wp-json/wp/v2";


export const fetchPostById = async (
  postType: "posts" | "extraction" | "asint",
  id: number,
  lang: string = "en",
): Promise<Post | null> => {
  try {
    const { data } = await axios.get(`${API_BASE}/${postType}/${id}`, {
      params: { lang: lang, _embed: true },
    });
    if (data && data.lang === lang) return data;
  } catch (error) {
    // Ignore error
  }

  const pairedId = lang === 'fr' ? id + 1 : id - 1;
  try {
    const { data } = await axios.get(`${API_BASE}/${postType}/${pairedId}`, {
      params: { lang: lang, _embed: true },
    });
    if (data && data.lang === lang) return data;
  } catch (error) {
    // Ignore error
  }

  return null;
};

export const fetchPostBySlug = async (
  postType: "posts" | "extraction" | "asint",
  slug: string,
  lang: string = "en",
): Promise<Post | null> => {
  const { data } = await axios.get(`${API_BASE}/${postType}`, {
    params: { slug: slug, lang: lang, _embed: true },
  });

  if (data.length > 0) return data[0];

  const { data: baseData } = await axios.get(`${API_BASE}/${postType}`, {
    params: { slug: slug, _embed: true },
  });

  if (baseData.length > 0) {
    const basePost = baseData[0];
    if (basePost.lang === lang) return basePost;
    if (basePost.meta?.polylang?.translations?.[lang]) {
      const translatedId = basePost.meta.polylang.translations[lang];
      return await fetchPostById(postType, translatedId, lang);
    }
  }
  return null;
};

// Generic fetch function for any post type (Supports dynamically appending custom taxonomy IDs!)
export const fetchPostsByType = async (
  postType: string,
  params?: {
    categories?: string;
    per_page?: number;
    lang?: string;
    meta_key?: string;
    meta_value?: string;
    [key: string]: any; 
  },
): Promise<Post[]> => {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });
  }

  queryParams.append("_embed", "true");

  try {
    const { data }: { data: Post[] } = await axios.get(
      `${API_BASE}/${postType}?${queryParams}`,
    );
    return data;
  } catch (error) {
    return [];
  }
};

export const fetchThresholdPosts = (params?: any) => fetchPostsByType("posts", params);
export const fetchExtractionPosts = (params?: any) => fetchPostsByType("extraction", params);
export const fetchAsintPosts = (params?: any) => fetchPostsByType("asint", params);
export const fetchGuineaIntelPosts = (params?: any) => fetchPostsByType("guinea_intel", params);
export const fetchInnovationPosts = (params?: any) => fetchPostsByType("innovation", params);
export const fetchTransversePosts = (params?: any) => fetchPostsByType("transverse", params);

export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  parent: number;
}

export const fetchTopLevelCategories = async (
  taxonomy: string = "categories",
  params?: { lang?: string; per_page?: number },
): Promise<Category[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append("parent", "0");
  queryParams.append("hide_empty", "false"); 

  if (params?.per_page) queryParams.append("per_page", params.per_page.toString());
  if (params?.lang) queryParams.append("lang", params.lang);

  const { data } = await axios.get(`${API_BASE}/${taxonomy}?${queryParams}`);
  return data;
};

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

// FIX: Explicitly pass taxonomy to avoid guessing the parameter name.
export const fetchPostsByCategory = async (
  postType: string,
  categoryId: number,
  taxonomy: string = "categories", 
  params?: {
    per_page?: number;
    lang?: string;
    page?: number;
  },
): Promise<Post[]> => {
  const queryParams = new URLSearchParams();

  // Explicitly mapping the taxonomy to the ID
  queryParams.append(taxonomy, categoryId.toString());

  if (params?.per_page) queryParams.append("per_page", params.per_page.toString());
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

