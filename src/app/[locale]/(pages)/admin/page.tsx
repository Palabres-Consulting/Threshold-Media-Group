import { fetchPostById } from '@/app/helpers/fetchLib';
// Adjust the import path below to point to the file where your normalizer is saved
import { normalizePost } from '@/app/helpers/normalizeData'; 
import { tinybird } from '@/lib/tinybird';

// Helper type to match your exact fetch signature
type AllowedPostTypes = "innovation" | "posts" | "extraction" | "asint";

export default async function AdminDashboard() {
  // 1. Fetch performance analytics data from Tinybird
  const { data: trendingMetrics } = await tinybird.popularArticles.query({
    start_date: '2026-06-01 00:00:00',
    end_date: '2026-06-30 23:59:59',
    limit: 5,
  });

  if (!trendingMetrics || trendingMetrics.length === 0) {
    return <div className="p-6">No article analytics data available yet.</div>;
  }

  // 2. Map metrics to parallel fetch promises
  const hydrationPromises = trendingMetrics.map((metric) => {
    const id = parseInt(metric.article_id, 10);
    const type = metric.category as AllowedPostTypes;
    const lang = metric.locale || 'en';

    return fetchPostById(type, id, lang);
  });

  // 3. Execute all fetches concurrently
  const rawArticlesResult = await Promise.all(hydrationPromises);
  
  // 4. Filter nulls and NORMALIZE the data for the UI
  const normalizedArticles = rawArticlesResult
    .filter(Boolean)
    // We pass the article's type as the siteType argument for the normalizer
    .map((post) => normalizePost(post!, post!.type)); 

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Popular Content Performance</h1>
      <div className="bg-white rounded-xl shadow divide-y">
        {trendingMetrics.map((metric) => {
          // Find the perfectly clean normalized post that matches this metric
          const articleContent = normalizedArticles.find(
            (post) => post.id.toString() === metric.article_id
          );

          // We can now safely use .title instead of dealing with .title.rendered
          const displayTitle = articleContent?.title || `Article Reference ID: #${metric.article_id}`;

          return (
            <div key={metric.article_id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
              <div className="flex items-center gap-4 pr-4">
                
                {/* Bonus: Since the normalizer extracts featured media, we can show a thumbnail! */}
                {articleContent?.imageUrl && (
                  <img 
                    src={articleContent.imageUrl} 
                    alt={displayTitle}
                    className="w-12 h-12 rounded object-cover bg-gray-100 flex-shrink-0"
                  />
                )}

                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 line-clamp-1">
                    {displayTitle}
                  </span>
                  <div className="flex gap-3 text-xs text-gray-500 mt-1 uppercase tracking-wider">
                    {/* Using the clean topCategory from the normalizer if available */}
                    <span>Category: {articleContent?.topCategory || metric.category}</span>
                    <span>•</span>
                    <span>Lang: {metric.locale}</span>
                    
                    {/* Displaying read time since your normalizer calculates it */}
                    {articleContent?.readTimeLabel && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{articleContent.readTimeLabel}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right whitespace-nowrap pl-4">
                <span className="text-xl font-bold text-emerald-600">
                  {metric.views.toString()}
                </span>
                <p className="text-xs text-gray-400 font-medium">Page Views</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}