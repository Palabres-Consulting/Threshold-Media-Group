import SharedCategoryLayout from "@/app/[locale]/_components/categories/sharedCategoryLayout";

const SubCategoryPage = async ({
  params,
}: {
  params: Promise<{ locale: "en" | "fr"; category: string }>;
}) => {
  const { locale, category: slug } = await params;

  return <SharedCategoryLayout locale={locale} slug={slug} />;
};

export default SubCategoryPage;
