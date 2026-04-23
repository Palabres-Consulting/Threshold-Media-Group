import EmptyFull from "@/app/[locale]/_components/ui/emptyFull";
import { ErrorComponent } from "@/app/[locale]/error";
import { AlertCircle } from "lucide-react";
import { getTranslations } from "@/app/lib/locale/i18n/getTranslations";
import { getCategoryContext } from "@/app/lib/categoriesMap";
import { fetchPostsByType } from "@/app/lib/fetchLib";
import SharedHeader from "./sharedHeader";

// Import your sections
import Hero from "../PostDisplaySections/hero";
import CyberSecurityPosts from "../PostDisplaySections/cyberSecurityPosts";
import MorePosts from "../PostDisplaySections/morePosts";
import ThresholdOpinions from "../PostDisplaySections/thresholdOpinions";
import GreatReads from "../PostDisplaySections/greatReads";
import Sidebar from "../PostDisplaySections/sidebar";

interface SharedCategoryLayoutProps {
  locale: "en" | "fr";
  slug: string;
}

export default async function SharedCategoryLayout({ locale, slug }: SharedCategoryLayoutProps) {
  const { main: dict } = getTranslations(locale);
  const navTranslations = dict.nav.categories;

  // 1. Get the Bloomberg Context & WP ID
  const context = getCategoryContext(slug, navTranslations, locale);

  if (!context) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <ErrorComponent
          errorTitle={locale === "fr" ? "Page non trouvée" : "Page Not Found"}
          errorMessage={locale === "fr" ? "Cette catégorie n'existe pas." : "Category not found."}
        >
          <AlertCircle size={40} strokeWidth={1.5} />
        </ErrorComponent>
      </div>
    );
  }

  // 2. Identify the base Post Type
  let wpPostType: any = "posts";
  const identifier = context.taxonomy || slug;
  
  if (identifier.includes("extraction") || identifier === "industries-resources") wpPostType = "extraction";
  else if (identifier.includes("asint")) wpPostType = "asint";
  else if (identifier.includes("guinea-intel")) wpPostType = "guinea_intel";
  else if (identifier.includes("innovation")) wpPostType = "innovation";
  else if (identifier.includes("transverse")) wpPostType = "transverse";
  
  // 3. Create a dynamic query parameter
  const queryParams: any = {
    per_page: 15,
    lang: locale,
  };
  
  // If we have a categoryId, filter by it. If null (top-level), it fetches everything.
  if (context.categoryId && context.taxonomy) {
    queryParams[context.taxonomy] = context.categoryId;
  }

  const allArticles = await fetchPostsByType(wpPostType, queryParams);

  // Figure out the base path for non-query routing
  const rootCategorySlug = context.taxonomy ? context.taxonomy.replace("-categories", "").replace("-category", "") : slug;
  const basePath = `/${locale}/${wpPostType === 'guinea_intel' ? 'guinea-intel' : wpPostType === 'extraction' ? 'industries-resources' : wpPostType}`;

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

  // 4. Slice the data for the sections
  const heroPosts = allArticles.slice(0, 3);
  const cyberPosts = allArticles.slice(3, 6);
  const morePosts = allArticles.slice(6, 11);

  return (
    <main className="lg:mx-10 mx-2 border-sub-side relative">
      
      <SharedHeader 
        title={context.title}
        locale={locale}
        activeCategory={slug}
        context={context}
        isQueryRouting={false} // Tells header to use /slug
        basePath={basePath}
        rootCategorySlug={rootCategorySlug}
      />

      <Hero site={wpPostType} posts={heroPosts} />
      <CyberSecurityPosts site={wpPostType} posts={cyberPosts} />

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
}