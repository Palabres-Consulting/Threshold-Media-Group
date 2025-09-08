import React from "react";
import { customPosts } from "./featuredPosts";
import ListCard from "../utilities/ListCard";

const PopularPosts = () => {
  const posts = [
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
    {
      id: 3,
      title:
        "lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempor",
      date: "03 Sep 2025",
      author: "Darlene",
      authorImage: "",
    },
    {
      id: 4,
      title:
        "lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempor",
      date: "03 Sep 2025",
      author: "Darlene",
      authorImage: "",
    },
    {
      id: 5,
      title:
        "lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempor",
      date: "03 Sep 2025",
      author: "Darlene",
      authorImage: "",
    },
  ];

  return (
    <div>
      <h2 className="text-[1.3rem]  lg:text-[1.5rem] font-bold mb-4">
        Most Popular
      </h2>
      <div className="">
        {posts.map(({ id }) => {
          return <ListCard key={id} index={id} />;
        })}
      </div>
    </div>
  );
};

export default PopularPosts;
