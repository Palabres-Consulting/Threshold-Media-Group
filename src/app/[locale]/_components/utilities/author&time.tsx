import React from "react";

const AuthorTime: React.FC<{
  bg: boolean;
  back: boolean;
  readTime: string;
  date: string;
  author: string;
}> = ({ bg, back, readTime, date, author }) => {
  return (
    <div className="flex gap-2 items-center text-sm ">
      <div className={` rounded-md py-1 flex gap-2 items-center`}>
        <div className="h-[30px] w-[30px] rounded-full bg-foreground/5">
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
        <h4 className="">{author}</h4>
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
