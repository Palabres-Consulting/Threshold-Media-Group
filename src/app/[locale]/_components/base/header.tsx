"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { GoTriangleDown } from "react-icons/go";

import Logo, { useHomeLink } from "./logo";
import { NavLinks } from "@/app/types/types";
import { Site } from "../../context/localizationContext";
import { TranslationSchema } from "@/app/lib/locale";

import LangSwitcher from "../ui/LangSwitcher";
import Categories from "./Categories";
import MobileMenu from "./mobileMenu";
import DesktopActions from "./DesktopActions";

const Header: React.FC<{ site: Site; t: TranslationSchema }> = ({ site, t }) => {
  const pathName = usePathname();
  const [hoverId, setHoverId] = useState<number | null>(null);
  
  const { asintLink, extractionLink, mainLink } = useHomeLink(site);
  const path = pathName.slice(3, pathName.length);
  const { main: dict } = t;

  const thresholdMainNav: NavLinks[] = [
    { id: 0, title: dict.nav.home, href: mainLink, subMenu: null },
    { id: 1, title: dict.nav.aboutUs, href: "/about", subMenu: null },
    { id: 2, title: dict.nav.ourTechnology, href: "/technology", subMenu: null },
    { id: 3, title: dict.nav.contact, href: "/contact", subMenu: null },
    { id: 4, title: dict.nav.pricing, href: "/pricing", subMenu: null },
  ];

  const ourMediaLinks = {
    title: dict.nav.gi,
    href: "/#",
    subMenu: null,
  };

  return (
    <header className="flex justify-center items-center lg:px-10 shadow-xs shadow-foreground/5 px-3 sticky top-0 backdrop-blur-sm bg-transparent z-[1000]">
      
      {/* DESKTOP NAV */}
      <nav className="lg:flex flex-col gap-7 justify-between hidden w-full py-5 px-5 text-sm border-sub-side">
        <div className="flex justify-between">
          <Logo site={site} />

          <div className="flex justify-between gap-7 items-center">
            {thresholdMainNav.map(({ id, title, href, subMenu }) => (
              <div key={id} className="relative h-fit" onMouseEnter={() => setHoverId(id)}>
                <Link
                  href={href}
                  className={`${hoverId === id && subMenu ? "text-accent-main" : ""} hover:text-accent-main w-fit flex items-center justify-center gap-1 ${pathName === href ? "text-accent-main font-bold" : ""}`}
                >
                  {title} {subMenu && <GoTriangleDown />}
                </Link>

                {subMenu && hoverId === id && (
                  <div
                    onMouseLeave={() => setHoverId(null)}
                    className="absolute left-0 mt-2 bg-background shadow-lg rounded-md p-5 z-50 w-[10em]"
                  >
                    <ul>
                      {subMenu.map((item) => (
                        <li key={item.id} className="py-3 flex">
                          <Link href={item.href} className="hover:text-accent-main text-nowrap">
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            
            {/* INJECTED DESKTOP ACTIONS */}
            <DesktopActions dict={dict} />
          </div>
        </div>

        <div className="flex gap-5 items-center justify-between">
          <Categories
            mainDomainLink={mainLink}
            extractionLink={extractionLink}
            asintLink={asintLink}
            dict={t}
          />

          <div className="flex gap-3 items-center">
            <LangSwitcher dict={dict} />
            <div className="relative group">
              <div className="flex items-center gap-1 cursor-pointer hover:text-accent-main">
                {ourMediaLinks.title}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE NAV INJECTED */}
      <div className="lg:hidden w-full">
        <MobileMenu 
          site={site} 
          t={t} 
          dict={dict} 
          path={path} 
          mainNav={thresholdMainNav} 
          links={{ extractionLink, asintLink, mainLink }} 
        />
      </div>
    </header>
  );
};

export default Header;