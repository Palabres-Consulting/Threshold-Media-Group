// lib/config.ts

type SiteConfig = {
  wordpressEndpoint: string; // base API
  postTypes: {
    posts: string;
    categories: string;
  };
  translations: string[]; // languages available
  supabase?: {
    url: string;
    key: string;
  };
};

export const siteConfigs: Record<string, SiteConfig> = {
  main: {
    wordpressEndpoint: "https://thresholdgroup.com/wp-json/wp/v2",
    postTypes: {
      posts: "https://thresholdgroup.com/wp-json/wp/v2/posts",
      categories: "https://thresholdgroup.com/wp-json/wp/v2/categories",
    },
    translations: ["en", "fr"],
  },
  extraction: {
    wordpressEndpoint: "https://extraction.thresholdgroup.com/wp-json/wp/v2",
    postTypes: {
      posts: "https://extraction.thresholdgroup.com/wp-json/wp/v2/posts",
      categories:
        "https://extraction.thresholdgroup.com/wp-json/wp/v2/categories",
    },
    translations: ["en", "fr"],
  },
  asint: {
    wordpressEndpoint: "https://asint.thresholdgroup.com/wp-json/wp/v2",
    postTypes: {
      posts: "https://asint.thresholdgroup.com/wp-json/wp/v2/posts",
      categories: "https://asint.thresholdgroup.com/wp-json/wp/v2/categories",
    },
    translations: ["en", "fr"],
  },
};
