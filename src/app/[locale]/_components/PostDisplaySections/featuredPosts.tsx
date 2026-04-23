import React from "react";
import ListCard from "../utilities/ListCard";

export const customPosts = [
  {
    id: 0,
    title:
      "lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempor",
    date: "03 Sep 2025",
    author: "Darlene",
    authorImage: "",
  },
  {
    id: 1,
    title:
      "lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempor",
    date: "03 Sep 2025",
    author: "Darlene",
    authorImage: "",
  },
  {
    id: 2,
    title:
      "lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempor",
    date: "03 Sep 2025",
    author: "Darlene",
    authorImage: "",
  },
];

const FeaturedPosts = () => {
  return (
    <div>
      <h2 className="text-[1.3rem]  lg:text-[1.5rem] font-bold mb-4">
        Featured
      </h2>
      <div className="">
        {customPosts.map(({ id }) => {
          return <ListCard key={id} index={null} />;
        })}
      </div>
    </div>
  );
};

export default FeaturedPosts;
