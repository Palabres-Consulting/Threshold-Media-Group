import ContactForm from "@/app/_components/forms/contactForm";
import PageContainer from "@/app/_components/sections/pageContainer";
import Link from "next/link";
import React from "react";
import { FaLocationArrow, FaMailBulk, FaPhoneAlt } from "react-icons/fa";

const ContactPage = () => {
  return (
    <PageContainer id="contact" path="" title="Contact">
      <div className="lg:py-20 lg:px-6 px-4 py-10">
        <div className="text-center mb-20 flex flex-col items-center gap-3">
          <h1 className="text-[3rem] font-bold">Contact Us</h1>
          <p className="text-sm w-[60%]">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore
            eaque modi adipisci esse quam ad possimus? Accusamus dicta
            aspernatur repellat?
          </p>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="lg:w-[50%] ">
            <ContactForm />
          </div>
          <div className="lg:w-[50%] flex flex-col">
            <div className="mb-8">
              <h5 className="text-[2rem]">
                Dont see what you're looking for? Our{" "}
                <Link href="#" className="underline hover:text-accent-main">
                  FAQ
                </Link>{" "}
                page offers further information about subscriptions, Threshold
                Media Group mobile app, managing your account, and more
              </h5>
            </div>
            <div className="text-sm">
              <div className="flex flex-col mt-4 gap-4">
                <div className="flex gap-2 items-center">
                  <FaMailBulk /> info@groupeibs.com
                </div>
                <div className="flex gap-2 items-center">
                  <FaPhoneAlt /> +224 629 00 69 29
                </div>
                <div className="flex gap-2 items-center">
                  <FaLocationArrow /> Nongo, commune de Ratoma - a cote du state
                  Petit Sory
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ContactPage;
