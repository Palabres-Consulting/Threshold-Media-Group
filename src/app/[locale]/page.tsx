import { getTranslations } from "../lib/locale/i18n/getTranslations";
import CyberSecurityPosts from "./_components/sections/cyberSecurityPosts";
import GreatReads from "./_components/sections/greatReads";
import Hero from "./_components/sections/hero";
import MorePosts from "./_components/sections/morePosts";
import Sidebar from "./_components/sections/sidebar";
import ThresholdHompage from "./_components/sections/thresholdHome/ThresholdHompage";
import ThresholdOpinions from "./_components/sections/thresholdOpinions";
import EmptyState from "./_components/ui/empty";
import { useServerSite } from "./hook/useServerSite";

const Home = async ({
  params,
}: {
  params: Promise<{ locale: "en" | "fr" }>;
}) => {
  const site = await useServerSite();
  const { locale } = await params;

  const { main: dict } = getTranslations(locale);

  if (site === "main") {
    return (
      <main className="lg:mx-10 mx-2 border-sub-side">
        <ThresholdHompage locale={locale} dict={dict} />
      </main>
    );
  }

  return (
    <main className="lg:mx-10 mx-2 border-sub-side relative ">
      <div className="bg-[var(--background)]/50  text-[var(--foreground)]  top-0 left-0 w-full h-full z-[999] sticky">
        <div className="w-full h-screen bg-[var(--background)]/40 backdrop-blur-xs flex items-center justify-center">
          {/* <header className="mb-12 border-b border-[var(--foreground)]/10 pb-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              {site.toUpperCase()}
            </h1>
          </header> */}

          {/* Empty State Call */}
         <div className="container mx-auto px-4">
          <EmptyState locale={locale} />
       </div>
        </div>
      </div>

      <Hero />
      <CyberSecurityPosts />

      <div className="w-full flex">
        <div className="lg:w-[70%]">
          <MorePosts />
          <ThresholdOpinions />
          <GreatReads />
        </div>
        <div className="lg:w-[30%] hidden lg:flex">
          <Sidebar />
        </div>
      </div>
    </main>
  );
};

export default Home;
