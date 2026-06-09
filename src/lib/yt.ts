

export const TRANSVERSE_MEDIA_MAP: Record<
  string,
  {
    name: string;
    playlistId: string;
    description: string;
  }
> = {
  highlights: {
    name: "Main Highlights",
    playlistId: "UU_K6gLqY2mXF3Z04m_Rby_Q", // Master feed hook
    description:
      "Welcome to our master video index channel. Stream premium cover stories, critical visual breakdowns, investigative summaries, and real-time situational analyses directly from our global reporting rooms.",
  },
  "ai-or-die": {
    name: "AI or Die",
    playlistId: "UU_K6gLqY2mXF3Z04m_Rby_Q", // Replace with specialized Playlist ID if available
    description:
      "Analyzing artificial superintelligence development vectors, deep-tech corporate maneuvers, automated warfare tech, and ethical parameters reshaping the modern horizon.",
  },
  "guinea-means-business": {
    name: "Guinea Means Business",
    playlistId: "UU_K6gLqY2mXF3Z04m_Rby_Q", // Replace with specialized Playlist ID if available
    description:
      "Tracking economic policy updates, trade logistics infrastructure growth, resource processing ventures, and venture operations across frontier sub-Saharan markets.",
  },
  "one-quarter-one-city": {
    name: "One Quarter, One City",
    playlistId: "UU_K6gLqY2mXF3Z04m_Rby_Q", // Replace with specialized Playlist ID if available
    description:
      "A close-range cinematic perspective exploring neighborhood transformations, grassroots economic structures, subcultures, and street art architecture across major cities.",
  },
};


export type YouTubeVideo = {
  id: string;
  title: string;
  date: string;
  duration: string;
  thumbnail: string;
  channelName: string;
};

// Formats ISO 8601 duration (e.g. PT14M32S -> "14:32")
function formatISO8601Duration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "00:00";
  
  const [ , hours, minutes, seconds] = match;
  const h = hours ? `${hours}h ` : "";
  const m = minutes ? `${minutes}m` : "0m";
  const s = seconds && !hours ? `:${seconds.padStart(2, '0')}` : "";

  if (hours) return `${h}${m}`;
  return `${minutes || '0'}${s}`;
}

export async function getLatestChannelVideos(
  playlistOrChannelId: string, 
  maxResults: number = 5
): Promise<YouTubeVideo[]> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("Missing YOUTUBE_API_KEY inside environment arrays.");
    return [];
  }

  try {
    // 1. Resolve the handle directly to avoid 404 Playlist ID desyncs
    const targetHandle = "ThresholdMediagroup";
    const channelLookupUrl = `https://www.googleapis.com/youtube/v3/channels?part=id,contentDetails&forHandle=${targetHandle}&key=${apiKey}`;
    
    const channelRes = await fetch(channelLookupUrl, { next: { revalidate: 86400 } }); // Cache ID for 24 hours
    if (!channelRes.ok) {
      const errTxt = await channelRes.text();
      console.error("Google Handle Lookup Failure:", errTxt);
      throw new Error(`Handle Lookup returned code: ${channelRes.status}`);
    }
    
    const channelData = await channelRes.json();
    if (!channelData.items || channelData.items.length === 0) {
      console.error(`Could not locate any active YouTube profile for handle: @${targetHandle}`);
      return [];
    }

    // 2. Extract the canonical uploads playlist ID given by Google's response object
    const actualUploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 3. Request items from the verified public playlist
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=${maxResults}&playlistId=${actualUploadsPlaylistId}&key=${apiKey}`;
    const playlistRes = await fetch(playlistUrl, { next: { revalidate: 3600 } }); // Cache feed list 1 hour
    
    if (!playlistRes.ok) {
      const playlistErr = await playlistRes.text();
      console.error("Google Playlist Item Stream Error:", playlistErr);
      throw new Error(`Playlist request block failure status: ${playlistRes.status}`);
    }
    const playlistData = await playlistRes.json();
    if (!playlistData.items || playlistData.items.length === 0) return [];

    // 4. Batch lookup timestamps and parsing configurations to read durations
    const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(",");
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`;
    const videoRes = await fetch(videoUrl, { next: { revalidate: 3600 } });
    const videoData = await videoRes.json();

    const durationMap = new Map<string, string>();
    videoData.items?.forEach((item: any) => {
      durationMap.set(item.id, formatISO8601Duration(item.contentDetails.duration));
    });

    // 5. Build cleanly mapped layout array
    return playlistData.items.map((item: any): YouTubeVideo => {
      const vId = item.contentDetails.videoId;
      const snippet = item.snippet;
      
      return {
        id: vId,
        title: snippet.title,
        date: new Date(snippet.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        duration: durationMap.get(vId) || "Video",
        thumbnail: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url,
        channelName: snippet.channelTitle
      };
    });

  } catch (error) {
    console.error("Critical Runtime Error inside getLatestChannelVideos processing logic:", error);
    return [];
  }
}