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

export const ProfileDetails: React.FC<{
  username: string;
  subscriber: boolean;
}> = ({ username, subscriber }) => {
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
          <h3 className="font-semibold text-[1.5rem]">{username}</h3>

          {/* User Status Tag */}
          <div className="rounded-lg p-3 border-sub text-xs">
            {subscriber ? "Subscriber" : "Free User"}
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
