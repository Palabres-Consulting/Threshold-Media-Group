import { fetchPostsByType } from "../lib/fetchLib";
import { getTranslations } from "../lib/locale/i18n/getTranslations";
import CyberSecurityPosts from "./_components/PostDisplaySections/cyberSecurityPosts";
import GreatReads from "./_components/PostDisplaySections/greatReads";
import Hero from "./_components/PostDisplaySections/hero";
import MorePosts from "./_components/PostDisplaySections/morePosts";
import Sidebar from "./_components/PostDisplaySections/sidebar";
import ThresholdHompage from "./_components/thresholdHome/ThresholdHompage";
import ThresholdOpinions from "./_components/PostDisplaySections/thresholdOpinions";
import EmptyState from "./_components/ui/empty";
import EmptyFull from "./_components/ui/emptyFull";
import { useServerSite } from "./hook/useServerSite";
import { CategoriesMap, getCategoryContext } from "../lib/categoriesMap";
import SharedHeader from "./_components/categories/sharedHeader";

const Home = async (props: {
  params: Promise<{ locale: "en" | "fr" }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { locale } = params;
  const site = await useServerSite();

  // Extract the active category from the URL search parameters
  const activeCategory = typeof searchParams.category === "string" ? searchParams.category : undefined;

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

  let topLevelCategory = slugifiedNav.find((cat) => cat.slug === siteSlug || cat.slug === site);
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
    categoryContext = getCategoryContext(activeCategory, navTranslations, locale);
    
    // Only fetch if this category has a valid mapped WordPress ID
    if (categoryContext && categoryContext.categoryId && categoryContext.taxonomy) {
      queryParams[categoryContext.taxonomy] = categoryContext.categoryId;
      allArticles = await fetchPostsByType(wpPostType, queryParams);
    } 
  } else {
    // If no category is selected, fetch all posts for the subdomain
    allArticles = await fetchPostsByType(wpPostType, queryParams);
  }

  hasArticles = allArticles && allArticles.length > 0;

  // 4. Slice data safely
  const heroPosts = hasArticles ? allArticles.slice(0, 3) : [];
  const cyberPosts = hasArticles ? allArticles.slice(3, 6) : [];
  const morePosts = hasArticles ? allArticles.slice(6, 11) : [];

  // Main Homepage Return
  if (site === "main") {
    return (
      <main className="lg:mx-10 mx-2 border-sub-side">
        <ThresholdHompage locale={locale} dict={dict} />
      </main>
    );
  }

  // If completely empty site (no articles and no category selected)
  if (!hasArticles && !activeCategory) {
    return <EmptyFull lang={locale} />;
  }

  return (
    <main className="lg:mx-10 mx-2 border-sub-side relative ">
      
      {/* 1. Universal Header (Always renders) */}
      <SharedHeader 
        title={activeCategory && categoryContext ? categoryContext.title : topLevelCategory?.title}
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
        </>
      )}
    </main>
  );
};

export default Home;