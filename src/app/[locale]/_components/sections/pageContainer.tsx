"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { FaFacebook } from "react-icons/fa";

const PageContainer: React.FC<{
  id: string;
  title: string;
  path: string;
  children: ReactNode;
}> = ({ id, title, path, children }) => {
  const pathname = usePathname().slice(4, usePathname().length);

  console.log(pathname);

  return (
    <section className="lg:mx-16">
      <div className="py-5 bg-foreground/5 border-sub-side px-6 border-sub-bottom flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm opacity-50">
          <span className="">Home</span> <span className="">/</span>
          {pathname.at(0)?.toUpperCase() + pathname.slice(1)}
        </div>
        <div className="">
          <ul className="flex gap-6">
            <li className="flex">
              <Link
                href=""
                className="rounded-full p-3 text-[1.5rem] border-sub"
              >
                <FaFacebook />
              </Link>
            </li>
            <li className="flex">
              <Link
                href=""
                className="rounded-full p-3 text-[1.5rem] border-sub"
              >
                <FaFacebook />
              </Link>
            </li>
            <li className="flex">
              <Link
                href=""
                className="rounded-full p-3 text-[1.5rem] border-sub"
              >
                <FaFacebook />
              </Link>
            </li>
            <li className="flex">
              <Link
                href=""
                className="rounded-full p-3 text-[1.5rem] border-sub"
              >
                <FaFacebook />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-sub-side">{children}</div>
    </section>
  );
};

export default PageContainer;
