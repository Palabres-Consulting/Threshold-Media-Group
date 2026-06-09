import React from "react";
import EditorialImageCard from "./editorialImageCard";
import { truncateText } from "@/app/helpers/textHelpers";
import { NormalizedPost } from "@/app/types/apiResponse";

interface GridPostsProps {
  site: string;
  gridPosts: NormalizedPost[];
}

const GridPosts = ({ site, gridPosts }: GridPostsProps) => {
  if (gridPosts.length < 4) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-10 p-3">
      {gridPosts.map((post, index) => (
        <EditorialImageCard
          key={index}
          title={post.title}
          image={post.imageUrl}
          excerpt={truncateText(post.excerpt, 18)}
          author={post.authorName}
          id={post.id}
          postUrl={post.postUrl}
          slug={post.slug}
          site={site}
          category={post.topCategory || "Uncategorized"}
        />
      ))}
    </div>
  );
};

export default GridPosts;
