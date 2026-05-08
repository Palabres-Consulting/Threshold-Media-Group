

import asintEn from "./asint/en.json";
import asintFr from "./asint/fr.json";

import extractionEn from "./extraction/en.json";
import extractionFr from "./extraction/fr.json";

import mainEn from "./main/en.json";
import mainFr from "./main/fr.json";



export const en = {   asint: asintEn, extraction: extractionEn, main: mainEn} as const;
export type TranslationSchema = typeof en;

// ✅ enforce FR matches EN
export const fr: TranslationSchema = { asint: asintFr, extraction: extractionFr, main: mainFr };
