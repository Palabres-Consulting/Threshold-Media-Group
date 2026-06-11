// components/utilities/ListCard.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import CategoryTime from "./category&time";
import cloudinaryLoader from "@/app/helpers/cloudinary";
import { NormalizedPost } from "@/app/types/apiResponse";

interface ListCardProps {
  post: NormalizedPost;
  rank?: number | null; // e.g., 1, 2, 3... for popular list
}

const ListCard: React.FC<ListCardProps> = ({ post, rank }) => {
  return (
    <Link 
      href={post.postUrl}
      className="flex items-center gap-2 pt-4 pb-4 border-b  last:border-0 group cursor-pointer block"
    >
      {/* Left: Image & Rank Overlay */}
      <div className="w-[40%] relative h-[7.5em] rounded-2xl overflow-hidden bg-foreground/10 flex-shrink-0">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 30vw, 15vw"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-foreground/5" />
        )}

        {/* Big Rank Number Overlay (Only if rank is provided) */}
        {rank !== undefined && rank !== null && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none">
            <strong className="text-[2.2rem] font-black absolute bottom-[-8px] text-white left-2 drop-shadow-md select-none">
              {rank < 10 ? `0${rank}` : rank}
            </strong>
          </div>
        )}
      </div>

      {/* Right: Metadata & Title */}
      <div className="w-[60%] flex flex-col justify-center pl-1">
        <div className="flex flex-col gap-1.5">
          <CategoryTime
            category={post.topCategory || "General"}
            readTime={post.readTimeLabel || "3 mins read"}
            back={false}
            bg={true}
          />
          <h2 className="font-semibold text-[0.95rem] leading-snug text-foreground group-hover:text-foreground/80 line-clamp-2 transition-colors">
            {post.title}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default ListCard;