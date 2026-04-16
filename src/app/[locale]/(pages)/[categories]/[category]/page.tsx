import EmptyState from "@/app/[locale]/_components/ui/empty";
import { ErrorComponent } from "@/app/[locale]/error";
import { CATEGORY_MAP, getAllSlugs } from "@/app/lib/categoriesMap";
import { fetchTopLevelCategories } from "@/app/lib/fetchLib";
import { getTranslations } from "@/app/lib/locale/i18n/getTranslations";
import { AlertCircle } from "lucide-react";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ locale: "en" | "fr"; category: string }>;
}) => {
  const { locale, category: slug} = await params;

  // 1. Validation Logic: Check if the slug exists in our Map
  const allCategories = getAllSlugs(CATEGORY_MAP);

  // 2. Find the match
  const currentCategory = allCategories.find((cat) => cat.slug === slug);

  // 3. Get the category title from translations
  let categoryTitle = slug.replace(/-/g, " ");
  if (currentCategory) {
    const {main: translations} = getTranslations(locale);
    const allTranslationCategories = translations.nav.categories;

    // Search through all categories to find the title that matches the slug
    let found = false;
    for (const topLevel of allTranslationCategories) {
      if (topLevel.slug === slug) {
        categoryTitle = topLevel.title;
        found = true;
        break;
      }
      for (const subCat of topLevel.categories) {
        if (subCat.slug === slug) {
          categoryTitle = subCat.title;
          found = true;
          break;
        }
        for (const subSubCat of subCat.subcategories) {
          if (subSubCat.slug === slug) {
            categoryTitle = subSubCat.title;
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (found) break;
    }
  }

  // 2. Return Error Component if not found
  if (!currentCategory) {
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
          {/* Pass the icon here as a child */}
          <AlertCircle size={40} strokeWidth={1.5} />
        </ErrorComponent>
      </div>
    );
  }
  // 3. If valid, proceed with fetch
  // const toplevelCategories = await fetchTopLevelCategories(
  //   "extraction_categories",
  //   {
  //     lang: locale,
  //     per_page: 100,
  //   },
  // );

  return (
    <div className="bg-[var(--background)] min-h-screen text-[var(--foreground)]">
      <div className="container mx-auto px-4 py-10">
        <header className="mb-12 border-b border-[var(--foreground)]/10 pb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            {categoryTitle}
          </h1>
        </header>

        {/* Empty State Call */}
        <EmptyState locale={locale} />
      </div>
    </div>
  );
};

export default CategoryPage;
