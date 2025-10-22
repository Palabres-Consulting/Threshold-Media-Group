import Link from "next/link";
import React from "react";
import PageContainer from "../../_components/sections/pageContainer";
import CategoryTime from "../../_components/utilities/category&time";

const JournalPage = () => {
  const categories = [
    {
      id: 0,
      title: "US Stocks",
      url: "",
    },
    {
      id: 1,
      title: "The Fed",
      url: "",
    },
    {
      id: 2,
      title: "Trump's Second Terms",
      url: "",
    },
    {
      id: 3,
      title: "Apple",
      url: "",
    },

    {
      id: 4,
      title: "Microsoft",
      url: "",
    },
  ];

  const demoPosts = ["1", "2", "3", "4", "5", "6", "7", "8"];

  return (
    <PageContainer id="journalsPage" path="" title="All Journals">
      <div className="flex flex-col items-center ">
        <h1 className="text-[3rem] font-bold mb-5">All Journals</h1>
        <p className="w-[50%] text-center">
          We work to create the most attractive & meaningful place for small
          businesses. our Team always ready to help you.
        </p>
      </div>

      <div className="flex justify-center">
        <ul className="flex gap-4 mt-3">
          {categories.map(({ id, title }) => (
            <li
              key={id}
              className="rounded-md w-fit px-3 py-1 border-sub text-sm flex text-nowrap"
            >
              {title}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid lg:grid-cols-4 gap-5 mb-5 md:grid-cols-2 grid-cols-1 lg:py-20 py-10 px-8">
        {demoPosts.map((index) => {
          return (
            <div key={index} className="flex flex-col gap-2 w-full">
              <div className="rounded-lg bg-foreground/10 h-[20em]"></div>
              <div className="">
                <CategoryTime
                  back={true}
                  category=""
                  bg={true}
                  readTime="10 min"
                />
              </div>
              <div className="">
                <h5 className="text-[1.2rem]    ">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit...
                </h5>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
};

export default JournalPage;
