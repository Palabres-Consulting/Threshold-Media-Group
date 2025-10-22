"use client";

import { useLocalization } from "@/app/[locale]/context/localizationContext";
import React from "react";
import PageContainer from "../pageContainer";
import Link from "next/link";

const TechnologyPage = () => {
  const { dict, site } = useLocalization();

  if (site !== "main") {
    return (
      <div className="flex justify-center min-h-screen items-center">
        <div className="flex flex-col gap-5 text-center">
          <h1 className="text-[3rem] font-bold">Page Unavailable</h1>{" "}
          <Link href="/" className="">
            Go back to Home
          </Link>{" "}
        </div>
      </div>
    );
  }

  return (
    <PageContainer
      title={dict?.aboutTitle || "About Us"}
      path="About"
      id="thresholdAbout"
    >
      <div className=""></div>
    </PageContainer>
  );
};

export default TechnologyPage;
