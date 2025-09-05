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
        <h1 className="lg:text-[3.5rem] text-[2rem] font-bold">{title}</h1>
      </div>
      <div className="">{children}</div>
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
        <div className="flex flex-col gap-5">
          <h6 className="">{title}</h6>
          <p className="">{value}</p>
        </div>
        {editButton && (
          <div className="">
            <button className="btn-var1" type="button">
              {editButton ? "Change" : "Cancel"}
            </button>
          </div>
        )}
      </div>
      <div className="">
        {editActive && (
          <div className="py-4">
            <form className="">
              <input type="text" className="input" />
              <button className="mt-3 btn-var1">Submit</button>
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
    <div className="">
      <div className=""></div>
      <div className="border-sub-top">
        {navLinks.map(({ href, id, title }) => {
          return (
            <Link
              key={id}
              href={href}
              className="text-center py-2 w-full border-sub-bottom hover:bg-foreground/5"
            >
              {title}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
