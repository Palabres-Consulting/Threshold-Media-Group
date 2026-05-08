import React from "react";

const Subscribe = () => {
  return (
    <form className="bg-white w-full p-2 rounded-md flex items-center gap-2 justify-between">
      <div className="w-[65%]">
        <input
          className="w-full outline-none border-none p-1"
          placeholder="Enter your email address"
        />
      </div>
      <button className="rounded-md py-2 px-2 bg-accent-main text-white text-sm">
        Subscribe
      </button>
    </form>
  );
};

export default Subscribe;
