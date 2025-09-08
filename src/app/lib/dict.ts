import "server-only";

const dictionaries = {
  en: () => import("./locale/en.json").then((module) => module.default),
  fr: () => import("./locale/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  // Normalize: take only the first 2 letters
  const normalizedLocale = locale.slice(0, 2).toLowerCase();

  if (!dictionaries[normalizedLocale as keyof typeof dictionaries]) {
    console.warn(`Locale "${locale}" not supported, falling back to "en"`);
    return await dictionaries.en();
  }

  const dict = await dictionaries[
    normalizedLocale as keyof typeof dictionaries
  ]();
  return dict;
};
