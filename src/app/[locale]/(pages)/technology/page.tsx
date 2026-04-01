
import React from "react";
import Link from "next/link";
import PageContainer from "../../_components/sections/pageContainer";
import SectionHeader from "../../_components/sections/sectionHeader";
import EditorialProcess from "../../_components/sections/thresholdHome/editorialProcess";
import ServicesComponent from "../../_components/sections/thresholdHome/servicesComponent";
import { useServerSite } from "../../hook/useServerSite";
import { getTranslations } from "@/app/lib/locale/i18n/getTranslations";

const TechnologyPage = async ({
  params,
}: {
  params: Promise<{ locale: "en" | "fr" }>;
}) => {

  const site = await useServerSite();
    const { locale } = await params;
  
    const { main: dict } = getTranslations(locale);

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
      title={dict?.technology.title || "Technology"}
      path="Technology"
      id="thresholdAbout"
    >
      <div className="flex flex-col ">
        {/* NAVIGATION */}
        <div className="flex gap-6 text-xs lg:text-sm lg:px-7 lg:pt-5 p-3">
          <Link
            href="/about/#aboutTheGroup"
            className="font-semibold hover:text-accent-main"
          >
            {dict.technology.nav.ourAi}
          </Link>
          <Link
            href="/about/#ourMediaBrands"
            className="font-semibold hover:text-accent-main"
          >
            {dict.technology.nav.editorialProcess}
          </Link>
          <Link
            href="/about/#editorialTeam"
            className="font-semibold hover:text-accent-main"
          >
            {dict.technology.nav.dataInsight}
          </Link>
        </div>
      </div>

      <div className="py-10 lg:px-6 px-3">
        <SectionHeader
          description={dict.technology.subtext}
          heading={dict.technology.headline}
        />
        <div className="flex flex-col lg:flex-row gap-14 mt-6">
          <div className="min-h-[80vh] bg-foreground/5 rounded-2xl overflow-hidden lg:w-[50%] w-full"></div>
          <div className="lg:w-[50%] w-full">
            <div className="flex flex-col lg:justify-between mt-4 lg:gap-x-28 gap-10 py-8">
              <div className=" border-t-2 border-solid border-accent-main py-8">
                <h4 className="text-[1.8rem] font-semibold">
                  {dict.technology.rightHeadline }
                </h4>
              </div>
              <div className=" flex flex-col gap-5">
                <h5 className="text-[1.4rem] font-semibold">
                  {dict.technology.rightSubHeadline}
                </h5>
                <div className="text-sm gap-5 flex flex-col">
                  <p>{dict.technology.paragraph1}</p>
                  <p>{dict.technology.paragraph2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditorialProcess
        titleColor=""
        mainTitle={true}
        dict={dict}
        title={dict.technology.editorialProcess.title}
        description={dict.technology.editorialProcess.subDescription}
      />

      {/* <ServicesComponent dict={dict} /> */}
    </PageContainer>
  );
};

export default TechnologyPage;
