import PageContainer from "@/components/PostDisplaySections/pageContainer";
import React from "react";
import { getTranslations } from "@/lib/locale/i18n/getTranslations";

const FaqPage = async ({
  params,
}: {
  params: Promise<{ locale: "en" | "fr" }>;
}) => {
  const { locale } = await params;
  const { main: dict } = getTranslations(locale);

  return (
    <PageContainer id="faq" path="" title={dict.faq.pageTitle}>
      <div className="lg:py-20 lg:px-6 px-4 py-10 max-w-3xl mx-auto">
        <div className="text-center mb-16 flex flex-col items-center gap-3">
          <h1 className="text-[2.5rem] lg:text-[3rem] font-bold">{dict.faq.headline}</h1>
          <p className="text-sm text-gray-500">{dict.faq.subtext}</p>
        </div>
        
        <div className="flex flex-col gap-6">
          {dict.faq.sections.map((item: any, index: number) => (
            <div key={index} className="flex flex-col gap-2 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">{item.question}</h3>
              <p className="text-base text-gray-700 whitespace-pre-wrap">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default FaqPage;