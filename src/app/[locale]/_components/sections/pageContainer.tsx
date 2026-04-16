"use client";

import { socialLinks } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const PageContainer: React.FC<{
  id: string;
  title: string;
  path: string;
  children: ReactNode;
}> = ({ id, title, path, children }) => {
  const pathname = usePathname().slice(4, usePathname().length);

  console.log("Pathname:", pathname);

  console.log("Display Pathname:", pathname.at(0)?.toUpperCase() + pathname.slice(1))

  const displayPathname = (pathname.at(0)?.toUpperCase() + pathname.slice(1)).slice(0, 30) + "...";

  const socialMediaLinks = [
    { href: socialLinks.facebook, icon: FaFacebook },
    { href: socialLinks.instagram, icon: FaInstagram },
    { href: socialLinks.linkedin, icon: FaLinkedin },
    { href: socialLinks.youtube, icon: FaYoutube },
  ];

  return (
    <section className="lg:mx-10">
      <div className="py-5 bg-foreground/5 border-sub-side px-6 border-sub-bottom flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm opacity-50">
          <span className="">Home</span> <span className="">/</span>
          {displayPathname }
        </div>
        <div className="">
          <ul className="flex gap-6">
            {socialMediaLinks.map(({ href, icon: Icon }, index) => (
              <li key={index} className="flex">
                <Link
                  href={href}
                  target="_blank"
                  className="rounded-full p-3 text-[1.5rem] border-sub text-accent-main"
                >
                  <Icon />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-sub-side">{children}</div>
    </section>
  );
};

export default PageContainer;
