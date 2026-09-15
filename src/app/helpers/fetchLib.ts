import axios from "axios";
import { Post } from "../types/apiResponse";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // Client-side uses relative paths

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

const API_BASE = `${getBaseUrl()}/api/wp`;



// Generic fetch function for any post type (Supports dynamically appending custom taxonomy IDs!)
export const fetchPostsByType = async (
  postType: string,
  params?: {
    categories?: string;
    per_page?: number;
    lang?: string;
    meta_key?: string;
    meta_value?: string;
    search?: string;
    search_columns?: string;
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

  const isServer = typeof window === "undefined";

  try {
    if (isServer) {
      // 🚀 SERVER-SIDE: Bypass the Next.js API proxy and hit WordPress directly.
      // This stops Vercel loopback timeouts and deployment URL bugs.
      const username = process.env.TMG_READER_USER || "";
      const password = (process.env.TMG_READER_PASS || "").replace(/\s+/g, "");

      // Use btoa for cross-environment compatibility (Node 18+ and Browser)
      const authHeader = btoa(`${username}:${password}`);

      const res = await fetch(
        `https://wp.tresholdmediagroup.com/wp-json/wp/v2/${postType}?${queryParams}`,
        {
          headers: {
            Authorization: `Basic ${authHeader}`,
          },
          next: {
            revalidate: 3600,
          },
        },
      );

      if (!res.ok) {
        console.error(
          `WP Fetch Failed Server-Side: ${res.status} ${res.statusText}`,
        );
        return [];
      }
      return await res.json();
    } else {
      // 💻 CLIENT-SIDE: Route through your secure Next.js API Proxy
      const res = await fetch(`${API_BASE}/${postType}?${queryParams}`);

      if (!res.ok) {
        console.error(
          `Next API Fetch Failed Client-Side: ${res.status} ${res.statusText}`,
        );
        return [];
      }
      return await res.json();
    }
  } catch (error: any) {
    console.error(`Error fetching posts for ${postType}:`, error);
    return [];
  }
};


export const fetchPostById = async (
  postType: "innovation" | "posts" | "extraction" | "asint",
  id: number,
  lang: string = "en",
): Promise<Post | null> => {
  try {
    // 1. Fetch the original post using the known ID
    const { data: sourcePost } = await axios.get(`${API_BASE}/${postType}/${id}`, {
      params: { _embed: true },
    });
    
    // console.log(`SOURCE POST:`, sourcePost);
    if (!sourcePost) return null;

    // 2. If the post is already in the requested language, return it directly
    if (sourcePost.lang === lang) {
      return sourcePost;
    }


    // 3. Look up the exact ID for the requested language translation
    // Polylang exposes this either directly on `translations` or inside `meta.polylang`
    const translationsMap = sourcePost.translations || sourcePost.meta?.polylang?.translations;
    const translatedId = translationsMap?.[lang];

    if (!translatedId) {
      console.warn(`No ${lang} translation found for post ID ${id}`);
      return null;
    }

    // 4. Fetch the mapped translated post
    const { data: translatedPost } = await axios.get(`${API_BASE}/${postType}/${translatedId}`, {
      params: { _embed: true },
    });

    return translatedPost;
  } catch (error) {
    console.error(`Error fetching post by ID ${id}:`, error);
    return null;
  }
};

export const fetchPostBySlug = async (
  postType: "innovation" | "posts" | "extraction" | "asint",
  slug: string,
  lang: string = "en",
): Promise<Post | null> => {
  try {
    // 1. Try fetching directly by slug and language first (Fastest path)
    const { data } = await axios.get(`${API_BASE}/${postType}`, {
      params: { slug: slug, lang: lang, _embed: true },
    });

    if (data && data.length > 0) {
      return data[0]; // Found exact match for slug + lang
    }

    // 2. If not found, the slug might belong to a different language version.
    // Fetch just by slug (ignoring language) to find the source post.
    const { data: baseData } = await axios.get(`${API_BASE}/${postType}`, {
      params: { slug: slug, _embed: true },
    });
    
    if (!baseData || baseData.length === 0) return null;

    const basePost = baseData[0];

    // 3. Extract the translation map
    const translationsMap = basePost.translations || basePost.meta?.polylang?.translations;
    const translatedId = translationsMap?.[lang];

    if (translatedId) {
      // 4. We found the ID for the target language, fetch it using our deterministic ID function
      return await fetchPostById(postType, translatedId, lang);
    }

    return null;
  } catch (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    return null;
  }
};





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

export const fetchTopLevelCategories = async (
  taxonomy: string = "categories",
  params?: { lang?: string; per_page?: number },
): Promise<Category[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append("parent", "0");
  queryParams.append("hide_empty", "false");

  if (params?.per_page) {
    queryParams.append("per_page", params.per_page.toString());
  }
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

  if (params?.per_page) {
    queryParams.append("per_page", params.per_page.toString());
  }
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









// export const fetchPostById = async (
//   postType: "innovation" | "posts" | "extraction" | "asint",
//   id: number,
//   lang: string = "en",
// ): Promise<Post | null> => {
//   try {
//     const { data } = await axios.get(`${API_BASE}/${postType}/${id}`, {
//       params: { lang: lang, _embed: true },
//     });

//     console.log(`Fetched post by ID ${id} with lang ${lang}:`, data);
//     if (data && data.lang === lang) return data;

//   } catch (error) {
//     // Ignore error
//     console.error("Error fetching post by ID:", error);
//   }

//   const pairedId = lang === "fr" ? id + 1 : id - 1;
//   try {
//     const { data } = await axios.get(`${API_BASE}/${postType}/${pairedId}`, {
//       params: { lang: lang, _embed: true },
//     });
//     if (data && data.lang === lang) return data;
//   } catch (error) {
//     // Ignore error
//   }

//   return null;
// };

// export const fetchPostBySlug = async (
//   postType: "innovation" | "posts" | "extraction" | "asint",
//   slug: string,
//   lang: string = "en",
// ): Promise<Post | null> => {
//   const { data } = await axios.get(`${API_BASE}/${postType}`, {
//     params: { slug: slug, lang: lang, _embed: true },
//   });

//   if (data.length > 0) return data[0];

//   const { data: baseData } = await axios.get(`${API_BASE}/${postType}`, {
//     params: { slug: slug, _embed: true },
//   });
  
//   console.log(`Fetched base post by slug ${slug} with lang ${lang}:`, baseData);

//   if (baseData.length > 0) {
//     const basePost = baseData[0];
//     if (basePost.lang === lang) return basePost;
//     if (basePost.meta?.polylang?.translations?.[lang]) {
//       const translatedId = basePost.meta.polylang.translations[lang];
//       return await fetchPostById(postType, translatedId, lang);
//     }
//   }
//   return null;
// };