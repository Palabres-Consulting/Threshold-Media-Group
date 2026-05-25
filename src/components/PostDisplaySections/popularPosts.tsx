// components/PostDisplaySections/popularPosts.tsx
import React from "react";
import ListCard from "../utilities/ListCard";
import { NormalizedPost } from "@/app/types/apiResponse";

interface PopularPostsProps {
  posts: NormalizedPost[];
  lang: string;
}

const PopularPosts = ({ posts }: PopularPostsProps) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="flex flex-col mt-2">
      <h2 className="text-[1.3rem] lg:text-[1.5rem] font-bold mb-2">
        
      </h2>
      <div className="flex flex-col">
        {posts.map((post, index) => (
          <ListCard 
            key={post.id} 
            post={post} 
            // rank={index + 1} 
          />
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;