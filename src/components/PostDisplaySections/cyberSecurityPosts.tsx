import React from "react";
import AuthorTime from "../utilities/author&time";
import Link from "next/link";
import { formatAuthorDate } from "@/app/helpers/textHelpers";
import { NormalizedPost } from "@/app/types/apiResponse"; // <-- New Clean Type
import SaveArticleButton from "../utilities/saveArticleButton";

const CyberSecurityPosts = ({
  posts,
}: {
  posts: NormalizedPost[];
}) => {
  return (
    <section className="bg-accent-main/5 flex flex-col lg:flex-row gap-8 w-full items-center lg:p-5 lg:my-0 my-14">
      {posts.map((post) => {
        return (
          <Link key={post.id} href={post.postUrl} className="w-full relative group">
            {/* --- SAVE BUTTON ADDED HERE --- */}
            <SaveArticleButton
              postId={post.id}
              url={post.postUrl}
              title={post.title}
              excerpt={post.excerpt} // Already stripped of HTML!
            />

            <div className="flex flex-col gap-3 lg:h-[35vh] justify-center px-3 py-10 lg:p-0">
              <AuthorTime
                back={false}
                bg={false}
                readTime={post.readTimeLabel} // Dynamically calculated instead of hardcoded!
                date={formatAuthorDate(post.date)}
                category={post.topCategory}
              />
              <h2 className="text-[1.2rem] font-semibold">{post.title}</h2>
            </div>
          </Link>
        );
      })}
    </section>
  );
};

export default CyberSecurityPosts;