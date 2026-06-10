import EmptyFull from "@/components/ui/emptyFull";
import { ErrorComponent } from "@/app/[locale]/error";
import { AlertCircle } from "lucide-react";
import { getTranslations } from "@/lib/locale/i18n/getTranslations";
import { getCategoryContext } from "@/app/helpers/categoriesMap";
import { fetchPostsByType } from "@/app/helpers/fetchLib";
import SharedHeader from "./sharedHeader";

// Import your sections
import Hero from "../PostDisplaySections/hero";
import CyberSecurityPosts from "../PostDisplaySections/cyberSecurityPosts";
import MorePosts from "../PostDisplaySections/morePosts";
import ThresholdOpinions from "../PostDisplaySections/thresholdOpinions";
import GreatReads from "../PostDisplaySections/greatReads";
import Sidebar from "../PostDisplaySections/sidebar";
import { normalizePosts } from "@/app/helpers/normalizeData";
import AdDisplay from "../PostDisplaySections/adDisplay";
import AdDisplayLandscape from "../PostDisplaySections/adDisplayLandscape";
import HeroSection from "../PostDisplaySections/hero2";
import FeaturedSection from "../PostDisplaySections/featuredSection";
import GridPosts from "../PostDisplaySections/gridPosts";

interface SharedCategoryLayoutProps {
  locale: "en" | "fr";
  slug: string;
}

export default async function SharedCategoryLayout({
  locale,
  slug,
}: SharedCategoryLayoutProps) {
  const { main: dict } = getTranslations(locale);
  const navTranslations = dict.nav.categories;


  // 1. Get the Bloomberg Context & WP ID
  const context = getCategoryContext(slug, navTranslations, locale);

  if (!context) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <ErrorComponent
          errorTitle={locale === "fr" ? "Page non trouvée" : "Page Not Found"}
          errorMessage={
            locale === "fr"
              ? "Cette catégorie n'existe pas."
              : "Category not found."
          }
        >
          <AlertCircle size={40} strokeWidth={1.5} />
        </ErrorComponent>
      </div>
    );
  }

  // 2. Identify the base Post Type
  let wpPostType: any = "posts";
  const identifier = context.taxonomy || slug;

  
  if (
    identifier.includes("extraction") ||
    identifier === "industries-resources"
  )
  wpPostType = "extraction";
  else if (identifier.includes("asint")) wpPostType = "asint";
  else if (identifier.includes("guinea-intel")) wpPostType = "guinea_intel";
  else if (identifier.includes("innovation")) wpPostType = "innovation";
  else if (identifier.includes("transverse")) wpPostType = "transverse";
  
  // 3. Create a dynamic query parameter
  const queryParams: any = {
    per_page: 100,
    lang: locale,
  };

  // If we have a categoryId, filter by it. If null (top-level), it fetches everything.
  if (context.categoryId && context.taxonomy) {
    queryParams[context.taxonomy] = context.categoryId;
  }

  const allArticles = await fetchPostsByType(wpPostType, queryParams);

  // Figure out the base path for non-query routing
  const rootCategorySlug = context.taxonomy
    ? context.taxonomy.replace("-categories", "").replace("-category", "")
    : slug;
  const basePath = `/${locale}/${wpPostType === "guinea_intel" ? "guinea-intel" : wpPostType === "extraction" ? "industries-resources" : wpPostType}`;

  if (!allArticles?.length) {
    return (
      <div className="flex flex-col mx-10 border-sub-side">
        <SharedHeader
          title={context.title}
          locale={locale}
          activeCategory={slug}
          context={context}
          isQueryRouting={false} // Tells header to use /slug
          basePath={basePath}
          rootCategorySlug={rootCategorySlug}
        />
        <EmptyFull lang={locale} />
      </div>
    );
  }

  const cleanArticles = normalizePosts(allArticles, wpPostType);
  // 4. Slice data safely

  const heroPosts = cleanArticles.slice(0, 6);
  // const cyberPosts = hasArticles ? cleanArticles.slice(3, 6) : [];
  const morePosts = cleanArticles.slice(6, 11);
  const opinionPosts = cleanArticles.slice(12, 20);
  // const greatReadsPosts = hasArticles ? cleanArticles.slice(16, 24) : [];
  const featuredPosts = cleanArticles.slice(21, 28);
  const gridPosts = cleanArticles.slice(28, 35);
  const morePosts2 = cleanArticles.slice(35, 40);
  const gridPosts2 = cleanArticles.slice(40, 47);


    console.log("POST URL", cleanArticles[0].postUrl);

  return (
    <main className="mx-2 border-sub-side lg:mx-10 relative overflow-hidden 2xl:mx-auto">
      <SharedHeader
        title={context.title}
        locale={locale}
        activeCategory={slug}
        context={context}
        isQueryRouting={false} // Tells header to use /slug
        basePath={basePath}
        rootCategorySlug={rootCategorySlug}
      />

      <HeroSection site={wpPostType} posts={heroPosts} />
      {/* <Hero site={site} posts={heroPosts} /> */}

      <section className="flex justify-center ">
        <div className="w-[85%] lg:h-[20em] rounded-2xl overflow-hidden relative">
          <AdDisplayLandscape />
        </div>
      </section>

      <div className="w-full flex">
        <div className="lg:w-[70%] w-full">
          <MorePosts lang={locale} posts={morePosts} site={wpPostType} />
          <ThresholdOpinions
            site={wpPostType}
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

      <FeaturedSection
        sectionTitle="Featured"
        posts={featuredPosts}
        site={wpPostType}
      />
      <GridPosts site={wpPostType} gridPosts={gridPosts} />
      <HeroSection site={wpPostType} posts={morePosts2} />
      <GridPosts site={wpPostType} gridPosts={gridPosts2} />
    </main>
  );
}
