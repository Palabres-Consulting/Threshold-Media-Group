import React from "react";

const CategoryTime: React.FC<{
  bg: boolean;
  back: boolean;
  category: string;
  readTime: string;
}> = ({ bg, back, category, readTime }) => {
  return (
    <div className="flex gap-2 items-center text-sm ">
      <div
        className={`${
          bg ? "bg-accent-main text-white px-2" : "text-accent-main"
        }  rounded-md  py-1 text-xs font-light`}
      >
        Smartphone
      </div>
      <div
        className={`${
          back ? "bg-white" : "bg-black"
        } rounded-full border-sub h-[6px] w-[6px]`}
      ></div>
      <div className={`${back && "text-white"} text-xs font-light`}>
        10 min read
      </div>
    </div>
  );
};

export default CategoryTime;
