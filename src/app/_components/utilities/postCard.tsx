import React from "react";
import CategoryTime from "./category&time";

const PostCard: React.FC<{
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  imageHeight?: string;
}> = ({ title, excerpt, readTime, category, imageHeight }) => {
  return (
    <div className="h-full   flex flex-col gap-4 justify-between">
      <div
        className={`rounded-2xl ${imageHeight}  bg-foreground/10 border-sub overflow-hidden`}
      >
        {/* <Image
          loader={cloudinaryLoader}
          src={"v1755525333/hero_image_uxpn9r.png"}
          alt={`Partner: ${name}`}
          width={1000}
          height={1000}
          className="object-cover w-full h-full"
          // unoptimized
        /> */}
      </div>

      <div className="">
        <CategoryTime
          back={false}
          bg={true}
          category="Smartphones"
          readTime="10 mins read"
        />

        <div className="flex flex-col gap-2 mt-2">
          <h2 className="text-[1.2rem] font-semibold">{title}</h2>
          <p className="text-[0.9rem] opacity-50">{excerpt}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
