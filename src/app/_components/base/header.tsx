"use client";

import Link from "next/link";
import Logo from "./logo";
import { useEffect, useRef, useState } from "react";
import { NavLinks } from "@/app/types/types";
import { usePathname } from "next/navigation";

import { FaAngleDown } from "react-icons/fa";
import { GoTriangleDown } from "react-icons/go";

const navLinks: NavLinks[] = [
  {
    id: 0,
    title: "About Us",
    href: "/about",
    subMenu: [
      { id: 0, title: "Our Team", href: "/about#team" },
      { id: 1, title: "Services", href: "/about#services" },
      { id: 2, title: "Process", href: "/about#process" },
    ],
  },
  {
    id: 1,
    title: "Pricing",
    href: "/pricing",
    subMenu: null,
  },
  {
    id: 2,
    title: "Contact",
    href: "/contact",
    subMenu: null,
  },
];
const Header = () => {
  const pathName = usePathname();
  const [hoverId, setHoverId] = useState<number | null>(null);

  const [transDropdown, setTransDropdown] = useState(false);

  return (
    <header className="flex justify-center items-center  lg:px-16 shadow-xs shadow-foreground/5 px-3 sticky top-0 backdrop-blur-sm bg-transparent z-60">
      <nav className="lg:flex justify-between items-center hidden w-full lg:py-5 py-5 px-5 text-sm  border-sub-side">
        <Logo />
        <div className="flex justify-between gap-10  items-center">
          {navLinks.map(({ id, title, href, subMenu }) => (
            <div
              key={id}
              className="relative"
              onMouseEnter={() => setHoverId(id)}
              // onMouseLeave={() => setHoverId(null)}
            >
              <Link
                href={href}
                className={` ${
                  hoverId === id && subMenu ? "text-accent-main" : ""
                } hover:text-accent-main w-fit flex items-center justify-center gap-2 {pathName === href ? "text-blue-500 font-bold" : ""}`}
              >
                {title} {subMenu && <GoTriangleDown className="" />}
              </Link>

              {/* Submenu */}
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
          <div className="flex gap-10 items-center">
            <div className="flex gap-2">
              <Link href="#" className="px-6 py-1 rounded-md border-sub">
                Extraction
              </Link>
              <Link href="#" className="px-6 py-1 rounded-md border-sub">
                ASINT
              </Link>
            </div>

            <div className="relative">
              <button
                className="flex gap-2 items-center"
                onMouseEnter={() => setTransDropdown(true)}
              >
                Eng <GoTriangleDown />
              </button>

              {transDropdown && (
                <div
                  onMouseLeave={() => setTransDropdown(false)}
                  className="rounded-2xl p-5 absolute bg-background top-5 shadow-lg w-[8em] z-50"
                >
                  <ul>
                    <li className="py-2 flex justify-center">
                      <button className="hover:text-accent-main text-center">
                        French
                      </button>
                    </li>
                    <li className="py-2 flex justify-center">
                      <button className="hover:text-accent-main text-center">
                        Spanish
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <Link href="/signup">Login/Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="lg:hidden w-full">
        <MobileMenu />
      </div>
    </header>
  );
};

export default Header;

const MobileMenu = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="">
      <div className="relative flex items-center justify-center py-4">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {/* Optional: placeholder to balance layout */}
        </div>

        <Logo />

        <button
          onClick={() => setNavOpen(!navOpen)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl"
        >
          ☰
        </button>
      </div>
      {navOpen && (
        <nav className="mt-4">
          <ul className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className="block py-2 px-4 hover:bg-gray-200"
                  onClick={() => setNavOpen(false)} // 👈 Close nav
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};
