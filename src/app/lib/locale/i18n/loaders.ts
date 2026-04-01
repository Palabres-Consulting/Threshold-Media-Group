
import type { TranslationSchema } from "./schema";
import { Locale } from "./types";


type NamespaceLoaders = {
  [K in keyof TranslationSchema]: Record<
    Locale,
    () => Promise<{ default: TranslationSchema[K] }>
  >;
};

export const namespaceLoaders: NamespaceLoaders = {
  asint: {
    en: () => import("../asint/en.json"),
    fr: () => import("../asint/fr.json"),
  },
  extraction: {
    en: () => import("../extraction/en.json"),
    fr: () => import("../extraction/fr.json"),
  },
  main: {
    en: () => import("../main/en.json"),
    fr: () => import("../main/fr.json"),
  },
 
};
