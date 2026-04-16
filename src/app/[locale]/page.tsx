import {
  fetchPostsByType,
  postKeys,
  prefetchUniversalPosts,
} from "../lib/fetchLib";
import { getTranslations } from "../lib/locale/i18n/getTranslations";
import CyberSecurityPosts from "./_components/sections/cyberSecurityPosts";
import GreatReads from "./_components/sections/greatReads";
import Hero from "./_components/sections/hero";
import MorePosts from "./_components/sections/morePosts";
import Sidebar from "./_components/sections/sidebar";
import ThresholdHompage from "./_components/sections/thresholdHome/ThresholdHompage";
import ThresholdOpinions from "./_components/sections/thresholdOpinions";
import EmptyState from "./_components/ui/empty";
import EmptyFull from "./_components/ui/emptyFull";
import { useServerSite } from "./hook/useServerSite";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const Home = async ({
  params,
}: {
  params: Promise<{ locale: "en" | "fr" }>;
}) => {
  const site = await useServerSite();
  const { locale } = await params;

  const wpPostType = (site === "main" ? "posts" : site) as
    | "posts"
    | "extraction"
    | "asint"
    | "guinea_intel"
    | "innovation"
    | "transverse";

  // 2. Fetch the "Master List" (latest first is usually default WP behavior)
  const allArticles = await fetchPostsByType(wpPostType, {
    per_page: 15,
    lang: locale,
  });

  

  // 3. Slice the data for each section
  // Hero gets the first 3 (latest)
  const heroPosts = allArticles.slice(0, 3);
  // console.log("Hero Posts:", heroPosts);

  // CyberSecurity gets the next 3
  const cyberPosts = allArticles.slice(3, 6);
  // console.log("Cyber Security Posts:", cyberPosts);


  // MorePosts gets the next 5
  const morePosts = allArticles.slice(6, 11);

  const { main: dict } = getTranslations(locale);

  if (site === "main") {
    return (
      <main className="lg:mx-10 mx-2 border-sub-side">
        <ThresholdHompage locale={locale} dict={dict} />
      </main>
    );
  }

  if (!allArticles?.length) {
    return <EmptyFull lang={locale} />;
  }

  return (
    <main className="lg:mx-10 mx-2 border-sub-side relative ">
      <Hero site={site} posts={heroPosts} />
      <CyberSecurityPosts site={site} posts={cyberPosts} />

      <div className="w-full flex">
        <div className="lg:w-[70%] w-full">
          <MorePosts lang={locale} posts={morePosts} />
          <ThresholdOpinions lang={locale} />
          <GreatReads lang={locale} />
        </div>
        <div className="lg:w-[30%] hidden lg:flex">
          <Sidebar lang={locale} />
        </div>
      </div>
    </main>
  );
};

export default Home;

//  <div className="bg-[var(--background)]/50  text-[var(--foreground)]  top-0 left-0 w-full h-full z-[999] sticky">
//         <div className="w-full h-screen bg-[var(--background)]/40 backdrop-blur-xs flex items-center justify-center">
//           {/* <header className="mb-12 border-b border-[var(--foreground)]/10 pb-8">
//             <h1 className="text-4xl font-black uppercase tracking-tighter">
//               {site.toUpperCase()}
//             </h1>
//           </header> */}

//           {/* Empty State Call */}
//          <div className="container mx-auto px-4">
//           <EmptyState locale={locale} />
//        </div>
//         </div>
//       </div>
