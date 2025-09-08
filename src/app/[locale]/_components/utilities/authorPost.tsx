import React from "react";
import AuthorTime from "./author&time";

const AuthorPost: React.FC<{
  author: string;
  image: string;
  title: string;
  date: string;
  readTime: string;
}> = ({ author, image, title, date, readTime }) => {
  return (
    <div className="flex flex-col gap-2 rounded-2xl p-3 w-full border-sub">
      <AuthorTime
        author={author}
        back={false}
        bg={false}
        date={date}
        readTime={readTime}
      />

      <p className="">{title}</p>
    </div>
  );
};

export default AuthorPost;
