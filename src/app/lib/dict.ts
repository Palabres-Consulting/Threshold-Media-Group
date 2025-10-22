import "server-only";

const dictionaries = {
  main: {
    en: () => import("@/app/lib/locale/main/en.json").then((m) => m.default),
    fr: () => import("@/app/lib/locale/main/fr.json").then((m) => m.default),
  },
  extraction: {
    en: () =>
      import("@/app/lib/locale/extraction/en.json").then((m) => m.default),
    fr: () =>
      import("@/app/lib/locale/extraction/fr.json").then((m) => m.default),
  },
  asint: {
    en: () => import("@/app/lib/locale/asint/en.json").then((m) => m.default),
    fr: () => import("@/app/lib/locale/asint/fr.json").then((m) => m.default),
  },
};

export const getDictionary = async (
  site: keyof typeof dictionaries,
  locale: string
) => {
  // normalize locale ("en-US" -> "en")
  const normalizedLocale = locale.slice(0, 2).toLowerCase() as "en" | "fr";

  const siteDictionaries = dictionaries[site];

  if (!siteDictionaries) {
    console.warn(`Site "${site}" not supported, falling back to "main/en"`);
    return await dictionaries.main.en();
  }

  const loader = siteDictionaries[normalizedLocale];
  if (!loader) {
    console.warn(
      `Locale "${locale}" not supported for site "${site}", falling back to "en"`
    );
    return await siteDictionaries.en();
  }

  return await loader();
};
