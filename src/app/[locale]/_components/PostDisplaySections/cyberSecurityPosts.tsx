import React from "react";
import AuthorTime from "../utilities/author&time";
import Link from "next/link";
import { getTitleValue } from "./hero";
import { formatAuthorDate } from "@/app/lib/textHelpers";
import { Post } from "@/app/types/apiResponse";
import SaveArticleButton from "../utilities/saveArticleButton"; // <-- Import added

const CyberSecurityPosts = ({ posts, site }: { posts: Post[], site: string }) => {
  return (
    <section className="bg-accent-main/5 flex flex-col lg:flex-row gap-8 w-full items-center lg:p-5 lg:my-0 my-14">
      {posts.map((post, index) => {
        const titleValue = getTitleValue(posts, index);
        const { id, slug, _embedded } = post;
        const postUrl = `/journal/${slug || ""}?type=${site}`;
        
        return (
          <Link key={id} href={postUrl} className="w-full relative group">
            {/* --- SAVE BUTTON ADDED HERE --- */}
            <SaveArticleButton 
              url={postUrl}
              title={titleValue}
              excerpt={post.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "")}
            />

            <div className="flex flex-col gap-3 lg:h-[35vh] justify-center px-3 py-10 lg:p-0">
              <AuthorTime
                back={false}
                bg={false}
                readTime="10 min Read"
                date={formatAuthorDate(post.date)}
                author={_embedded?.author?.[0]?.name || "Unknown Author"}
              />
              <h2 className="text-[1.2rem] font-semibold">{titleValue}</h2>
            </div>
          </Link>
        );
      })}
    </section>
  );
};

export default CyberSecurityPosts;