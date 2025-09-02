// lib/config.ts

type SiteConfig = {
  name: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
  };
  wordpressEndpoint: string; // API for posts
  translations: string[]; // languages available
};

export const siteConfigs: Record<string, SiteConfig> = {
  main: {
    name: "Threshold Group",
    logo: "/logo-main.png",
    colors: {
      primary: "#1D4ED8", // blue
      secondary: "#9333EA", // purple
    },
    wordpressEndpoint: "https://thresholdgroup.com/wp-json/wp/v2",
    translations: ["en", "fr"],
  },
  extraction: {
    name: "Threshold Extraction",
    logo: "/logo-extraction.png",
    colors: {
      primary: "#059669", // green
      secondary: "#047857", // darker green
    },
    wordpressEndpoint: "https://extraction.thresholdgroup.com/wp-json/wp/v2",
    translations: ["en", "fr"],
  },
  asint: {
    name: "Threshold Asint",
    logo: "/logo-asint.png",
    colors: {
      primary: "#DC2626", // red
      secondary: "#B91C1C",
    },
    wordpressEndpoint: "https://asint.thresholdgroup.com/wp-json/wp/v2",
    translations: ["en", "fr"],
  },
};
