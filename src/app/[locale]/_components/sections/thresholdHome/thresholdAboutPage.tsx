import React from "react";
import PageContainer from "../pageContainer";
import Link from "next/link";
import SectionHeader from "../sectionHeader";
import AboutTheGroup from "./aboutTheGroup";
import PressMentions from "./pressMentions";
import EditorialTeam from "./EditorialTeam";
import EditorialProcess from "./editorialProcess";

const ThresholdAboutPage: React.FC<{ dict: any }> = ({ dict }) => {
  return (
    <PageContainer
      title={dict?.aboutTitle || "About Us"}
      path="About"
      id="thresholdAbout"
    >
      <div className="flex flex-col ">
        {/* NAVIGATION */}
        <div className="flex gap-6 text-xs lg:text-sm lg:px-7 lg:pt-5 p-3">
          <Link
            href="/about/#aboutTheGroup"
            className="font-semibold hover:text-accent-main"
          >
            {dict.about.nav.theGroup}
          </Link>
          <Link
            href="/about/#ourMediaBrands"
            className="font-semibold hover:text-accent-main"
          >
            {dict.about.nav.ourMediaBrands}
          </Link>
          <Link
            href="/about/#editorialTeam"
            className="font-semibold hover:text-accent-main"
          >
            {dict.about.nav.editorialTeam}
          </Link>
        </div>
      </div>
      <div className="py-10 lg:px-6 px-3">
        <SectionHeader
          heading={dict.about.theGroup.title}
          description={dict.about.theGroup.description}
        />

        
      </div>

      <AboutTheGroup dict={dict} id="aboutTheGroup" />
        <EditorialProcess
        mainTitle={false}
        dict={dict}
        title="Values"
        titleColor="text-accent-main"
        description={dict.technology.editorialProcess.subDescription}
      />
      <PressMentions
        id="ourMediaBrands"
        title={dict.about.ourMediaBrands.title}
        description={dict.about.ourMediaBrands.description}
      />

      <EditorialTeam dict={dict} id="editorialTeam" />
    </PageContainer>
  );
};

export default ThresholdAboutPage;
