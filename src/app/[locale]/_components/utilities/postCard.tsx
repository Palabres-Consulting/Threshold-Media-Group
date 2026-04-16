import React from "react";
import Image from "next/image";
import cloudinaryLoader from "@/app/lib/cloudinary";
import CategoryTime from "./category&time";

const PostCard: React.FC<{
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  imageHeight?: string;
  imageSrc?: string;
  imageAlt?: string;
}> = ({ title, excerpt, readTime, category, imageHeight, imageSrc, imageAlt }) => {
  return (
    <div className="h-full   flex flex-col gap-4 justify-between">
      <div
        className={`rounded-2xl ${imageHeight}  bg-foreground/10 border-sub overflow-hidden relative`}
      >
        {imageSrc ? (
          <Image
            loader={cloudinaryLoader}
            src={imageSrc}
            alt={imageAlt || title}
            fill
            className="object-cover w-full h-full"
          />
        ) : null}
      </div>

      <div className="">
        {/* <CategoryTime
          back={false}
          bg={true}
          category={category}
          readTime={readTime}
        /> */}

        <div className="flex flex-col gap-2 mt-2">
          <h2 className="text-[1.2rem] font-semibold">{title.split(" ").slice(0, 10).join(" ")}...</h2>
          <p className="text-[0.9rem] opacity-50">{excerpt}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
