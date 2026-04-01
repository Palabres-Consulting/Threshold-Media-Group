import { TranslationSchema } from "./locale/i18n/schema";



export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-&]+/g, '')      // Remove special chars but keep & and -
    .replace(/\-\-+/g, '-');        // Replace multiple hyphens with a single one
};

// 1. Define what a "Slugified" version of your data looks like
interface SlugifiedCategory {
  title: string;
  slug: string;
  // If the nesting continues, we use the extended type recursively
  categories: Array<{
    title: string;
    slug: string;
    subcategories: Array<{
      title: string;
      slug: string;
    }>;
  }>;
}

// 2. Apply the types to your function
export const CategoriesMap = (
  categories: TranslationSchema["main"]["nav"]["categories"]
): SlugifiedCategory[] => { // Explicitly define the return type here
return categories.map((topLevel: TranslationSchema["main"]["nav"]["categories"][number]) => ({
    ...topLevel,
    slug: slugify(topLevel.title),
    categories: topLevel.categories.map((subCat: TranslationSchema["main"]["nav"]["categories"][number]["categories"][number]) => ({
        ...subCat,
        slug: slugify(subCat.title),
        subcategories: subCat.subcategories ? subCat.subcategories.map((item: string) => ({
            title: item,
            slug: slugify(item)
        })) : []
    }))
})) as SlugifiedCategory[];
};



/**
 * Searches for a category or top-level group by its slug.
 * Works for "Innovation & Data" (top-level) or "Fintech & Digital Banking" (second-level).
 */
export const findCategoryBySlug = (
  navMap: SlugifiedCategory[], 
  targetSlug: string
) => {
  for (const topLevel of navMap) {
    // 1. Check if the top-level itself is the match (e.g., "innovation-&-data")
    if (topLevel.slug === targetSlug) {
      return topLevel;
    }

    // 2. Search inside the nested categories (e.g., "fintech-&-digital-banking")
    const foundSub = topLevel.categories.find(cat => cat.slug === targetSlug);
    
    if (foundSub) {
      return foundSub;
    }
  }

  return null; // Return null if no match is found
};

// Usage:
// const navMap = generateNavMap(dict.nav.categories);
// console.log(navMap[1].categories[0].slug); 


// lib/constants.ts

export const CATEGORY_MAP = {
  main: {
    transverse: {
      taxonomy: "transverse-categories",
      slug: "transverse",
      categories: {
        briefings: { id: 111, slug: "briefings-de-direction" },
        cartographieSectorielle: { id: 113, slug: "cartographie-sectorielle" },
        guineaMeansBusiness: { id: 109, slug: "guinea-means-business" },
        oneCityOneQuarter: { id: 110, slug: "one-city-one-quarter" },
        portraitsDecideurs: { id: 108, slug: "portraits-de-decideurs" },
        webinaires: { id: 112, slug: "webinaires-strategiques" },
      }
    },
    innovation: {
      taxonomy: "innovation-categories",
      slug: "innovation",
      categories: {
        dataInnovation: { id: 96, slug: "data-innovation-ia" },
        iaAlgo: { id: 97, slug: "algorithmes-daide-a-la-decision-et-automatisation-de-lintelligence" },
        analyseOsint: { id: 98, slug: "analyse-osint" },
        analyseWeb: { id: 99, slug: "analyse-des-sources-ouvertes-et-signaux-faibles-du-web" },
        fintech: { id: 100, slug: "fintech-digital-banking" },
        inclusionFinanciere: { id: 101, slug: "inclusion-financiere" },
        servicesMobiles: { id: 102, slug: "services-mobiles" },
        monnaiesNumeriques: { id: 103, slug: "monnaies-numeriques" },
        souveraineteNumerique: { id: 104, slug: "souverainete-numerique" },
        dataCenters: { id: 105, slug: "data-centers" },
        connectivite: { id: 106, slug: "connectivite-regionale" },
        cybersecurite: { id: 107, slug: "cybersecurite" },
      }
    }
  },

  asint: {
    taxonomy: "asint-categories",
    slug: "asint",
    categories: {
      financeInstitutions: { id: 49, slug: "finance-institutions" },
      banques: { id: 114, slug: "banques" },
      assurances: { id: 115, slug: "assurances" },
      banqueCentrale: { id: 116, slug: "banque-centrale-et-regulations-monetaires" },
      strategieMacro: { id: 50, slug: "strategiemacro" },
      pib: { id: 117, slug: "pib" },
      inflation: { id: 118, slug: "inflation" },
      detteSouveraine: { id: 119, slug: "dette-souveraine" },
      indiceCroissance: { id: 120, slug: "indice-croissance" },
      geopolitiqueRisques: { id: 51, slug: "geopolitiquerisques" },
      diplomatie: { id: 121, slug: "diplomatie" },
      stabiliteRegionale: { id: 122, slug: "stabilite-regionale-cedeao-aes" },
      risquesSecuritaires: { id: 123, slug: "risques-securitaires" },
      cadreLegal: { id: 52, slug: "cadrelegalohada" },
      droitAffaires: { id: 124, slug: "droit-des-affaires" },
      reformesFiscales: { id: 125, slug: "reformes-fiscales" },
      climatInvestissements: { id: 126, slug: "climat-des-investissements" },
      ppp: { id: 53, slug: "partenariatspublic-prive" },
      concessions: { id: 127, slug: "concessions" },
      contratsEtat: { id: 128, slug: "contrats-detat" },
      investissementsMixte: { id: 129, slug: "investissements-mixtes-ppp" },
      commerceDouanes: { id: 54, slug: "commercedouanes" },
      corridorsCommerciaux: { id: 130, slug: "corridors-commerciaux" },
      tarifsDouaniers: { id: 131, slug: "tarifs-douaniers" },
      libreEchange: { id: 132, slug: "accords-de-libre-echange" },
      agrobusiness: { id: 133, slug: "agrobusiness-terre" },
      agricultureIndustrielle: { id: 134, slug: "agriculture-industrielle" },
      foncierAgricole: { id: 135, slug: "foncier-et-chaines-de-valeur-agricoles" },
    }
  },

  extraction: {
    taxonomy: "extraction-category",
    slug: "industries-resources",
    categories: {
      simandou2040: { id: 45, slug: "simandou2040" },
      infrastructures: { id: 57, slug: "infrastructures" },
      rail: { id: 58, slug: "rail" },
      port: { id: 59, slug: "port" },
      etapesProjet: { id: 60, slug: "etapesduprojet" },
      souveraineteRessources: { id: 46, slug: "souveraineteressources" },
      mines: { id: 64, slug: "mines" },
      strategieEtat: { id: 70, slug: "strategiedeetat" },
      fer: { id: 62, slug: "fer" },
      bauxite: { id: 65, slug: "bauxite" },
      or: { id: 66, slug: "or" },
      hydrocarbures: { id: 71, slug: "hydrocarbures" },
      cartographieMiniere: { id: 67, slug: "cartographieminiere" },
      sig: { id: 68, slug: "sig" },
      permisMiniers: { id: 69, slug: "permisminiers" },
      localisationGisements: { id: 74, slug: "localisationdesgisements" }, // Added
      infraCarto: { id: 79, slug: "infrastructures-cartographieminiere" }, // Added
      logistiqueInfrastructures: { id: 72, slug: "logistiqueinfrastructures" },
      cheminsDeFer: { id: 73, slug: "cheminsdefer" },
      portsEauxProfondes: { id: 74, slug: "portseneauxprofondes" }, // Added
      corridorsTransport: { id: 75, slug: "corridorsdetransport" }, // Added
      logistique: { id: 76, slug: "logistique" }, // Added
      contenuLocalEsg: { id: 76, slug: "contenulocalesg" },
      emploi: { id: 77, slug: "emploi" },
      sousTraitance: { id: 78, slug: "sous-traitancenational" }, // Added
      impactEnvironnemental: { id: 79, slug: "impactenvironnemental" }, // Added
      energieIndustrie: { id: 80, slug: "energieindustrie" },
      mixEnergetique: { id: 81, slug: "mixenergetique" },
      barrages: { id: 82, slug: "barragesetalimentation" },
      sitesIndustriels: { id: 83, slug: "sitesindustriels" }, // Added
    }
  },

  guineaIntel: {
    taxonomy: "guinea-intel-categories",
    slug: "guinea-intel",
    categories: {
      appelsOffres: { id: 84, slug: "appelsdoffres" },
      monitoringTempsReel: { id: 85, slug: "monitoringentempsreel" },
      marchesPublics: { id: 86, slug: "marchespublicsetprives" },
      guideInvestisseur: { id: 87, slug: "guidedelinvestisseur" },
      formalites: { id: 88, slug: "formalitesadministratives" },
      fiscalite: { id: 89, slug: "fiscalitelocale" },
      zonesEconomiques: { id: 90, slug: "zoneseconomiques" },
      stakeholders: { id: 91, slug: "annuairedesstakeholders" },
      decideurs: { id: 92, slug: "cartographiedesdecideurs" },
      acteursPublicPrive: { id: 93, slug: "acteursclesdusecteurpublicprive" },
      monitoringEtat: { id: 94, slug: "monitoringdeprojetsdetat" },
      suiviGrandsChantiers: { id: 95, slug: "suivi-operationnel-des-grands-chantiers-gouvernementaux" },
    }
  },
} as const;


// Recursive function to find all objects with a 'slug' key
export const getAllSlugs = (obj: any): any[] => {
  let results: any[] = [];
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // If this object has a slug, add it to our list
      if (obj[key].slug) {
        results.push(obj[key]);
      }
      // Continue searching deeper
      results = results.concat(getAllSlugs(obj[key]));
    }
  }
  return results;
};