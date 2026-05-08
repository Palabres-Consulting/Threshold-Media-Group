import { namespaceLoaders } from "./loaders";
import { TranslationSchema } from "./schema";

export async function loadNamespaces<
  T extends keyof TranslationSchema, 
  L extends "en" | "fr"
>(locale: L, namespaces: T[]) {
  const resultEntries = await Promise.all(
    namespaces.map(async (ns) => {
      const mod = await namespaceLoaders[ns][locale]();
      return [ns, mod.default] as const;
    })
  );
  return Object.fromEntries(resultEntries) as Pick<TranslationSchema, T>;
}
