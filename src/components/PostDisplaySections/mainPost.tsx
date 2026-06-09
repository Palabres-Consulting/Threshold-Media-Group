import { NormalizedPost } from "@/app/types/apiResponse";
import Link from "next/link";
import React from "react";
import SaveArticleButton from "../utilities/saveArticleButton";
import ShareArticleButton from "../utilities/shareArticleButton";
import Image from "next/image";
import cloudinaryLoader from "@/app/helpers/cloudinary";
import CategoryTime from "../utilities/category&time";

const MainPost = ({
  site,
  mainPost,
}: {
  site: string;
  mainPost: NormalizedPost;
}) => {
  return (
    <div className="w-full aspect-video  relative h-full  overflow-hidden  lg:h-full rounded-2xl">
      <Link
        href={`/journal/${mainPost.slug || ""}?id=${mainPost.id || ""}&type=${site}`}
      >
        {/* --- SAVE BUTTON ADDED HERE --- */}

        <div className="absolute flex items-center gap-2 right-4 top-4 z-20">
          <ShareArticleButton
            url={`/journal/${mainPost.slug || ""}?id=${mainPost.id || ""}&type=${site}`}
            title={mainPost.title}
            customRightStyle="" // 👈 Sits to the left of the Save Button
            overlay={true} // Applies white text for better visibility on hero image
          />
          <SaveArticleButton
            postId={mainPost.id}
            url={`/journal/${mainPost.slug || ""}?id=${mainPost.id || ""}&type=${site}`}
            title={mainPost.title}
            excerpt={mainPost.excerpt} // Stripping HTML tags for clean save
            overlay={true} // Makes the button white for better visibility on hero image
          />
        </div>

        <Image
          loader={cloudinaryLoader}
          src={mainPost.imageUrl || "/images/homepage/home4.png"}
          alt={`Extraction Image 1`}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-3 z-50">
          <CategoryTime
            category={mainPost.topCategory || "Uncategorized"}
            readTime={`${mainPost.readTimeLabel || "5 mins read"}`}
            back={true}
            bg={true}
          />
          <h1 className="lg:text-[1.7rem] text-[1.1rem] font-semibold lg:w-[85%] text-white">
            {mainPost.title.split(" ").slice(0, 10).join(" ")}...
          </h1>
        </div>
      </Link>
    </div>
  );
};

export default MainPost;
