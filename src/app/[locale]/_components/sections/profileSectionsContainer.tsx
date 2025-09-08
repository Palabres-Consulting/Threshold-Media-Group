"use client";

import Link from "next/link";
import React, { useState } from "react";

const ProfileSectionsContainer: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <section className="rounded-2xl  p-5 bg-foreground/5">
      <div className="pb-6 border-sub-bottom">
        <h1 className=" lg:text-[1.7rem] text-[1.3rem] font-bold">{title}</h1>
      </div>
      <div className="flex flex-col gap-7 mt-8 relative">{children}</div>
    </section>
  );
};

export default ProfileSectionsContainer;

export const ProfileItem: React.FC<{
  editButton: boolean;
  title: string;
  value: string;
}> = ({ title, value, editButton }) => {
  const [editActive, setEditActive] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center">
        <div className={`flex flex-col ${editButton ? "gap-5" : "gap-2"} `}>
          <h6 className="">{title}</h6>
          <p className="">{value}</p>
        </div>
        {editButton && (
          <div className="">
            <button
              onClick={() => setEditActive(!editActive)}
              className="btn-var1 cursor-pointer"
              type="button"
            >
              {!editActive ? "Change" : "Cancel"}
            </button>
          </div>
        )}
      </div>
      <div className="">
        {editActive && (
          <div className="py-4 transition-all duration-300">
            <form className="">
              <input
                type="text"
                className="input"
                placeholder={`Input your new ${title}`}
              />
              <div className="lg:w-[20%]">
                <button className="mt-3 btn-var1 cursor-pointer">Submit</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProfileDetails = () => {
  const navLinks = [
    {
      id: 0,
      href: "",
      title: "Your Personal Information",
    },
    {
      id: 1,
      href: "your-subscription",
      title: "Your Subscription",
    },
    {
      id: 2,
      href: "need-help",
      title: "Need Help?",
    },
    {
      id: 3,
      href: "saved-articles",
      title: "Saved Articles",
    },
  ];

  return (
    <div className="w-full min-h-[100vh] relative">
      <div className="sticky top-30">
        <div className="py-5 flex flex-col gap-3 items-center justify-center">
          <div className="rounded-full h-15 w-15 bg-foreground/5">
            {/* Image */}
          </div>

          {/* Profile name */}
          <h3 className="font-semibold text-[1.5rem]">John Doe</h3>

          {/* User Status Tag */}
          <div className="rounded-lg p-3 border-sub text-xs">
            Non Subscriber
          </div>
        </div>
        <div className="border-sub-top grid w-full">
          {navLinks.map(({ href, id, title }) => {
            return (
              <Link
                key={id}
                href={href}
                className="text-center py-4 text-sm w-full border-sub-bottom hover:bg-foreground/5 hover:border-l-2 hover:border-l-accent-main"
              >
                {title}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
