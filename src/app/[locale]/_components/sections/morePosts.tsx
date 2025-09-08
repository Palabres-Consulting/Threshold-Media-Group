import React from "react";
import PostCard from "../utilities/postCard";
import AuthorPost from "../utilities/authorPost";
import Image from "next/image";
import cloudinaryLoader from "@/app/lib/cloudinary";
import CategoryTime from "../utilities/category&time";

const MorePosts = () => {
  return (
    <section className="flex flex-col border-sub-bottom" id="morePosts">
      <div className="flex flex-col lg:flex-row lg:h-[80vh]  border-sub-bottom">
        <div className="lg:w-[35%] w-full h-full px-4 py-6 ">
          <div className="lg:h-[70%]  w-full  ">
            <PostCard
              category="Smartphones"
              excerpt="Lorem ipsum dolor sit amet consectetur, adipisicing elit"
              title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id repellat"
              readTime="10 mins read"
              imageHeight="lg:h-[60%] h-[50vh]"
            />
          </div>
          <div className="h-[30%]  mt-5">
            <AuthorPost
              author="Darlene"
              image=""
              title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id repellat"
              date="03 Sep 2025"
              readTime="10 min Read"
            />
          </div>
        </div>

        <div className="lg:w-[65%]  w-full lg:h-full p-6 border-sub-side">
          <PostCard
            category="Smartphones"
            excerpt=""
            title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id repellat"
            readTime="10 mins read"
            imageHeight="lg:h-[80%] h-[50vh]"
          />
        </div>
      </div>

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
    </section>
  );
};

export default MorePosts;
