import { NormalizedPost, Post } from "@/app/types/apiResponse";
import { calculateReadTime } from "./readTime";
import { getTopLevelCategory } from "./categoriesMap";

// Internal helper for title cleaning
const cleanTitle = (titleData: any): string => {
  const rawTitle = typeof titleData === "string"
    ? titleData
    : titleData?.rendered || "Untitled Post";

  return rawTitle
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8211;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”");
};

const cleanCategory = (category: string) => {
  return category
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8211;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&amp;/g, "&");
};

// Internal helper for excerpt HTML stripping
const cleanExcerpt = (excerptData: any): string => {
  const rawExcerpt = excerptData?.rendered || "";
  return rawExcerpt
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8211;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&#8220;/g, "“")
    .replace(/&#038;/g, "&")
    .replace(/&#8221;/g, "”");
};

/**
 * Transforms a single raw WordPress Post into a clean UI-ready object.
 */
export const normalizePost = (post: Post, siteType: string): NormalizedPost => {
  // 1. Core Data
  const id = post.id || 0;
  const slug = post.slug || "";
  const title = cleanTitle(post.title);
  const excerpt = cleanExcerpt(post.excerpt);
  const content = post.content?.rendered || "";
  const date = post.date || new Date().toISOString();

  // 2. Media Extraction
  const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/images/homepage/home4.png";

  // 3. Author Extraction
  const authorName = post._embedded?.author?.[0]?.name || "Unknown Author";

  // 4. Calculations & Mappings
  const readTimeMins = calculateReadTime(content);
  const topCatObj = getTopLevelCategory(post);
  const topCategory = topCatObj?.name
    ? cleanCategory(topCatObj?.name) || "Uncategorized"
    : "Uncategorized";

  // 5. URL Generation
  const typeParam = post.type === "post"
    ? "main"
    : (siteType || post.type || "main");
  const postUrl = `/journal/${slug}?id=${id}&type=${typeParam}`;

  return {
    id,
    slug,
    title,
    excerpt,
    content,
    imageUrl,
    authorName,
    date,
    readTimeLabel: `${readTimeMins} mins read`,
    topCategory,
    postUrl,
    type: post.type,
  };
};

/**
 * Transforms an array of raw WordPress Posts.
 */
export const normalizePosts = (
  posts: Post[],
  siteType: string,
): NormalizedPost[] => {
  if (!Array.isArray(posts)) return [];
  return posts.map((post) => normalizePost(post, siteType));
};
