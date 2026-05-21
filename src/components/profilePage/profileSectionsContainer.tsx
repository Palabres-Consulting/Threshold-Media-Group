"use client";

import cloudinaryLoader from "@/app/helpers/cloudinary";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ProfileSectionsContainer: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {

  const sectionId = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") 
    .replace(/\s+/g, "-");

  return (
    <section id={sectionId}  
    className="rounded-2xl  p-5 bg-foreground/5 scroll-mt-44">
      <div className="pb-6 border-sub-bottom">
        <h1 className=" lg:text-[1.7rem] text-[1.3rem] font-bold">{title}</h1>
      </div>
      <div className="flex flex-col gap-7 mt-8 relative">{children}</div>
    </section>
  );
};

export default ProfileSectionsContainer;

