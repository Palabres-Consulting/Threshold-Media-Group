"use client";

import Link from "next/link";
import Logo, { useHomeLink } from "./logo";
import { useState } from "react";
import { NavLinks } from "@/app/types/types";
import { usePathname } from "next/navigation";
import { GoTriangleDown } from "react-icons/go";
import { useLocalization } from "../../context/localizationContext";
import LangSwitcher from "../ui/LangSwitcher";
import { useUser } from "../../hook/useUser";
import Categories from "./Categories";
import { TranslationSchema } from "@/app/lib/locale";
import UserNav from "./userNav";

const Header: React.FC<{ site: string; t: TranslationSchema }> = ({
  site,
  t,
}) => {
  const pathName = usePathname();
  const [hoverId, setHoverId] = useState<number | null>(null);
  const { asintLink, extractionLink } = useHomeLink(site);

  // const site = useSubdomain();

  const { data, isLoading } = useUser();
  // console.log(data);

  const path = pathName.slice(3, pathName.length);

  // console.log(path);

  const { dict } = useLocalization(); // localization dictionary

  const thresholdMainNav: NavLinks[] = [
    {
      id: 0,
      title: dict.nav.aboutUs,
      href: "/about",
      subMenu: [
        { id: 0, title: dict.nav.ourTeam, href: "/about#team" },
        { id: 1, title: dict.nav.services, href: "/about#services" },
        { id: 2, title: dict.nav.process, href: "/about#process" },
        { id: 3, title: dict.nav.pricing, href: "/pricing" },
      ],
    },
    {
      id: 1,
      title: dict.nav.ourTechnology,
      href: "/technology",
      subMenu: null,
    },
    {
      id: 2,
      title: dict.nav.contact,
      href: "/contact",
      subMenu: null,
    },
  ];

  const ourMediaLinks = {
    // id: 3,
    title: dict.nav.ourTeam,
    href: "/#",
    subMenu: [
      { id: 0, title: dict.nav.asint, href: "/about#team" },
      { id: 1, title: dict.nav.extraction, href: "/about#team" },
      { id: 2, title: dict.nav.gi, href: "/about#team" },
    ],
  };

  const navLinks: NavLinks[] = [
    {
      id: 0,
      title: dict.nav.aboutUs,
      href: "/about",
      subMenu: [
        { id: 0, title: dict.nav.ourTeam, href: "/about#team" },
        { id: 1, title: dict.nav.services, href: "/about#services" },
        { id: 2, title: dict.nav.process, href: "/about#process" },
      ],
    },
    {
      id: 1,
      title: dict.nav.pricing,
      href: "/pricing",
      subMenu: null,
    },
    {
      id: 2,
      title: dict.nav.contact,
      href: "/contact",
      subMenu: null,
    },
  ];

  const activeNavlink = site === "main" ? thresholdMainNav : navLinks;

  // console.log(site, activeNavlink);

  const MobileMenu = () => {
    const [navOpen, setNavOpen] = useState(false);
    const [hoverId, setHoverId] = useState<number | null>(null);
    const [subMenuClick, setSubMenuClick] = useState(false);

    return (
      <div className="">
        <div className="relative flex items-center justify-center py-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {/* Optional: placeholder to balance layout */}
          </div>

          <Logo site={site} />

          <button
            onClick={() => setNavOpen(!navOpen)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl"
          >
            ☰
          </button>
        </div>{" "}
        {navOpen ? (
          <div className="absolute gap-5  top-18 right-5 w-fit md:w-[80%] border-sub overflow-y-scroll h-[100vh]  p-8 rounded-md  bg-background z-70">
            <ul className="grid gap-7 ">
              {activeNavlink.map(({ href, id, subMenu, title }) => {
                return (
                  <li key={id} className="relative w-fit h-fit">
                    <div className="flex items-center justify-between">
                      <Link
                        href={href}
                        className={` ${
                          hoverId === id && subMenu ? "text-accent-main" : ""
                        }  hover:text-accent-main w-fit  gap-2 ${
                          path === href ? "text-accent-main font-bold" : ""
                        }`}
                      >
                        <span className="">{title}</span>
                      </Link>
                      {subMenu && (
                        <button
                          onClick={() => {
                            setHoverId(id);
                            setSubMenuClick(!subMenuClick);
                          }}
                          type="button"
                          className=""
                        >
                          <GoTriangleDown />
                        </button>
                      )}
                    </div>

                    {subMenu && hoverId == id && subMenuClick ? (
                      <div className="top-2 pl-3 mt-3">
                        <ul className="grid gap-2">
                          {subMenu.map(({ href, id, title }) => {
                            return (
                              <li key={id} className="">
                                <Link href={href}>{title}</Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}
                  </li>
                );
              })}
              <Categories
                extractionLink={extractionLink}
                asintLink={asintLink}
                dict={t}
              />
            </ul>

            <div className="mt-4 w-[30%]">
              <LangSwitcher dict={dict} />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const OtherNavItems = () => {
    const prodUrl = `${process.env.NEXT_PUBLIC_PROD_URL!}/auth`;
    const localUrl = `${process.env.NEXT_PUBLIC_LOCAL_BASE_URL!}/auth`;

    const authUrl = process.env.NODE_ENV === "production" ? prodUrl : localUrl;

    const [transDropdown, setTransDropdown] = useState(false);

    return (
      <div className="flex flex-col lg:flex-row lg:gap-5 lg:my-0 my-10 gap-10 lg:items-center">
        {/* <div className="flex lg:flex-row flex-col gap-4">
          <Link
            href={extractionLink}
            className="px-6 py-1 rounded-md border-sub"
          >
            Extraction
          </Link>
          <Link href={asintLink} className="px-6 py-1 rounded-md border-sub">
            ASINT
          </Link>
        </div> */}

        {/* <LangSwitcher dict={dict} /> */}
        {/* Inside Header */}
        <UserNav
          data={data}
          isLoading={isLoading}
          dict={dict}
          authUrl={authUrl}
        />
      </div>
    );
  };

  return (
    <header className="flex justify-center items-center  lg:px-10 shadow-xs shadow-foreground/5 px-3 sticky top-0 backdrop-blur-sm bg-transparent z-[1000]">
      <nav className="lg:flex flex-col gap-7 justify-between items- hidden w-full py-5  px-5 text-sm  border-sub-side">
        <div className="flex justify-between">
          <Logo site={site} />

          <div className="flex justify-between gap-7 items-center  ">
            {activeNavlink.map(({ id, title, href, subMenu }) => (
              <div
                key={id}
                className="relative  h-fit"
                onMouseEnter={() => setHoverId(id)}
              >
                <Link
                  href={href}
                  className={` ${
                    hoverId === id && subMenu ? "text-accent-main" : ""
                  }  hover:text-accent-main w-fit flex items-center justify-center gap-1 ${
                    pathName === href ? "text-accent-main font-bold" : ""
                  }`}
                >
                  {title} {subMenu && <GoTriangleDown className="" />}
                </Link>

                {subMenu && hoverId === id && (
                  <div
                    onMouseLeave={() => setHoverId(null)}
                    className={`absolute left-0 mt-2 bg-background shadow-lg rounded-md p-5 z-50 w-[10em] `}
                  >
                    <ul>
                      {subMenu.map((item) => (
                        <li key={item.id} className="py-3 flex justify-center">
                          <Link
                            href={item.href}
                            className="hover:text-accent-main text-center"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <OtherNavItems />
          </div>
        </div>

        <div className="flex gap-5 items-center justify-between ">
          <Categories
            extractionLink={extractionLink}
            asintLink={asintLink}
            dict={t}
          />

          <div className="flex gap-3 items-center">
            <LangSwitcher dict={dict} />

            <div className="">
              {
                <div className="relative group">
                  <div className="flex  items-center  gap-1 cursor-pointer hover:text-accent-main">
                    {ourMediaLinks.title} <GoTriangleDown className="" />
                  </div>
                  <div className="absolute hidden shadow-lg group-hover:grid right-0 p-4 gap-4  top-[100%] bg-background">
                    {ourMediaLinks.subMenu?.map((item) => {
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="text-nowrap hover:text-accent-main"
                        >
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </nav>

      <div className="lg:hidden w-full">
        <MobileMenu />
      </div>
    </header>
  );
};

export default Header;
