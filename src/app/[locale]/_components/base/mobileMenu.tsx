"use client";

import { useState } from "react";
import Link from "next/link";
import { GoTriangleDown } from "react-icons/go";
import Logo from "./logo";
import Categories from "./Categories";
import LangSwitcher from "../ui/LangSwitcher";
import { NavLinks } from "@/app/types/types";
import { Site } from "../../context/localizationContext";
import { TranslationSchema } from "@/app/lib/locale";

interface MobileMenuProps {
  site: Site;
  t: TranslationSchema;
  dict: any;
  path: string;
  mainNav: NavLinks[];
  links: {
    extractionLink: string;
    asintLink: string;
    mainLink: string;
  };
}

export default function MobileMenu({ site, t, dict, path, mainNav, links }: MobileMenuProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [hoverId, setHoverId] = useState<number | null>(null);
  const [subMenuClick, setSubMenuClick] = useState(false);

  return (
    <div>
      <div className="relative flex items-center justify-center py-4">
        <div className="absolute left-4 top-1/2 -translate-y-1/2"></div>
        <Logo site={site} />
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl"
        >
          ☰
        </button>
      </div>
      
      {navOpen && (
        <div className="absolute gap-7 top-18 right-5 md:w-[80%] w-[60%] border-sub overflow-y-scroll h-[100vh] p-8 rounded-md bg-background z-70">
          <ul className="grid gap-7">
            {mainNav.map(({ href, id, subMenu, title }) => (
              <li key={id} className="relative w-fit h-fit">
                <div className="flex items-center justify-between">
                  <Link
                    href={href}
                    className={`${hoverId === id && subMenu ? "text-accent-main" : ""} hover:text-accent-main w-fit gap-2 ${path === href ? "text-accent-main font-bold" : ""}`}
                  >
                    <span>{title}</span>
                  </Link>
                  {subMenu && (
                    <button
                      onClick={() => {
                        setHoverId(id);
                        setSubMenuClick(!subMenuClick);
                      }}
                      type="button"
                    >
                      <GoTriangleDown />
                    </button>
                  )}
                </div>

                {subMenu && hoverId === id && subMenuClick && (
                  <div className="top-2 pl-3 mt-3">
                    <ul className="grid gap-2">
                      {subMenu.map((item) => (
                        <li key={item.id}>
                          <Link href={item.href}>{item.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
            
            <Categories
              extractionLink={links.extractionLink}
              asintLink={links.asintLink}
              mainDomainLink={links.mainLink}
              dict={t}
            />
          </ul>

          <div className="mt-4 w-[30%]">
            <LangSwitcher dict={dict} />
          </div>
        </div>
      )}
    </div>
  );
}