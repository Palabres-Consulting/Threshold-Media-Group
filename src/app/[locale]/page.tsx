import { fetchPostsByType } from "../helpers/fetchLib";
import { getTranslations } from "../../lib/locale/i18n/getTranslations";
import CyberSecurityPosts from "../../components/PostDisplaySections/cyberSecurityPosts";
import GreatReads from "../../components/PostDisplaySections/greatReads";
import Hero from "../../components/PostDisplaySections/hero";
import MorePosts from "../../components/PostDisplaySections/morePosts";
import Sidebar from "../../components/PostDisplaySections/sidebar";
import ThresholdHompage from "../../components/thresholdHome/ThresholdHompage";
import ThresholdOpinions from "../../components/PostDisplaySections/thresholdOpinions";
import EmptyState from "../../components/ui/empty";
import EmptyFull from "../../components/ui/emptyFull";
import { useServerSite } from "./hook/useServerSite";
import { CategoriesMap, getCategoryContext } from "../helpers/categoriesMap";
import SharedHeader from "../../components/categories/sharedHeader";
import { normalizePosts } from "../helpers/normalizeData";
import AdDisplay from "@/components/PostDisplaySections/adDisplay";
import AdDisplayLandscape from "@/components/PostDisplaySections/adDisplayLandscape";
import cloudinaryLoader from "../helpers/cloudinary";
import Image from "next/image";

const Home = async (props: {
  params: Promise<{ locale: "en" | "fr" }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { locale } = params;
  const site = await useServerSite();

  // Extract the active category from the URL search parameters
  const activeCategory =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;

  const wpPostType = (site === "main" ? "posts" : site) as
    | "posts"
    | "extraction"
    | "asint"
    | "guinea_intel"
    | "innovation"
    | "transverse";

  const { main: dict } = getTranslations(locale);
  const navTranslations = dict.nav.categories;

  // 1. Map Site to Top Level Category Context
  const slugifiedNav = CategoriesMap(navTranslations);
  const siteSlug = site.replace(/_/g, "-");
  const siteIndexMap: Record<string, number> = {
    extraction: 0,
    asint: 1,
    guinea_intel: 2,
    innovation: 3,
    transverse: 4,
  };

  let topLevelCategory = slugifiedNav.find(
    (cat) => cat.slug === siteSlug || cat.slug === site,
  );
  if (!topLevelCategory && siteIndexMap[site] !== undefined) {
    topLevelCategory = slugifiedNav[siteIndexMap[site]];
  }

  // 2. Build Query Params
  const queryParams: any = {
    per_page: 15,
    lang: locale,
  };

  let categoryContext: any = null;
  let allArticles: any[] = [];
  let hasArticles = false;

  // 3. Fetch Logic
  if (activeCategory) {
    categoryContext = getCategoryContext(
      activeCategory,
      navTranslations,
      locale,
    );

    // Only fetch if this category has a valid mapped WordPress ID
    if (
      categoryContext &&
      categoryContext.categoryId &&
      categoryContext.taxonomy
    ) {
      queryParams[categoryContext.taxonomy] = categoryContext.categoryId;
      allArticles = await fetchPostsByType(wpPostType, queryParams);
    }
  } else {
    // If no category is selected, fetch all posts for the subdomain
    allArticles = await fetchPostsByType(wpPostType, queryParams);
  }

  hasArticles = allArticles && allArticles.length > 0;

  // Normalize all articles immediately after fetching
  const cleanArticles = normalizePosts(allArticles, site);
  console.log("Normalized Articles:", cleanArticles.length);

  // 4. Slice data safely
  const heroPosts = hasArticles ? cleanArticles.slice(0, 3) : [];
  // const cyberPosts = hasArticles ? cleanArticles.slice(3, 6) : [];
  const morePosts = hasArticles ? cleanArticles.slice(3, 8) : [];
  const opinionPosts = hasArticles ? cleanArticles.slice(8, 16) : [];
  const greatReadsPosts = hasArticles ? cleanArticles.slice(16, 24) : [];
  // Main Homepage Return
  if (site === "main") {
    return (
      <main className="">
        <ThresholdHompage locale={locale} dict={dict} />
      </main>
    );
  }

  // If completely empty site (no articles and no category selected)
  if (!hasArticles && !activeCategory) {
    return <EmptyFull lang={locale} />;
  }

  return (
    <main className="mx-2 border-sub-side lg:mx-10 relative overflow-hidden 2xl:mx-auto ">
      {/* 1. Universal Header (Always renders) */}
      <SharedHeader
        title={
          activeCategory && categoryContext
            ? categoryContext.title
            : topLevelCategory?.title
        }
        locale={locale}
        activeCategory={activeCategory}
        context={categoryContext}
        topLevelCategory={topLevelCategory}
        isQueryRouting={true} // Tells the header to use ?category=slug
      />

      {/* 2. Content Render */}
      {activeCategory && !hasArticles ? (
        <div className="flex items-center justify-center min-h-[60vh] z-[999]">
          <div className="container mx-auto px-4">
            <EmptyState locale={locale} />
          </div>
        </div>
      ) : (
        <>
          <Hero site={site} posts={heroPosts} />

          <section className="flex justify-center ">
            <div className="w-[85%] lg:h-[20em] rounded-2xl overflow-hidden relative">
              <AdDisplayLandscape />
            </div>
          </section>

          <div className="w-full flex">
            <div className="lg:w-[70%] w-full">
              <MorePosts lang={locale} posts={morePosts} site={site} />
              <ThresholdOpinions
                site={site} 
                posts={opinionPosts}
                lang={locale}
              />
              {/* <MorePosts lang={locale} posts={morePosts} /> */}

              {/* <GreatReads lang={locale} posts={greatReadsPosts} site={site} /> */}
            </div>
            <div className="lg:w-[30%] hidden lg:flex">
              <div className="w-full py-10 relative overflow-hidden">
                <AdDisplay />
              </div>
              {/* <Sidebar lang={locale} /> */}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Home;
