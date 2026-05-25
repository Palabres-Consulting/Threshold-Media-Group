// components/PostDisplaySections/featuredPosts.tsx
import React from "react";
import ListCard from "../utilities/ListCard";
import { NormalizedPost } from "@/app/types/apiResponse";

interface FeaturedPostsProps {
  posts: NormalizedPost[];
  lang: string;
}

const FeaturedPosts = ({ posts }: FeaturedPostsProps) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="flex flex-col mb-4">
      <h2 className="text-[1.3rem] lg:text-[1.5rem] font-bold mb-2">
        Recent
      </h2>
      <div className="flex flex-col">
        {posts.map((post) => (
          <ListCard key={post.id} post={post} rank={null} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;