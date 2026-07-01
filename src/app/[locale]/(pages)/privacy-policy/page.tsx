import PageContainer from "@/components/PostDisplaySections/pageContainer";
import React from "react";
import { getTranslations } from "@/lib/locale/i18n/getTranslations";

const PrivacyPolicyPage = async ({
  params,
}: {
  params: Promise<{ locale: "en" | "fr" }>;
}) => {
  const { locale } = await params;
  const { main: dict } = getTranslations(locale);

  return (
    <PageContainer id="privacy-policy" path="" title={dict.privacyPolicy.pageTitle}>
      <div className="lg:py-20 lg:px-6 px-4 py-10 max-w-4xl mx-auto">
        <div className="text-center mb-16 flex flex-col items-center gap-3">
          <h1 className="text-[2.5rem] lg:text-[3rem] font-bold">{dict.privacyPolicy.headline}</h1>
          <p className="text-sm text-gray-500">{dict.privacyPolicy.subtext}</p>
        </div>
        
        <div className="flex flex-col gap-8">
          {dict.privacyPolicy.sections.map((section: any, index: number) => (
            <section key={index} className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default PrivacyPolicyPage;