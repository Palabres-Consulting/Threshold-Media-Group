"use client";

import ContactForm from "@/app/[locale]/_components/forms/contactForm";
import PageContainer from "@/app/[locale]/_components/sections/pageContainer";
import Link from "next/link";
import React from "react";
import { FaLocationArrow, FaMailBulk, FaPhoneAlt } from "react-icons/fa";
import { getDictionary } from "@/app/lib/dict";
import { useLocalization } from "../../context/localizationContext";

const ContactPage = () => {
  const { dict } = useLocalization();

  return (
    <PageContainer id="contact" path="" title={dict.contact.title}>
      <div className="lg:py-20 lg:px-6 px-4 py-10">
        <div className="text-center mb-20 flex flex-col items-center gap-3">
          <h1 className="text-[3rem] font-bold">{dict.contact.title}</h1>
          <p className="text-sm w-[60%]">{dict.contact.subtitle}</p>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between gap-20">
          <div className="lg:w-[50%] ">
            <ContactForm />
          </div>
          <div className="lg:w-[50%] flex flex-col">
            <div className="mb-8">
              <h5 className="text-[2rem]">
                {dict.contact.faqPrompt}{" "}
                <Link href="#" className="underline hover:text-accent-main">
                  {dict.contact.faqLink}
                </Link>{" "}
                {dict.contact.faqRest}
              </h5>
            </div>
            <div className="text-sm">
              <div className="flex flex-col mt-4 gap-4">
                <div className="flex gap-2 items-center">
                  <FaMailBulk /> {dict.contact.email}
                </div>
                <div className="flex gap-2 items-center">
                  <FaPhoneAlt /> {dict.contact.phone}
                </div>
                <div className="flex gap-2 items-center">
                  <FaLocationArrow /> {dict.contact.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[80vh] w-full p-3 py-10">
          <div className="rounded-2xl h-full w-full bg-foreground/5">
            {/* {map} */}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ContactPage;
