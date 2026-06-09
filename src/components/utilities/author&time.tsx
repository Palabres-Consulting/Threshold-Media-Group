import React from "react";

const AuthorTime: React.FC<{
  bg: boolean;
  back: boolean;
  readTime: string;
  date: string;
  category: string;
}> = ({ bg, back, readTime, date, category }) => {
  return (
    <div className="flex gap-2 items-center text-sm ">
      <div className={` rounded-md py-1 flex gap-2 items-center`}>
        <div
        className={`${
          bg ? "bg-accent-main text-white px-2" : "text-accent-main" 
        }  rounded-md  py-1 text-xs font-light text-nowrap`}
      >
        {category.replace("&amp;", "&").replace("&quot;", '"').slice(0, 20)}
      </div>
        {/* <h4 className="">{author ? author : "Anonymous Source"}</h4> */}
        <h4></h4>
      </div>
      <div
        className={`${
          back ? "bg-white" : "bg-black"
        } rounded-full border-sub h-[6px] w-[6px]`}
      ></div>
      <div className={`${back && "text-white opacity-"}`}>{date}</div>
    </div>
  );
};

export default AuthorTime;
