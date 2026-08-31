import { fetchPostById } from '@/app/helpers/fetchLib';
import { normalizePost } from '@/app/helpers/normalizeData'; 
import { tinybird } from '@/lib/tinybird';
import { fetchFacebookMetrics, fetchYouTubeMetrics } from '@/app/helpers/fetchSocial';

type AllowedPostTypes = "innovation" | "posts" | "extraction" | "asint";

interface ArticlesAnalyticsProps {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

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
  
  const { data: trendingMetrics } = await tinybird.popularArticles.query({
    start_date: startDate,
    end_date: endDate,
    limit: limit,
  });

  const hydrationPromises = (trendingMetrics || []).map((metric) => {
    const id = parseInt(metric.article_id, 10);
    const type = metric.category as AllowedPostTypes;
    const lang = metric.locale || 'en';
    return fetchPostById(type, id, lang);
  });

  const [rawArticlesResult, facebookStats, youtubeStats] = await Promise.all([
    Promise.all(hydrationPromises),
    fetchFacebookMetrics(process.env.FB_PAGE_ID!, process.env.FB_ACCESS_TOKEN!),
    fetchYouTubeMetrics(process.env.YT_CHANNEL_ID!, process.env.YT_API_KEY!),
  ]);

  const normalizedArticles = rawArticlesResult
    .filter(Boolean)
    .map((post) => normalizePost(post!, post!.type)); 

  const mostViewed = [...(trendingMetrics || [])].sort((a, b) => Number(b.views) - Number(a.views));
  const highestRetention = [...(trendingMetrics || [])].sort((a, b) => b.avg_retention_seconds - a.avg_retention_seconds);

  const renderArticleRow = (metric: typeof trendingMetrics[number], metricType: 'views' | 'retention') => {
    const articleContent = normalizedArticles.find((post) => post.id.toString() === metric.article_id);
    const displayTitle = articleContent?.title || `Article #${metric.article_id}`;

    return (
      <div key={metric.article_id} className="p-4 flex justify-between items-center hover:bg-foreground/5 transition-colors">
        <div className="flex items-center gap-3 pr-4 min-w-0">
          {articleContent?.imageUrl && (
            <img 
              src={articleContent.imageUrl} 
              alt={displayTitle}
              className="w-10 h-10 rounded object-cover bg-background flex-shrink-0 border border-foreground/10"
            />
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-foreground line-clamp-1 text-sm">
              {displayTitle}
            </span>
            <div className="flex gap-2 text-[11px] text-foreground/60 mt-0.5 uppercase tracking-wider font-medium">
              <span>{articleContent?.topCategory || metric.category}</span>
              <span>•</span>
              <span>{metric.locale}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right whitespace-nowrap pl-2">
          {metricType === 'views' ? (
            <>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{metric.views.toString()}</span>
              <p className="text-[10px] text-foreground/60 font-medium tracking-tight">Views</p>
            </>
          ) : (
            <>
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{formatDuration(metric.avg_retention_seconds)}</span>
              <p className="text-[10px] text-foreground/60 font-medium tracking-tight">Avg. Stay</p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full">
      {/* SECTION: Social Media Overview */}
      <div className="bg-background rounded-xl border border-foreground/10 p-5">
        <h2 className="font-semibold text-foreground text-sm mb-4">Social Media Channels Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Facebook Card */}
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">Facebook Page</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium tracking-wide uppercase">Meta API</span>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-2">
              <div>
                <p className="text-[11px] text-foreground/60 uppercase tracking-wider mb-0.5">Followers</p>
                <p className="text-lg font-semibold text-foreground">{facebookStats ? facebookStats.followers.toLocaleString() : '—'}</p>
              </div>
              <div>
                <p className="text-[11px] text-foreground/60 uppercase tracking-wider mb-0.5">Page Likes</p>
                <p className="text-lg font-semibold text-foreground">{facebookStats ? facebookStats.fans.toLocaleString() : '—'}</p>
              </div>
              <div>
                <p className="text-[11px] text-foreground/60 uppercase tracking-wider mb-0.5">Daily Views</p>
                <p className="text-lg font-semibold text-foreground">{facebookStats ? facebookStats.pageViews.toLocaleString() : '—'}</p>
              </div>
              <div>
                <p className="text-[11px] text-foreground/60 uppercase tracking-wider mb-0.5">Engagements</p>
                <p className="text-lg font-semibold text-foreground">{facebookStats ? facebookStats.engagements.toLocaleString() : '—'}</p>
              </div>
            </div>
          </div>

          {/* YouTube Card */}
          <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-red-600 dark:text-red-400 text-sm">YouTube Channel</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-medium tracking-wide uppercase">Data API v3</span>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-2">
              <div>
                <p className="text-[11px] text-foreground/60 uppercase tracking-wider mb-0.5">Subscribers</p>
                <p className="text-lg font-semibold text-foreground">{youtubeStats ? youtubeStats.subscriberCount.toLocaleString() : '—'}</p>
              </div>
              <div>
                <p className="text-[11px] text-foreground/60 uppercase tracking-wider mb-0.5">Total Views</p>
                <p className="text-lg font-semibold text-foreground">{youtubeStats ? youtubeStats.viewCount.toLocaleString() : '—'}</p>
              </div>
              <div>
                <p className="text-[11px] text-foreground/60 uppercase tracking-wider mb-0.5">Videos</p>
                <p className="text-lg font-semibold text-foreground">{youtubeStats ? youtubeStats.videoCount.toLocaleString() : '—'}</p>
              </div>
              <div>
                <p className="text-[11px] text-foreground/60 uppercase tracking-wider mb-0.5">Avg View/Video</p>
                <p className="text-lg font-semibold text-foreground">{youtubeStats ? youtubeStats.avgViewsPerVideo.toLocaleString() : '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Website Analytics Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* List 1: Most Viewed */}
        <div className="bg-background rounded-xl border border-foreground/10 overflow-hidden">
          <div className="p-4 bg-foreground/5 border-b border-foreground/10">
            <h2 className="font-semibold text-foreground text-sm">Most Viewed Content</h2>
          </div>
          <div className="divide-y divide-foreground/10">
            {mostViewed.map((m) => renderArticleRow(m, 'views'))}
          </div>
        </div>

        {/* List 2: Highest Retention */}
        <div className="bg-background rounded-xl border border-foreground/10 overflow-hidden">
          <div className="p-4 bg-foreground/5 border-b border-foreground/10">
            <h2 className="font-semibold text-foreground text-sm">Highest Retention (Audience Attention)</h2>
          </div>
          <div className="divide-y divide-foreground/10">
            {highestRetention.map((m) => renderArticleRow(m, 'retention'))}
          </div>
        </div>
      </div>
    </div>
  );
}