import { fetchPostById } from '@/app/helpers/fetchLib';
import { normalizePost } from '@/app/helpers/normalizeData'; 
import { tinybird } from '@/lib/tinybird';

type AllowedPostTypes = "innovation" | "posts" | "extraction" | "asint";

interface ArticlesAnalyticsProps {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

// Helper to format raw seconds into a readable string
function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

export default async function ArticlesAnalytics({
  startDate = '2026-06-01 00:00:00',
  endDate = '2026-06-30 23:59:59',
  limit = 5,
}: ArticlesAnalyticsProps) {
  
  // 1. Fetch metrics from Tinybird
  const { data: trendingMetrics } = await tinybird.popularArticles.query({
    start_date: startDate,
    end_date: endDate,
    limit: limit,
  });

  if (!trendingMetrics || trendingMetrics.length === 0) {
    return <div className="text-gray-500 py-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">No article analytics data available yet.</div>;
  }

  // 2. Hydrate CRM/CMS post data concurrently
  const hydrationPromises = trendingMetrics.map((metric) => {
    const id = parseInt(metric.article_id, 10);
    const type = metric.category as AllowedPostTypes;
    const lang = metric.locale || 'en';
    return fetchPostById(type, id, lang);
  });

  const rawArticlesResult = await Promise.all(hydrationPromises);
  
  const normalizedArticles = rawArticlesResult
    .filter(Boolean)
    .map((post) => normalizePost(post!, post!.type)); 

  // 3. Sort variants client-side for the two distinct lists
  const mostViewed = [...trendingMetrics].sort((a, b) => Number(b.views) - Number(a.views));
  const highestRetention = [...trendingMetrics].sort((a, b) => b.avg_retention_seconds - a.avg_retention_seconds);

  // Shared row renderer to keep the UI clean and unified
  const renderArticleRow = (metric: typeof trendingMetrics[number], metricType: 'views' | 'retention') => {
    const articleContent = normalizedArticles.find((post) => post.id.toString() === metric.article_id);
    const displayTitle = articleContent?.title || `Article Reference ID: #${metric.article_id}`;

    return (
      <div key={metric.article_id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
        <div className="flex items-center gap-3 pr-4 min-w-0">
          {articleContent?.imageUrl && (
            <img 
              src={articleContent.imageUrl} 
              alt={displayTitle}
              className="w-10 h-10 rounded object-cover bg-gray-100 flex-shrink-0 border border-gray-100"
            />
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-gray-900 line-clamp-1 text-sm">
              {displayTitle}
            </span>
            <div className="flex gap-2 text-[11px] text-gray-400 mt-0.5 uppercase tracking-wider font-medium">
              <span>{articleContent?.topCategory || metric.category}</span>
              <span>•</span>
              <span>{metric.locale}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right whitespace-nowrap pl-2">
          {metricType === 'views' ? (
            <>
              <span className="text-base font-bold text-emerald-600">{metric.views.toString()}</span>
              <p className="text-[10px] text-gray-400 font-medium tracking-tight">Views</p>
            </>
          ) : (
            <>
              <span className="text-base font-bold text-indigo-600">{formatDuration(metric.avg_retention_seconds)}</span>
              <p className="text-[10px] text-gray-400 font-medium tracking-tight">Avg. Stay</p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* List 1: Most Viewed */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50/70 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800 text-sm">Most Viewed Content</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {mostViewed.map((m) => renderArticleRow(m, 'views'))}
        </div>
      </div>

      {/* List 2: Highest Retention */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50/70 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800 text-sm">Highest Retention (Audience Attention)</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {highestRetention.map((m) => renderArticleRow(m, 'retention'))}
        </div>
      </div>
    </div>
  );
}