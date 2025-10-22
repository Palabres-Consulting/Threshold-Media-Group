"use client";

import cloudinaryLoader from "@/app/lib/cloudinary";
import Image from "next/image";
import React from "react";
import Logo, { LogoImage } from "./logo";
import Link from "next/link";

import { SiFacebook, SiLinphone } from "react-icons/si";
import {
  FaFacebook,
  FaMailBulk,
  FaMailchimp,
  FaPhone,
  FaPhoneAlt,
} from "react-icons/fa";
import { useLocalization } from "../../context/localizationContext";

const MainFooter = () => {
  const { dict } = useLocalization();

  const links = [
    { id: 0, name: dict.footer.about, href: "/about" },
    { id: 1, name: dict.footer.pricing, href: "/pricing" },
    { id: 2, name: dict.footer.contact, href: "/contact" },
    { id: 3, name: dict.footer.asint, href: "/asint" },
    { id: 4, name: dict.footer.extraction, href: "/extraction" },
    { id: 5, name: dict.footer.login, href: "/auth/login" },
  ];

  return (
    <section className=" overflow-hidden lg:px-16 px-5   bg-foreground/5  ">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:py-16 py-10">
        <div className="flex flex-col pr-10 gap-4">
          <Logo />
          <p className="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
            assumenda ipsam modi.
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
        <div className="">
          <h3 className="font-semibold text-lg mb-4">
            {dict.footer.contactInfo}
          </h3>
          <p className="">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Necessitatibus, exercitationem!
          </p>
          <div className="flex flex-col mt-4 gap-4">
            <div className="flex gap-2 items-center">
              <FaPhoneAlt /> {dict.footer.phone}
            </div>
            <div className="flex gap-2 items-center">
              <FaMailBulk /> {dict.footer.email}
            </div>
          </div>
        </div>
      </div>
      <div className="py-6 flex flex-col lg:flex-row-reverse lg: justify-between items-center gap-5 border-sub-top text-sm">
        <strong className="">{dict.footer.terms}</strong>
        <strong className="">{dict.footer.rights}</strong>
      </div>
    </section>
  );
};

export default MainFooter;
