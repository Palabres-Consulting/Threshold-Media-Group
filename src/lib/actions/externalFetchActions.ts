"use server";

import { ArticleItem } from "@/lib/template/tmgTemplate";
import { fetchAsintPosts, fetchExtractionPosts, fetchPostById } from "@/app/helpers/fetchLib"; // Adjust import path if needed
import { tinybird } from "@/lib/tinybird"; 


// Helper to strip HTML tags from WordPress excerpts
const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '').trim();
};

// Helper to extract featured image URL from WordPress payloads
function getArticleImageUrl(post: any): string {
  if (!post) return "";
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post?.yoast_head_json?.og_image?.[0]?.url ||
    post?.jetpack_featured_media_url ||
    post?.featured_media_url ||
    post?.featured_image_url ||
    ""
  );
}

export async function fetchAlsoThisWeek(): Promise<ArticleItem[]> {
  try {
    // Fetch 1 ASINT post and 1 Extraction post concurrently
    const [asintPosts, extractionPosts] = await Promise.all([
      fetchAsintPosts({ per_page: 1, lang: "en" }),
      fetchExtractionPosts({ per_page: 1, lang: "en" })
    ]);

    const articles: ArticleItem[] = [];

    // Map ASINT post
    if (asintPosts && asintPosts.length > 0) {
      const post = asintPosts[0];
      articles.push({
        title: post.title?.rendered || "Latest ASINT Intelligence",
        snippet: stripHtml(post.excerpt?.rendered).substring(0, 120) + "...",
        url: `https://thresholdmedia.group/journal/${post.slug}?id=${post.id}&type=asint`,
        imageUrl: getArticleImageUrl(post) // ✅ Added featured image extraction
      });
    }

    // Map Extraction post
    if (extractionPosts && extractionPosts.length > 0) {
      const post = extractionPosts[0];
      articles.push({
        title: post.title?.rendered || "Latest Extraction Analysis",
        snippet: stripHtml(post.excerpt?.rendered).substring(0, 120) + "...",
        url: `https://extraction.thresholdmedia.group/journal/${post.slug}?id=${post.id}&type=extraction`,
        imageUrl: getArticleImageUrl(post) // ✅ Added featured image extraction
      });
    }

    return articles;
  } catch (error) {
    console.error("Error fetching Also This Week articles:", error);
    return [];
  }
}


export async function fetchRecommendedReads(): Promise<ArticleItem[]> {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    
    const startDate = start.toISOString().replace('T', ' ').substring(0, 19);
    const endDate = end.toISOString().replace('T', ' ').substring(0, 19);

    // 1. Fetch metrics from Tinybird
    const { data: trendingMetrics } = await tinybird.popularArticles.query({
      start_date: startDate,
      end_date: endDate,
      limit: 3,
    });

    // If Tinybird returns nothing (e.g., no traffic yet), return fallback data so the UI doesn't vanish
    if (!trendingMetrics || trendingMetrics.length === 0) {
      console.warn("Tinybird returned no articles. Rendering fallback UI.");
      return [
        {
          title: "West African Power Pool (WAPP): cross-border grid interconnection status",
          category: "EXTRACTION",
          url: "https://extraction.thresholdmedia.group"
        },
        {
          title: "Guinea’s Bauxite Quota Rumours, China’s Import Glut, and the Market Caught Between Two Policy Timelines",
          category: "EXTRACTION",
          url: "https://extraction.thresholdmedia.group"
        }
      ];
    }

    // 2. Hydrate CRM/CMS post data concurrently
    const hydrationPromises = trendingMetrics.map((metric: any) => {
      const id = parseInt(metric.article_id, 10);
      const type = metric.category as "innovation" | "posts" | "extraction" | "asint";
      const lang = metric.locale || 'en';
      return fetchPostById(type, id, lang);
    });

    const rawArticlesResult = await Promise.all(hydrationPromises);
    
    // 3. Map to ArticleItem
    const recommended: ArticleItem[] = rawArticlesResult
      .filter(Boolean)
      .map((post: any) => {
        const baseUrl = post.type === 'extraction' 
          ? 'https://extraction.thresholdmedia.group' 
          : 'https://thresholdmedia.group';

        return {
          title: post.title?.rendered || "Featured Analysis",
          category: post.type?.toUpperCase() || "ANALYSIS",
          url: `${baseUrl}/journal/${post.slug}?id=${post.id}&type=${post.type}`
        };
      });

    return recommended;

  } catch (error) {
    console.error("Error fetching Recommended Reads:", error);
    
    // Fallback UI in case of API failure
    return [
      {
        title: "West African Power Pool (WAPP): cross-border grid interconnection status",
        category: "EXTRACTION",
        url: "https://extraction.thresholdmedia.group"
      }
    ];
  }
}