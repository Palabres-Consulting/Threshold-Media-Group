"use client";

import React from "react";
import Logo from "./logo";
import Link from "next/link";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { TranslationSchema } from "@/app/lib/locale";
import { socialLinks } from "@/lib/utils";

const Footer = ({site, dict}: {site: string, dict: TranslationSchema["main"]}) => {
  



  const links = [
    { id: 0, name: dict.footer.about, href: "/about" },
    { id: 1, name: dict.footer.pricing, href: "/pricing" },
    { id: 2, name: dict.footer.contact, href: "/contact" },
    { id: 3, name: dict.footer.asint, href: "/asint" },
    { id: 4, name: dict.footer.extraction, href: "/extraction" },
    { id: 5, name: dict.footer.login, href: "/auth/login" },
  ];

  const socialMediaLinks = [
    { href: socialLinks.facebook, icon: FaFacebook },
    { href: socialLinks.instagram, icon: FaInstagram },
    { href: socialLinks.linkedin, icon: FaLinkedin },
  ];

  return (
    <footer className=" overflow-hidden lg:px-16 px-5 z-[999]   bg-foreground/5  ">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:py-16 py-10">
        <div className="flex flex-col pr-10 gap-4">
          <Logo />
          <p className="">
            {dict.footer.description}
          </p>
          <div className="flex gap-3 items-center">
            {/* {the other two logos} */}
          </div>
        </div>
        <div className="">
          <h3 className="font-semibold text-lg mb-4">{dict.footer.siteMap}</h3>
          <ul className="flex flex-col gap-2">
            {links.map(({ id, name, href }) => {
              return (
                <li key={id} className="">
                  <Link href={href} className="hover:opacity-70 text-">
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="">
          <h3 className="font-semibold text-lg mb-4">
            {dict.footer.socialMedia}
          </h3>
          <ul className="flex gap-6">
            {socialMediaLinks.map(({ href, icon: Icon }, index) => (
              <li key={index} className="flex">
                <Link
                  href={href}
                  target="_blank"
                  className="rounded-full p-3 text-[1.5rem] border-sub"
                >
                  <Icon />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="">
          <h3 className="font-semibold text-lg mb-4">
            {dict.footer.contactInfo}
          </h3>
          <p className="">
            {dict.footer.contactDescription}
          </p>
          <div className="flex flex-col mt-4 gap-4">
            <div className="flex gap-2 items-center">
              {/* <FaPhoneAlt /> {dict.footer.phone} */}
            </div>
            <div className="flex gap-2 items-center">
              {/* <FaMailBulk /> {dict.footer.email} */}
            </div>
          </div>
        </div>
      </div>
      <div className="py-6 flex flex-col lg:flex-row-reverse lg: justify-between items-center gap-5 border-sub-top text-sm">
        {/* <strong className="">{dict.footer.terms}</strong> */}
        <strong className="">{dict.footer.rights}</strong>
      </div>
    </footer >
  );
};

export default Footer;
