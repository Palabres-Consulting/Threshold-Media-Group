// lib/youtube.ts

export type YouTubeVideo = {
  id: string;
  title: string;
  date: string;
  duration: string; // YouTube API returns ISO 8601 duration (e.g. PT45M), you'll need to format it later
  thumbnail: string;
  channelName: string;
};

// Dummy Data for Conceptualization
const DUMMY_VIDEOS: YouTubeVideo[] = [
  {
    id: "dQw4w9WgXcQ", // Replace with real video IDs to test the iframe
    title: "The Problem of today's cultural development",
    date: "January 21, 2026",
    duration: "45 Min",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80",
    channelName: "AI or Die"
  },
  {
    id: "jNQXAC9IVRw",
    title: "The hidden messages of Jack Nielson",
    date: "January 14, 2026",
    duration: "1 h 4 Min",
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&q=80",
    channelName: "Guinea Means Business"
  },
  {
    id: "M7lc1UVf-VE",
    title: "Behind the scenes of the street art culture",
    date: "January 07, 2026",
    duration: "56 Min",
    thumbnail: "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=500&q=80",
    channelName: "One Quarter, One City"
  },
  {
    id: "ysz5S6PUM-U",
    title: "The art of movement",
    date: "December 01, 2025",
    duration: "40 Min",
    thumbnail: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&q=80",
    channelName: "AI or Die"
  }
];

/**
 * Reusable function to fetch videos from a YouTube Channel.
 * @param channelId - The ID of the YouTube channel
 * @param maxResults - How many videos to return
 */
export async function getLatestChannelVideos(channelId: string, maxResults: number = 5): Promise<YouTubeVideo[]> {
  // TODO: Implement actual YouTube Data API fetch here
  // const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=YOUR_API_KEY&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`);
  // const data = await res.json();
  // return mapDataToYouTubeVideoType(data);

  console.log(`Simulating fetch for channel: ${channelId}`);
  
  // Return dummy data for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DUMMY_VIDEOS.slice(0, maxResults));
    }, 500); // simulate network delay
  });
}