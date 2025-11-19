"use client";

import Link from "next/link";
import Logo, { useHomeLink } from "./logo";
import { useEffect, useRef, useState } from "react";
import { NavLinks } from "@/app/types/types";
import { usePathname } from "next/navigation";
import { GoTriangleDown } from "react-icons/go";
// import { useSubdomain } from "@/app/[locale]/hook/useSubDomain";
import { useLocalization } from "../../context/localizationContext";
import ThemeSwitcher from "../ui/themeSwitcher";
import { useUser } from "../../hook/useUser";

const Header: React.FC<{ site: string }> = ({ site }) => {
  const pathName = usePathname();
  const [hoverId, setHoverId] = useState<number | null>(null);
  const { asintLink, extractionLink } = useHomeLink(site);

  // const site = useSubdomain();

  const { data, isLoading } = useUser();
  console.log(data);

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
      title: dict.nav.pricing,
      href: "/pricing",
      subMenu: null,
    },
    {
      id: 3,
      title: dict.nav.contact,
      href: "/contact",
      subMenu: null,
    },
  ];

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
          <div className="absolute  top-18 right-5 w-[80%] md:w-[20%] border-sub overflow-y-scroll h-[100vh]  p-8 rounded-md  bg-background z-70">
            <ul className="grid gap-10 ">
              {activeNavlink.map(({ href, id, subMenu, title }) => {
                return (
                  <li key={id} className="relative w-full h-fit">
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
            </ul>

            <OtherNavItems />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const OtherNavItems = () => {
    const [transDropdown, setTransDropdown] = useState(false);
    return (
      <div className="flex flex-col lg:flex-row lg:gap-10 my-10 gap-10 lg:items-center">
        <div className="flex lg:flex-row flex-col gap-4">
          <Link
            href={extractionLink}
            className="px-6 py-1 rounded-md border-sub"
          >
            Extraction
          </Link>
          <Link href={asintLink} className="px-6 py-1 rounded-md border-sub">
            ASINT
          </Link>
        </div>

        <ThemeSwitcher dict={dict} />
        {isLoading ? (
          <div className="px-2 py-1 flex items-center gap-2">
            <div className="h-[25px] w-[25px] rounded-full bg-foreground/10 animate-pulse" />
            <div className="h-3 w-16 bg-foreground/10 animate-pulse rounded" />
          </div>
        ) : data ? (
          <Link href="/profile" className="px-2 py-1 flex items-center gap-2">
            <div className="h-[25px] w-[25px] rounded-full bg-foreground/10" />
            <h5>
              {dict.nav.welcome}, {data.title.slice(0, 4)}
            </h5>
            <GoTriangleDown />
          </Link>
        ) : (
          <Link href="/auth">{dict.nav.login}</Link>
        )}
      </div>
    );
  };

  return (
    <header className="flex justify-center items-center  lg:px-16 shadow-xs shadow-foreground/5 px-3 sticky top-0 backdrop-blur-sm bg-transparent z-60">
      <nav className="lg:flex justify-between items-center hidden w-full  px-5 text-sm  border-sub-side">
        <Logo site={site} />
        <div className="flex justify-between gap-10  items-center">
          {activeNavlink.map(({ id, title, href, subMenu }) => (
            <div
              key={id}
              className="relative"
              onMouseEnter={() => setHoverId(id)}
            >
              <Link
                href={href}
                className={` ${
                  hoverId === id && subMenu ? "text-accent-main" : ""
                }  hover:text-accent-main w-fit flex items-center justify-center gap-2 ${
                  pathName === href ? "text-accent-main font-bold" : ""
                }`}
              >
                {title} {subMenu && <GoTriangleDown className="" />}
              </Link>

              {subMenu && hoverId === id && (
                <div
                  onMouseLeave={() => setHoverId(null)}
                  className={`absolute left-0 mt-2 bg-background shadow-lg rounded-2xl p-5 z-50 w-[10em] `}
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
      </nav>

      <div className="lg:hidden w-full">
        <MobileMenu />
      </div>
    </header>
  );
};

export default Header;
