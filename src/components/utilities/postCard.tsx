import React from "react";
import Image from "next/image";
import cloudinaryLoader from "@/app/helpers/cloudinary";
import CategoryTime from "./category&time";
import SaveArticleButton from "./saveArticleButton";
import ShareArticleButton from "./shareArticleButton";
import { truncateText } from "@/app/helpers/textHelpers";
import TriSaveShareCategory from "./triSaveShareCategory";
import Link from "next/link";

const PostCard: React.FC<{
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  imageHeight?: string;
  imageSrc?: string;
  imageAlt?: string;
  postId: number;
  postUrl: string;
  site: string;
  slug: string;
}> = ({
  title,
  excerpt,
  readTime,
  category,
  imageHeight,
  imageSrc,
  imageAlt,
  postId,
  postUrl,
  site,
  slug,
}) => {
  return (
    <div className="h-full   flex flex-col gap-4 justify-between">
      <div
        className={`${imageHeight}  bg-foreground/10 border-sub overflow-hidden relative`}
      >
        {imageSrc ? (
          <Link href={postUrl} className="block w-full h-full">
            <Image
              src={imageSrc}
              alt={imageAlt || title}
              fill
              className="object-cover w-full h-full"
            />
          </Link>
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
          <Link href={postUrl} className="block w-full h-full">
            <h2 className="text-base sm:text-base font-bold leading-snug">
              {title.split(" ").slice(0, 10).join(" ")}...
            </h2>
          </Link>
          <p className="text-sm ">{excerpt.slice(0, 100)}...</p>
        </div>
        <TriSaveShareCategory
          category={category}
          slug={slug}
          id={postId}
          site={site}
          title={title}
          postUrl={postUrl}
          excerpt={excerpt}
        />
      </div>
    </div>
  );
};

export default PostCard;
