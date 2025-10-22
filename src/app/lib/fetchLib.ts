// lib/api.ts
import axios from "axios";

const API_BASE = "http://thresholdtest.local/wp-json/wp/v2";

export interface Post {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  featured_media: number;
  categories: number[];
  acf?: {
    reading_time?: number;
    is_featured?: boolean;
    priority?: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

// Generic fetch function for any post type
export const fetchPostsByType = async (
  postType: "posts" | "extraction_posts" | "asint_posts",
  params?: {
    categories?: string;
    per_page?: number;
    lang?: string; // For Polylang
    meta_key?: string;
    meta_value?: string;
  }
): Promise<Post[]> => {
  const queryParams = new URLSearchParams();

  if (params?.categories) queryParams.append("categories", params.categories);
  if (params?.per_page)
    queryParams.append("per_page", params.per_page.toString());
  if (params?.lang) queryParams.append("lang", params.lang); // Polylang parameter
  if (params?.meta_key) queryParams.append("meta_key", params.meta_key);
  if (params?.meta_value) queryParams.append("meta_value", params.meta_value);

  queryParams.append("_embed", "true");

  const { data } = await axios.get(`${API_BASE}/${postType}?${queryParams}`);
  return data;
};

// Specific functions for each site
export const fetchThresholdPosts = (params?: any) =>
  fetchPostsByType("posts", params);

export const fetchExtractionPosts = (params?: any) =>
  fetchPostsByType("extraction_posts", params);

export const fetchAsintPosts = (params?: any) =>
  fetchPostsByType("asint_posts", params);
