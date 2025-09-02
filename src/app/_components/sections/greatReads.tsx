import React from "react";
import CategoryTime from "../utilities/category&time";

const GreatReads = () => {
  const posts = [
    {
      id: 0,
      title: "A guide to choosing smartphones with good camera",
      category: "Smartphone",
      readTime: "10 min read",
      image: "",
    },
    {
      id: 1,
      title: "A guide to choosing smartphones with good camera",
      category: "Smartphone",
      readTime: "10 min read",
      image: "",
    },
  ];

  return (
    <section className="lg:p-6 p-3 border-sub-right">
      <h2 className="text-[1.5rem] font-bold mb-8">Great Reads</h2>
      <div className="grid gap-6 lg:grid-cols-2 grid-cols-1">
        {posts.map(({ title, id, category, image, readTime }) => {
          return (
            <div
              key={id}
              className="rounded-2xl h-[60vh] flex items-end bg-foreground/5 relative overflow-hidden"
            >
              <div className="p-5 z-50">
                <CategoryTime
                  back={true}
                  bg={true}
                  category={category}
                  readTime={readTime}
                />
                <h2 className="font-semibold lg:text-[1.5rem] text-[1.1rem] mt-4 text-white">
                  {title}
                </h2>
              </div>
              <div className="absolute  lg:h-full  w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent"></div>
              <div className="h-full absolute w-full overflow-hidden ">
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
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default GreatReads;
