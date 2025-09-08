"use client";

import PageContainer from "@/app/[locale]/_components/sections/pageContainer";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useLocalization } from "../../context/localizationContext";

const Aboutpage = () => {
  const { dict } = useLocalization();

  const team = [
    {
      id: 0,
      name: "Jonathan Siuu",
      role: "Founder & CEO",
      linkedIn: "#",
      facebook: "#",
      instagram: "#",
      image: "#",
    },
    {
      id: 1,
      name: "Jonathan Siuu",
      role: "Founder & CEO",
      linkedIn: "#",
      facebook: "#",
      instagram: "#",
      image: "#",
    },
    {
      id: 2,
      name: "Jonathan Siuu",
      role: "Founder & CEO",
      linkedIn: "#",
      facebook: "#",
      instagram: "#",
      image: "#",
    },
    {
      id: 3,
      name: "Jonathan Siuu",
      role: "Founder & CEO",
      linkedIn: "#",
      facebook: "#",
      instagram: "#",
      image: "#",
    },
  ];

  const services = [
    {
      id: 0,
      title: "A guide to choosing smartphones with good camera",
      image: "",
    },
    {
      id: 1,
      title: "A guide to choosing smartphones with good camera",
      image: "",
    },
    {
      id: 2,
      title: "A guide to choosing smartphones with good camera",
      image: "",
    },
  ];

  return (
    <PageContainer id="about" path="" title={dict.about.title}>
      <div className="flex flex-col ">
        {/* NAVIGATION */}
        <div className="flex gap-6 text-xs lg:text-sm lg:px-7 lg:pt-5 p-3">
          <Link
            href="/about/#team"
            className="font-semibold hover:text-accent-main"
          >
            {dict.about.nav.strengths}
          </Link>
          <Link
            href="/about/#service"
            className="font-semibold hover:text-accent-main"
          >
            {dict.about.nav.services}
          </Link>
          <Link
            href="/about/#process"
            className="font-semibold hover:text-accent-main"
          >
            {dict.about.nav.process}
          </Link>
        </div>

        {/* INTRO */}
        <div className="flex flex-col lg:px-6 p-3 pb-6">
          <div className="h-[45vh] rounded-2xl overflow-hidden bg-foreground/5">
            {/* image */}
          </div>
          <div className="flex flex-col lg:flex-row lg:justify-between mt-4 lg:gap-x-28 gap-10 py-8">
            <div className="lg:w-[45%] border-t-2 border-solid border-accent-main py-8">
              <h4 className="text-[1.8rem] font-semibold">
                {dict.about.intro.headline}
              </h4>
            </div>
            <div className="lg:w-[50%] flex flex-col gap-5">
              <h5 className="text-[1.4rem] font-semibold">
                {dict.about.intro.paragraph1}
              </h5>
              <div className="text-sm gap-5 flex flex-col">
                <p>{dict.about.intro.paragraph2}</p>
                <p>{dict.about.intro.paragraph3}</p>
              </div>
            </div>
          </div>
        </div>

        {/* TEAM */}
        <div className="py-10 border-sub-y lg:p-6 p-3" id="team">
          <div className="flex flex-col text-center mb-14">
            <h2 className="text-[3rem] font-bold mb-6">
              {dict.about.team.title}
            </h2>
            <p className="text-foreground/50">{dict.about.team.description}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-8">
            {team.map(
              ({ id, facebook, image, instagram, linkedIn, name, role }) => (
                <div key={id} className="flex flex-col h-[55vh] gap-4">
                  <div className="h-[80%] rounded-2xl bg-foreground/5">
                    {/* {image} */}
                  </div>
                  <div className="h-[20%] flex justify-between">
                    <div className="flex flex-col gap-2">
                      <h5 className="text-sm">{name}</h5>
                      <p className="text-xs">{role}</p>
                    </div>
                    <div>
                      <ul className="flex gap-2">
                        <li className="flex h-fit">
                          <Link
                            href={facebook}
                            className="rounded-full p-2 text-[1rem] border-sub bg-foreground/5 "
                          >
                            <FaFacebook />
                          </Link>
                        </li>
                        <li className="flex h-fit">
                          <Link
                            href={instagram}
                            className="rounded-full p-2 text-[1rem] border-sub bg-foreground/5"
                          >
                            <FaInstagram />
                          </Link>
                        </li>
                        <li className="flex h-fit">
                          <Link
                            href={linkedIn}
                            className="rounded-full p-2 text-[1rem] border-sub bg-foreground/5"
                          >
                            <FaLinkedin />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* SERVICES */}
        <div className="py-10 border-sub-y lg:p-6 p-3" id="service">
          <div className="flex flex-col text-center mb-14">
            <h2 className="text-[3rem] font-bold mb-6">
              {dict.about.services.title}
            </h2>
            <p className="text-foreground/50">
              {dict.about.services.description}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8">
            {services.map(({ id, image, title }) => (
              <div
                key={id}
                className="h-[53vh] rounded-2xl overflow-hidden flex items-end relative border-sub"
              >
                <div className="absolute h-full w-full">{/* {image} */}</div>
                <div className="absolute lg:h-full w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent"></div>
                <h3 className="z-50 text-[2rem] text-white p-4 font-bold">
                  {title.slice(0, 25)}...
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* PROCESS */}
        <div className="lg:px-6 px-3 py-10 " id="process">
          <div className="flex flex-col text-center mb-14">
            <h2 className="text-[3rem] font-bold mb-6">
              {dict.about.process.title}
            </h2>
            <p className="text-foreground/50">
              {dict.about.process.description}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 justify-center items-center w-full">
            <div className="lg:w-[70%] w-full flex gap-3">
              <div className="w-[50%] h-[53vh] rounded-2xl overflow-hidden flex items-end relative border-sub">
                <div className="absolute h-full w-full">{/* {image} */}</div>
                <h2 className="text-[5rem] font-black z-50 text-white absolute bottom-[-30px] left-[0px]">
                  01
                </h2>
                <div className="absolute lg:h-full w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent"></div>
              </div>
              <div className="w-[50%] flex gap-3">
                <div className="w-[50%] h-[53vh] rounded-2xl overflow-hidden flex items-end relative border-sub">
                  <div className="absolute lg:h-full w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent"></div>
                  <div className="absolute h-full w-full">{/* {image} */}</div>
                  <h2 className="text-[5rem] font-black z-50 text-white absolute bottom-[-30px] left-[0px]">
                    02
                  </h2>
                </div>
                <div className="w-[50%] h-[53vh] rounded-2xl overflow-hidden flex items-end relative border-sub">
                  <div className="absolute h-full w-full">{/* {image} */}</div>
                  <h2 className="text-[5rem] font-black z-50 text-white absolute bottom-[-30px] left-[0px]">
                    03
                  </h2>
                  <div className="absolute lg:h-full w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent"></div>
                </div>
              </div>
            </div>
            <div className="lg:w-[30%] flex flex-col">
              <h3 className="font-semibold text-[1.4rem] mb-4">
                {dict.about.process.stepTitle}
              </h3>
              <p className="text-sm">{dict.about.process.stepDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Aboutpage;
