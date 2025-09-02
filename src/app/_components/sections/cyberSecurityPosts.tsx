import React from "react";
import AuthorTime from "../utilities/author&time";
import CategoryTime from "../utilities/category&time";

const CyberSecurityPosts = () => {
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
  ];

  return (
    <section className="bg-accent-main/5  flex flex-col lg:flex-row gap-8 w-full items-center lg:p-5 lg:my-0 my-14">
      {posts.map(({ id, title, date, author, authorImage }) => (
        <div
          className="flex flex-col gap-3 h-[35vh] justify-center p-3 lg:p-0 "
          key={id}
        >
          <AuthorTime
            back={false}
            bg={false}
            readTime="10 min Read"
            date={"03 Sep 2025"}
            author={author}
          />
          <h2 className="text-[1.2rem] font-semibold">{title}</h2>
          <CategoryTime
            back={false}
            bg={false}
            category="Smartphones"
            readTime="10 mins read"
          />
        </div>
      ))}
    </section>
  );
};

export default CyberSecurityPosts;
