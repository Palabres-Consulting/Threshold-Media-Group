import React from "react";
import AuthorTime from "./author&time";
import SaveArticleButton from "./saveArticleButton";
import ShareArticleButton from "./shareArticleButton";

const AuthorPost: React.FC<{
  category: string;
  image: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  postId: number;
  postUrl: string;
  site: string;
  slug: string;
}> = ({ category, image, title, date, readTime, excerpt, postId, postUrl, site, slug }) => {
  return (
    <div className="flex flex-col gap-2 rounded-2xl p-3 w-full border-sub">
      <AuthorTime
        category={category}
        back={false}
        bg={true}
        date={date}
        readTime={readTime}
      />

      <p className="text-xs sm:text-sm font-bold leading-snug">{title}</p>

      <div className="flex gap-2 flex-row justify-end mt-[-10px]">
        <ShareArticleButton
          url={`/journal/${slug || ""}?id=${postId || ""}&type=${site}`}
          title={title}
          customRightStyle="right-16 " // 👈 Sits to the left of the Save Button
        />
        <SaveArticleButton
          postId={postId}
          url={postUrl}
          title={title}
          excerpt={excerpt}
        />
      </div>
    </div>
  );
};

export default AuthorPost;
