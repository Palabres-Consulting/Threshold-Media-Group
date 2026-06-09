import React from "react";
import SaveArticleButton from "../utilities/saveArticleButton";
import { truncateText } from "@/app/helpers/textHelpers";
import Link from "next/link";
import CategoryTime from "../utilities/category&time";
import { NormalizedPost } from "@/app/types/apiResponse";
import ShareArticleButton from "../utilities/shareArticleButton";

const OpinionFeedGrid = ({
  opinionFeed,
}: {
  opinionFeed: NormalizedPost[];
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-0 w-full items-stretch border-t border-sub">
      {opinionFeed.map((post, idx) => {
        // Dynamically apply structural dividing grid borders matching your UI layout
        const styleMap = [
          "px-6 py-6 lg:border-0 border-b border-sub flex-1",
          "px-6 py-6 lg:border-x border-b border-sub flex-1 bg-foreground/[0.01]",
          "px-6 py-6 border-b lg:border-b-0 border-sub flex-1",
        ];
        const columnStyle = styleMap[idx] || "px-6 py-6 flex-1";

        return (
          <div
            className={`relative flex flex-col gap-3 justify-between ${columnStyle}`}
            key={post.id}
          >
            <div className="absolute top-4 right-4 z-10 flex items-center">
              <ShareArticleButton
                url={post.postUrl}
                title={post.title}
                customRightStyle=""
              />

              <SaveArticleButton
                postId={post.id}
                url={post.postUrl}
                title={post.title}
                excerpt={truncateText(post.excerpt, 12)}
              />
            </div>

            <div className="flex flex-col gap-2 pr-12">
              {/* <AuthorTime
                            back={false}
                            bg={false}
                            readTime={post.readTimeLabel}
                            date={formatAuthorDate(post.date)}
                            category={post.topCategory}
                          /> */}
              <Link
                href={post.postUrl}
                className="hover:text-accent-main transition-colors"
              >
                <h2 className="text-[1.15rem] font-semibold leading-snug">
                  {truncateText(post.title, 12)}
                </h2>
              </Link>
            </div>

            <div className="pt-2">
              <CategoryTime
                back={false}
                bg={false}
                category={post.topCategory}
                readTime={post.readTimeLabel}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OpinionFeedGrid;
