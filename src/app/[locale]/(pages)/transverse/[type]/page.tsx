
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLatestChannelVideos } from "@/lib/yt";

const CATEGORY_MAP: Record<string, { name: string; channelId: string }> = {
  "ai-or-die": { name: "AI or Die", channelId: "DUMMY_AI_CHANNEL_ID" },
  "guinea-means-business": { name: "Guinea Means Business", channelId: "DUMMY_GMB_CHANNEL_ID" },
  "one-quarter-one-city": { name: "One Quarter, One City", channelId: "DUMMY_OQOC_CHANNEL_ID" },
};

interface TransverseCategoryPageProps {
  params: Promise<{ type: string }>;
}

export default async function TransverseCategoryPage({ params }: TransverseCategoryPageProps) {
  const { type } = await params;
  const categoryData = CATEGORY_MAP[type];

  if (!categoryData) {
    notFound();
  }

  const videos = await getLatestChannelVideos(categoryData.channelId, 5);
  const featuredVideo = videos[0];
  const listVideos = videos.slice(1);

  return (
    <div className="flex flex-col">
      
      {/* Hero Video Iframe */}
      {featuredVideo ? (
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-foreground/5 mb-16 shadow-lg">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${featuredVideo.id}?rel=0`}
            title={featuredVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className="w-full aspect-video rounded-2xl flex items-center justify-center bg-foreground/5 mb-16 text-foreground/50">
          No featured video available for this category yet.
        </div>
      )}

      {/* Video List */}
      <div className="flex flex-col">
        {listVideos.map((video, index) => {
          const displayNum = String(listVideos.length - index).padStart(2, '0');

          return (
            <div key={video.id} className="flex flex-col md:flex-row items-start md:items-center py-8 border-b border-foreground/20 gap-6 md:gap-12">
              <span className="text-2xl md:text-3xl font-bold w-8 text-foreground/80">{displayNum}</span>
              <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 bg-foreground/10 rounded-md overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded">
                  {video.channelName}
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold flex-grow max-w-md leading-snug">{video.title}</h3>
              <div className="flex flex-row md:flex-col lg:flex-row items-center md:items-start lg:items-center gap-4 text-sm font-medium text-foreground/60">
                <span>Date <span className="text-foreground ml-1">{video.date}</span></span>
                <span className="hidden lg:block">•</span>
                <span>Duration <span className="text-foreground ml-1">{video.duration}</span></span>
              </div>
              <Link href={`https://youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-bold uppercase text-sm tracking-widest hover:opacity-70 transition-opacity ml-auto mt-4 md:mt-0">
                WATCH <span className="text-xl">&rarr;</span>
              </Link>
            </div>
          );
        })}
        
        {listVideos.length === 0 && (
          <div className="py-12 text-center text-foreground/50">
            More videos coming soon to {categoryData.name}.
          </div>
        )}
      </div>

    </div>
  );
}