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
  description: "Enriched page view and retention tracking data for articles",
  schema: {
    timestamp: t.dateTime(),
    session_id: t.string(),
    event_type: t.string(), // Captures 'page_view' or 'page_leave'
    duration_seconds: t.int32(), // Captures retention time on exit
    pathname: t.string(),
    referrer: t.string().nullable(),
    article_id: t.string().nullable(),
    category: t.string().nullable(),
    locale: t.string().nullable(),
  },
  engine: engine.mergeTree({
    sortingKey: ["pathname", "timestamp"],
  }),
});

export type PageViewsRow = InferRow<typeof pageViews>;

// ============================================================================
// Endpoints
// ============================================================================

export const popularArticles = defineEndpoint("popular_articles", {
  description: "Get trending article IDs grouped by views and retention metrics",
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
          -- Count everything except 'page_leave' to maintain backward compatibility 
          -- with older rows that might have an empty string instead of 'page_view'
          countIf(event_type != 'page_leave') AS views,
          
          -- Only average the duration when the user actually leaves
          avgIf(duration_seconds, event_type = 'page_leave') AS avg_retention_seconds
        FROM page_views
        WHERE timestamp >= {{DateTime(start_date)}}
          AND timestamp <= {{DateTime(end_date)}}
          AND article_id IS NOT NULL
          {% if defined(locale) %}
            AND locale = {{String(locale)}}
          {% end %}
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
    avg_retention_seconds: t.float64(),
  },
});

export const tinybird = new Tinybird({
  token: process.env.TINYBIRD_TOKEN,
  baseUrl: 'https://api.europe-west2.gcp.tinybird.co', 
  datasources: { pageViews },
  pipes: { popularArticles },
});

export type PopularArticlesRow = InferRow<typeof popularArticles>;
export type PopularArticlesParams = InferParams<typeof popularArticles>;
export type PopularArticlesOutput = InferOutputRow<typeof popularArticles>;