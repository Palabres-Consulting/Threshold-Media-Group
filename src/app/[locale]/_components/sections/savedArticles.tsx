import React from "react";
import CategoryTime from "../utilities/category&time";
import { FaBookmark } from "react-icons/fa";
import { customPosts } from "./featuredPosts";

const SavedArticles = () => {
  const articles = [];

  return (
    <section className="flex flex-col gap-5" id="savedArticles">
      {customPosts.map(({ id, title }) => {
        return (
          <div
            key={id}
            className={`${
              id !== customPosts.length - 1 ? "border-sub-bottom pb-6" : ""
            }  flex gap-5 lg:flex-row flex-col`}
          >
            <div
              key={id}
              className="lg:w-[20%] relative  h-[10em]  lg:h-[7.5em] rounded-2xl overflow-hidden bg-foreground/10"
            >
              {/* <Image
              loader={cloudinaryLoader}
              src={"v1755525333/hero_image_uxpn9r.png"}
              alt={`Partner: ${name}`}
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
              // unoptimized
            /> */}
            </div>
            <div className="lg:w-[80%]  h-full flex lg:gap-5 gap-2 justify-between">
              <div className="p-2 flex flex-col gap-2">
                <CategoryTime
                  category="Smartphones"
                  readTime="10 mins read"
                  back={false}
                  bg={true}
                />
                <h2 className="font-semibold text-[1.3rem]">{title}</h2>
              </div>
              <div className="rounded-full bg-accent-main text-white p-2 text-[1rem] w-fit h-fit">
                <FaBookmark className="" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default SavedArticles;
