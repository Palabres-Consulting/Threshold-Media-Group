import PageContainer from "@/app/[locale]/_components/sections/pageContainer";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import Plans from "./plans";
import { getTranslations } from "@/app/lib/locale/i18n/getTranslations";

const PricingPage = async ({
  params,
}: {
  params: Promise<{ locale: "en" | "fr" }>;
}) => {

    const { locale } = await params;
  
    const { main: dict } = getTranslations(locale);
  

  return (
    <PageContainer id="pricing" path="" title={dict.pricing.pageTitle}>
      <div className="lg:py-20 lg:px-6 px-4 py-10">
        <div className="text-center mb-20 flex flex-col items-center gap-3">
          <h1 className="text-[3rem] font-bold">{dict.pricing.headline}</h1>
          <p className="text-sm w-[60%]">{dict.pricing.subtext}</p>
        </div>
        <Plans dict={dict} />
      </div>
    </PageContainer>
  );
};

export default PricingPage;
