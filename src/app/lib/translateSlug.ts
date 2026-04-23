// src/app/lib/translateSlug.ts

// Adjust these imports to point to your actual en.json and fr.json files
import enDict from "@/app/lib/locale/main/en.json"; 
import frDict from "@/app/lib/locale/main/fr.json";

export const getTranslatedSlug = (
  slug: string, 
  currentLocale: string, 
  targetLocale: string
) => {
  // 1. Determine which dictionary to search from and which to search to
  const sourceNav = currentLocale === "en" ? enDict.nav.categories : frDict.nav.categories;
  const targetNav = targetLocale === "en" ? enDict.nav.categories : frDict.nav.categories;

  let targetEnId: number | null = null;
  let targetFrId: number | null = null;

  // 2. Find the IDs of the current slug in the source dictionary
  const findIds = () => {
    for (const section of sourceNav) {
      for (const cat of section.categories) {
        if (cat.slug === slug) {
          targetEnId = cat.en_id;
          targetFrId = cat.fr_id;
          return;
        }
        if (cat.subcategories) {
          for (const sub of cat.subcategories) {
            if (sub.slug === slug) {
              targetEnId = sub.en_id;
              targetFrId = sub.fr_id;
              return;
            }
          }
        }
      }
    }
  };

  findIds();

  // If we didn't find IDs (e.g., if both are null, or it's a standard page like 'about'), return the original slug
  if (targetEnId === null && targetFrId === null) return slug;

  // 3. Find the matching slug in the target dictionary using the IDs
  let translatedSlug = slug;
  const findTargetSlug = () => {
    for (const section of targetNav) {
      for (const cat of section.categories) {
        if (cat.en_id === targetEnId && cat.fr_id === targetFrId) {
          translatedSlug = cat.slug;
          return;
        }
        if (cat.subcategories) {
          for (const sub of cat.subcategories) {
            if (sub.en_id === targetEnId && sub.fr_id === targetFrId) {
              translatedSlug = sub.slug;
              return;
            }
          }
        }
      }
    }
  };

  findTargetSlug();
  
  return translatedSlug;
};