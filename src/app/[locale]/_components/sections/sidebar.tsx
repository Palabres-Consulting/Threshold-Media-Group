import React from "react";
import FeaturedPosts from "./featuredPosts";
import PopularPosts from "./popularPosts";
import Subscribe from "../forms/subscribe";

const Sidebar = () => {
  const focuses = [
    "US Stocks",
    "The Fed",
    "Trump's Second Terms",
    "Trump's Second Tariifs",
    "Apple",
    "Microsoft",
  ];

  return (
    <section className="w-full flex flex-col">
      <div className="lg:p-6 p-3">
        <h2 className="text-[1.3rem]  lg:text-[1.5rem] font-bold ">In Focus</h2>
        <div className="flex flex-col">
          <div className="">
            <ul className="flex gap-2 mt-5">
              {focuses.splice(0, 3).map((item, index) => (
                <li
                  key={index}
                  className="rounded-md w-fit px-3 py-1 border-sub text-xs flex text-nowrap"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            <ul className="flex gap-2 mt-3">
              {focuses.map((item, index) => (
                <li
                  key={index}
                  className="rounded-md w-fit px-3 py-1 border-sub text-xs flex text-nowrap"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="p-6">
        <FeaturedPosts />
        <div className="h-[55vh] py-6 border-sub-top">
          <div className="rounded-2xl h-full relative flex flex-col justify-center items-center overflow-hidden">
            <div className="z-50 px-6">
              <h3 className="text-[1.2rem] text-center font-semibold text-white mb-4">
                Stay ahead in tech: Subscribe for executive insights
              </h3>
              <Subscribe />
            </div>
            <div className="bg-black opacity-25 absolute h-full w-full"></div>
          </div>
        </div>
        <PopularPosts />
      </div>
    </section>
  );
};

export default Sidebar;
