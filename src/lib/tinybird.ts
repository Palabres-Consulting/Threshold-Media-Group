import {
  defineDatasource,
  defineEndpoint,
  Tinybird,
  node,
  t,
  p,
  engine,
  type InferRow,
  type InferParams,
  type InferOutputRow,
} from "@tinybirdco/sdk";

// ============================================================================
// Datasources
// ============================================================================

export const pageViews = defineDatasource("page_views", {
  description: "Enriched page view tracking data for articles",
  schema: {
    timestamp: t.dateTime(),
    session_id: t.string(),
    pathname: t.string(),
    referrer: t.string().nullable(),
    article_id: t.string().nullable(),
    category: t.string().nullable(),
    locale: t.string().nullable(),
  },
  engine: engine.mergeTree({
    // FIXED: Reverted to non-nullable columns for fast, valid indexing
    sortingKey: ["pathname", "timestamp"],
  }),
});

export type PageViewsRow = InferRow<typeof pageViews>;

// ============================================================================
// Endpoints
// ============================================================================

export const popularArticles = defineEndpoint("popular_articles", {
  description: "Get trending article IDs grouped by engagement metrics",
  params: {
    start_date: p.dateTime().describe("Start of range"),
    end_date: p.dateTime().describe("End of range"),
    locale: p.string().optional().describe("Filter by language"),
    limit: p.int32().optional(10).describe("Max rows"),
  },
  nodes: [
    node({
      name: "top_ids",
      sql: `
        SELECT
          article_id,
          category,
          locale,
          count() AS views
        FROM page_views
        WHERE timestamp >= {{DateTime(start_date)}}
          AND timestamp <= {{DateTime(end_date)}}
          AND article_id IS NOT NULL
          {% if defined(locale) %}
            AND locale = {{String(locale)}}
          {% end %} -- FIXED: Changed from endif to end
        GROUP BY article_id, category, locale
        ORDER BY views DESC
        LIMIT {{Int32(limit, 10)}}
      `,
    }),
  ],
  output: {
    article_id: t.string(),
    category: t.string(),
    locale: t.string(),
    views: t.uint64(),
  },
});

export const tinybird = new Tinybird({
  token: process.env.TINYBIRD_API_KEY,
  baseUrl: 'https://api.europe-west2.gcp.tinybird.co', 
  datasources: { pageViews },
  pipes: { popularArticles },
});

export type PopularArticlesRow = InferRow<typeof popularArticles>;
export type PopularArticlesParams = InferParams<typeof popularArticles>;
export type PopularArticlesOutput = InferOutputRow<typeof popularArticles>;