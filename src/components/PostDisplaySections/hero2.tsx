"use client";

import React from "react";
import { NormalizedPost } from "@/app/types/apiResponse";
import MainPost from "./mainPost";
import { formatAuthorDate, truncateText } from "@/app/helpers/textHelpers";
import LandScapeCard from "../utilities/landScapeCard";
import TextOnlyCard from "./textOnlyCard";
import VerticalPostCard from "./verticalPostCard";

const HeroSection = ({
  site,
  posts,
}: {
  site: string;
  posts: NormalizedPost[];
}) => {


  if (posts.length < 6) {
    return null;
  }



  // Destructure content array nodes safely
  const firstPost = posts[0];
  const secondPost = posts[1];
  const thirdPost = posts[2];
  const fourthPost = posts[3];
  const fifthPost = posts[4];
  const sixthPost = posts[5];


  console.log("POST Url", firstPost?.postUrl);

  return (
    <section className="w-full  min-h-[400px]  flex flex-col lg:flex-row border-y border-[var(--foreground)]/10 p-3 gap-2 bg-[var(--background)]">
      {/* LEFT COLUMN: Large Main Highlight Item Feature */}
      <div className="w-full lg:w-[50%]  overflow-hidden relative">
        {firstPost && <MainPost site={site} mainPost={firstPost} />}
      </div>

      <div className="w-full lg:w-[50%] flex flex-col gap-2 h-full">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 ">

          <div className="gap-2 flex flex-col h-full">
            
            <TextOnlyCard
              title={secondPost?.title || "No Title Available"}
              category={secondPost?.topCategory || "General"}
              postUrl={secondPost?.postUrl || "#"}
              postId={secondPost?.id || 0}
              site={site}
              slug={secondPost?.slug || ""}
              excerpt={truncateText(secondPost?.excerpt || "", 18)}
            />
            <VerticalPostCard
              title={thirdPost?.title || "No Title Available"}
              category={thirdPost?.topCategory || "General"}
              image={thirdPost?.imageUrl || ""}
              readTime={thirdPost?.readTimeLabel || "N/A"}
              date={formatAuthorDate(thirdPost?.date || "")}
              postUrl={thirdPost?.postUrl || "#"}
              postId={thirdPost?.id || 0}
              site={site}
              slug={thirdPost?.slug || ""}
              excerpt={truncateText(thirdPost?.excerpt || "", 18)}
            />
          </div>
          <div className="gap-2 flex flex-col h-full">
             <VerticalPostCard
              title={fourthPost?.title || "No Title Available"}
              category={fourthPost?.topCategory || "General"}
              image={fourthPost?.imageUrl || ""}
              readTime={fourthPost?.readTimeLabel || "N/A"}
              date={formatAuthorDate(fourthPost?.date || "")}
              postUrl={fourthPost?.postUrl || "#"}
              postId={fourthPost?.id || 0}
              site={site}
              slug={fourthPost?.slug || ""}
              excerpt={truncateText(fourthPost?.excerpt || "", 18)}
            />
            <TextOnlyCard
              title={fifthPost?.title || "No Title Available"}
              category={fifthPost?.topCategory || "General"}
              postUrl={fifthPost?.postUrl || "#"}
              postId={fifthPost?.id || 0}
              site={site}
              slug={fifthPost?.slug || ""}
              excerpt={truncateText(fifthPost?.excerpt || "", 18)}
            />
           
          </div>

          {/* Card Module 2: Visual Upper-Image Stack Block */}
        </div>

        {/* Bottom Segment: Full Horizontal Landscape Item Card */}
        <div className="w-full shrink-0">
          <LandScapeCard
            title={sixthPost?.title || "Default Title"}
            category={sixthPost?.topCategory || "Uncategorized"}
            image={sixthPost?.imageUrl || "/placeholder.jpg"}
            readTime={sixthPost?.readTimeLabel || "N/A"}
            date={formatAuthorDate(sixthPost?.date || "N/A")}
            postUrl={sixthPost?.postUrl || "#"}
            postId={sixthPost?.id || 0}
            site={site}
            slug={sixthPost?.slug || ""}
            excerpt={truncateText(sixthPost?.excerpt || "", 18)}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
