// @/app/helpers/fetchSocial.ts

export interface FacebookStats {
  followers: number;
  fans: number;
  pageViews: number;
  engagements: number;
}

export interface YouTubeStats {
  viewCount: number;
  subscriberCount: number;
  videoCount: number;
  avgViewsPerVideo: number;
}

export async function fetchFacebookMetrics(
  pageId: string,
  accessToken: string,
): Promise<FacebookStats | null> {
  try {
    // 1. Fetch core page stats (Followers & Likes/Fans)
    const pageUrl =
      `https://graph.facebook.com/v20.0/${pageId}?fields=followers_count,fan_count&access_token=${accessToken}`;
    const pageRes = await fetch(pageUrl, { next: { revalidate: 3600 } });
    const pageData = await pageRes.json();

    if (pageData.error) {
      console.error("META PAGE ERROR:", pageData.error.message);
      return null;
    }
    // 2. Fetch engagement insights (Views & Interactions)
    const insightsUrl =
      `https://graph.facebook.com/v20.0/${pageId}/insights?metric=page_views_total,page_post_engagements&period=day&access_token=${accessToken}`;
    const insightsRes = await fetch(insightsUrl, {
      next: { revalidate: 3600 },
    });
    const insightsData = await insightsRes.json();

    if (insightsData.error) {
      console.error("META INSIGHTS ERROR:", insightsData.error.message);
    }

    const insights = insightsData.data || [];
    const views = insights.find((m: any) =>
      m.name === "page_views_total"
    )?.values?.[0]?.value || 0;
    const engagements = insights.find((m: any) =>
      m.name === "page_post_engagements"
    )?.values?.[0]?.value || 0;

    return {
      followers: pageData.followers_count || 0,
      fans: pageData.fan_count || 0,
      pageViews: views,
      engagements: engagements,
    };
  } catch (error) {
    console.error("Facebook fetch error:", error);
    return null;
  }
}

export async function fetchYouTubeMetrics(
  channelIdentifier: string,
  apiKey: string,
): Promise<YouTubeStats | null> {
  try {
    // Check if the identifier is a handle (starts with @) or a standard ID (starts with UC)
    const idParam = channelIdentifier.startsWith("@")
      ? `forHandle=${channelIdentifier.substring(1)}`
      : `id=${channelIdentifier}`;

    const url =
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&${idParam}&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    const stats = data.items?.[0]?.statistics;
    if (!stats) return null;

    const views = Number(stats.viewCount || 0);
    const videos = Number(stats.videoCount || 0);
    const subs = Number(stats.subscriberCount || 0);

    return {
      viewCount: views,
      subscriberCount: subs,
      videoCount: videos,
      // Derived metric for deeper insight
      avgViewsPerVideo: videos > 0 ? Math.round(views / videos) : 0,
    };
  } catch (error) {
    console.error("YouTube fetch error:", error);
    return null;
  }
}
