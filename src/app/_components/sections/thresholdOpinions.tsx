import React from "react";
import AuthorPost from "../utilities/authorPost";
import CategoryTime from "../utilities/category&time";
import CyberSecurityPosts from "./cyberSecurityPosts";
import AuthorTime from "../utilities/author&time";

const ThresholdOpinions = () => {
  const posts = [
    {
      id: 0,
      title:
        "lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempor",
      date: "03 Sep 2025",
      author: "Darlene",
      authorImage: "",
      customStyle: "px-3 lg:px-0",
    },
    {
      id: 1,
      title:
        "lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempor",
      date: "03 Sep 2025",
      author: "Darlene",
      authorImage: "",
      customStyle:
        "lg:border-l-[1px] lg:border-r-[1px] lg:border-t-[0px] lg:border-b-[0px] border-b-[1px] border-t-[1px] py-4 lg:py-0  border-foreground/10 hover:border-foreground/20 transition-all duration-300; lg:px-5 px-3",
    },
    {
      id: 2,
      title:
        "lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempor",
      date: "03 Sep 2025",
      author: "Darlene",
      authorImage: "",
      customStyle: "px-3 lg:px-0",
    },
  ];

  return (
    <section className="flex flex-col bg-accent-main/5 ">
      <div className="">
        <div className="flex flex-col lg:flex-row w-full  p-6 gap-6 justify-center items-center border-sub-right">
          <div className="rounded-2xl overflow-hidden h-[50vh] w-full lg:w-[50%] bg-foreground/10 border-sub">
            {/* <Image
            loader={cloudinaryLoader}
            src={"v1755525333/hero_image_uxpn9r.png"}
            alt={`post image`}
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
            // unoptimized
          /> */}
          </div>
          <div className="flex flex-col lg:w-[50%] gap-2 justify-between ">
            <CategoryTime
              back={false}
              bg={true}
              category="Smartphones"
              readTime="10 mins read"
            />
            <div className="">
              <h2 className="text-[1.3rem] font-semibold mb-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Temporibus{" "}
              </h2>

              <p className="opacity-50">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
                consectetur recusandae atque, rem delectus nostrum!
              </p>
            </div>

            <div className="">
              <AuthorPost
                author="Darlene"
                image=""
                title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id repellat"
                date="03 Sep 2025"
                readTime="10 min Read"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="  flex flex-col lg:flex-row gap-3 w-full items-center lg:p-5 border-sub-right">
        {posts.map(({ id, title, date, author, authorImage, customStyle }) => (
          <div
            className={`flex flex-col gap-3 h-[35vh] justify-center   ${customStyle}`}
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
      </div>
    </section>
  );
};

export default ThresholdOpinions;
