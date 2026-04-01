
import asintEn from "./asint/en.json";

import extractionEn from "./extraction/en.json";

import mainEn from "./main/en.json";



export const enSchema = {
  asint: asintEn,
  extraction: extractionEn,
  main: mainEn
};

export type TranslationSchema = typeof enSchema;
