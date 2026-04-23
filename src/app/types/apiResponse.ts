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
  };
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
