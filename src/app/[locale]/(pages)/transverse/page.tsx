import React from "react";
import Link from "next/link";
import { getLatestChannelVideos, TRANSVERSE_MEDIA_MAP } from "@/lib/yt";

export default async function TransversePage() {
  const highlightConfig = TRANSVERSE_MEDIA_MAP["highlights"];
  const videos = await getLatestChannelVideos(highlightConfig.playlistId, 10);
  
  const featuredVideo = videos[0];
  const listVideos = videos.slice(1);

  return (
    <div className="flex flex-col gap-10">
      
      <div className="max-w-3xl border-l-4 border-primary pl-6 py-2 my-2">
        <p className="text-lg text-foreground/80 font-medium leading-relaxed">
          {highlightConfig.description}
        </p>
      </div>

      {featuredVideo && (
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-foreground/5 shadow-2xl border border-sub/10">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${featuredVideo.id}?rel=0`}
            title={featuredVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="flex flex-col mt-4">
        {listVideos.map((video, index) => {
          const displayNum = String(index + 1).padStart(2, '0');

          return (
            <div key={video.id} className="flex flex-col md:flex-row items-start md:items-center py-8 border-b border-foreground/10 gap-6 md:gap-12 hover:bg-foreground/[0.01] px-4 rounded-xl transition-colors group">
              <span className="text-xl md:text-2xl font-black tracking-tighter w-8 text-foreground/40 group-hover:text-foreground transition-colors">
                {displayNum}
              </span>
              
              <div className="relative w-full md:w-44 aspect-video shrink-0 bg-foreground/10 rounded-xl overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-bold rounded shadow">
                  {video.duration}
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-grow max-w-xl">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                  {video.channelName || "Featured Highlight"}
                </div>
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight leading-snug group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <div className="text-xs font-semibold text-foreground/50">
                  Published on {video.date}
                </div>
              </div>

              <Link 
                href={`https://youtube.com/watch?v=${video.id}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 font-black uppercase text-xs tracking-widest bg-foreground/5 hover:bg-primary hover:text-white px-5 py-3 rounded-lg transition-all ml-auto w-full md:w-auto justify-center mt-4 md:mt-0 shadow-sm"
              >
                WATCH VIDEO &rarr;
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}