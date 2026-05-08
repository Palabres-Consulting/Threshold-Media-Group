import { TranslationSchema, en, fr } from "../index";

export function getTranslations<T extends keyof TranslationSchema>(
  locale: string,
  namespaces?: T[]
): Pick<TranslationSchema, T> | TranslationSchema {
  const dict = locale === "fr" ? fr : en;

  if (!namespaces) return dict;

  return namespaces.reduce((acc, ns) => {
    acc[ns] = dict[ns];
    return acc;
  }, {} as Pick<TranslationSchema, T>);
}
