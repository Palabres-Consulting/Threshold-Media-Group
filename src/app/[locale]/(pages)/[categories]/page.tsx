import SharedCategoryLayout from "@/components/categories/sharedCategoryLayout";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ locale: "en" | "fr"; categories: string }>;
}) => {
  const { locale, categories: slug } = await params;

  return <SharedCategoryLayout locale={locale} slug={slug} />;
};

export default CategoryPage;