export interface Post {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: "post" | "extraction" | "asint" | string;
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
  format: string;
  meta: any;
  categories?: number[];
  tags?: number[];
  [key: string]: any;
  lang?: string;
  acf?: {
    reading_time?: string | number;
    is_featured?: boolean;
    priority?: number;
    [key: string]: any;
    custom_author?: string;
  };
  _embedded?: {
    author?: any[];
    "wp:featuredmedia"?: any[];
    "wp:term"?: any[][];
    [key: string]: any;
  };
  _links?: Record<string, Array<{ href: string; embeddable?: boolean }>>;
  translations: Record<string, number>; // Polylang translations mapping
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}




export interface NormalizedPost {
  id: number;
  slug: string;
  title: string;          // Cleaned of HTML entities
  excerpt: string;        // Stripped of HTML tags
  content: string;        // Raw HTML for detail pages
  imageUrl: string;       // The extracted Cloudinary/WP URL or fallback
  authorName: string;
  date: string;           // ISO date string
  readTimeLabel: string;  // e.g., "4 mins read"
  topCategory: string;    // Extracted top-level category name
  postUrl: string;        // Pre-computed internal Next.js routing link
  type: string;           // Original post type for reference
  custom_author?: string; // Optional custom author field
}