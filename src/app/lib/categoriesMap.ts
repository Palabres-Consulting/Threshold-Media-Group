import { Post } from "../types/apiResponse";
import { TranslationSchema } from "./locale/i18n/schema";

export const slugify = (text: string) => {
  if (typeof text !== "string") {
    text = String(text || "");
  }
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-&]+/g, "") // Remove special chars but keep & and -
    .replace(/\-\-+/g, "-"); // Replace multiple hyphens with a single one
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
  categories: TranslationSchema["main"]["nav"]["categories"],
): SlugifiedCategory[] => {
  // Explicitly define the return type here
  return categories.map(
    (topLevel: TranslationSchema["main"]["nav"]["categories"][number]) => ({
      ...topLevel,
      slug: (topLevel as any).slug || slugify(topLevel.title),
      categories: topLevel.categories.map(
        (
          subCat: TranslationSchema["main"]["nav"]["categories"][number]["categories"][number],
        ) => ({
          ...subCat,
          slug: (subCat as any).slug || slugify(subCat.title),
          subcategories: subCat.subcategories
            ? subCat.subcategories.map((item: any) => {
                const itemTitle = typeof item === "string" ? item : item?.title || "";
                return {
                  ...(typeof item === "object" ? item : {}),
                  title: itemTitle,
                  slug: item?.slug || slugify(itemTitle),
                };
              })
            : [],
        }),
      ),
    }),
  ) as SlugifiedCategory[];
};

/**
 * Searches for a category or top-level group by its slug.
 * Works for "Innovation & Data" (top-level) or "Fintech & Digital Banking" (second-level).
 */
export const findCategoryBySlug = (
  navMap: SlugifiedCategory[],
  targetSlug: string,
) => {
  for (const topLevel of navMap) {
    // 1. Check if the top-level itself is the match (e.g., "innovation-&-data")
    if (topLevel.slug === targetSlug) {
      return topLevel;
    }

    // 2. Search inside the nested categories (e.g., "fintech-&-digital-banking")
    const foundSub = topLevel.categories.find((cat) => cat.slug === targetSlug);

    if (foundSub) {
      return foundSub;
    }
  }

  return null; // Return null if no match is found
};


export const CATEGORY_MAP = {
  transverse: {
    taxonomy: "transverse-categories",
    slug: "transverse",
    categories: {
      briefingsDeDirectionFr: {
        id: 433,
        slug: "briefings-de-direction",
        children: {
          rapportsDeSynthese: { id: 438, slug: "rapports-de-synthese-exclusifs-pour-les-abonnes-entreprise" },
        },
      },
      cartographieSectorielleFr: {
        id: 451,
        slug: "cartographie-sectorielle",
        children: {
          datavisualisationGraphiques: { id: 456, slug: "datavisualisation-et-graphiques-danalyse-de-marche" },
        },
      },
      decisionMakerPortraitsEn: {
        id: 417,
        slug: "decision-maker-portraits",
        children: {
          guineaMeansBusinessSeries: { id: 422, slug: "guinea-means-business-series-trajectories-of-economic-leaders" },
        },
      },
      executiveBriefingsEn: {
        id: 435,
        slug: "executive-briefings",
        children: {
          exclusiveSummaryReports: { id: 440, slug: "exclusive-summary-reports-for-enterprise-subscribers" },
        },
      },
      oneCityOneQuarter: {
        id: 424,
        slug: "one-city-one-quarter",
        children: {
          evenementsPhysiquesTrimestriels: { id: 428, slug: "evenements-physiques-trimestriels-et-rapports-de-networking" },
          quarterlyPhysicalEvents: { id: 430, slug: "quarterly-physical-events-and-networking-reports" },
        },
      },
      portraitsDeDecideursFr: {
        id: 415,
        slug: "portraits-de-decideurs",
        children: {
          serieGuineaMeansBusiness: { id: 420, slug: "serie-guinea-means-business-trajectoires-des-leaders-de-leconomie" },
        },
      },
      sectoralMappingEn: {
        id: 453,
        slug: "sectoral-mapping",
        children: {
          dataVisualizationCharts: { id: 458, slug: "data-visualization-and-market-analysis-charts" },
        },
      },
      strategicWebinarsEn: {
        id: 444,
        slug: "strategic-webinars",
        children: {
          onlineConferences: { id: 449, slug: "online-conferences-and-digital-extensions-of-meetings" },
        },
      },
      webinairesStrategiquesFr: {
        id: 442,
        slug: "webinaires-strategiques",
        children: {
          conferencesEnLigne: { id: 447, slug: "conferences-en-ligne-et-extensions-digitales-des-rencontres" },
        },
      },
    },
  },

  innovation: {
    taxonomy: "innovation-categories",
    slug: "innovation",
    categories: {
      analyseOsintFr: {
        id: 469,
        slug: "analyse-osint",
        children: {
          analyseSourcesOuvertes: { id: 474, slug: "analyse-des-sources-ouvertes-et-signaux-faibles-du-web" },
        },
      },
      dataInnovationAiEn: {
        id: 462,
        slug: "data-innovation-ai",
        children: {
          decisionSupportAlgorithms: { id: 467, slug: "decision-support-algorithms-and-intelligence-automation" },
        },
      },
      dataInnovationIaFr: {
        id: 460,
        slug: "data-innovation-ia",
        children: {
          algorithmesAideDecision: { id: 465, slug: "algorithmes-daide-a-la-decision-et-automatisation-de-lintelligence" },
        },
      },
      digitalSovereigntyEn: {
        id: 494,
        slug: "digital-sovereignty",
        children: {
          dataCenters: { id: 499, slug: "data-centers-digital-sovereignty" },
          regionalConnectivityCybersecurity: { id: 503, slug: "regional-connectivity-and-cybersecurity" },
        },
      },
      fintechDigitalBanking: {
        id: 478,
        slug: "fintech-digital-banking",
        children: {
          financialInclusion: { id: 484, slug: "financial-inclusion" },
          inclusionFinanciere: { id: 482, slug: "inclusion-financiere" },
          mobileServicesDigitalCurrencies: { id: 489, slug: "mobile-services-and-digital-currencies" },
          servicesMobilesMonnaiesNumeriques: { id: 487, slug: "services-mobiles-et-monnaies-numeriques" },
        },
      },
      osintAnalysisEn: {
        id: 471,
        slug: "osint-analysis",
        children: {
          analysisOpenSources: { id: 476, slug: "analysis-of-open-sources-and-weak-web-signals" },
        },
      },
      souveraineteNumeriqueFr: {
        id: 492,
        slug: "souverainete-numerique",
        children: {
          connectiviteRegionaleCybersecurite: { id: 501, slug: "connectivite-regionale-et-cybersecurite" },
          dataCenters: { id: 497, slug: "data-centers" },
        },
      },
    },
  },

  extraction: {
    taxonomy: "extraction-category",
    slug: "industries-resources", 
    categories: {
      cartographieMiniereFr: {
        id: 67,
        slug: "cartographieminiere-fr",
        children: {
          infrastructures: { id: 71, slug: "infrastructures-minerie-fr" },
          localisationGisements: { id: 70, slug: "localisationdesgisements-fr-fr" },
          sig: { id: 68, slug: "sig-fr" },
        },
      },
      contenuLocalEsgFr: {
        id: 76,
        slug: "contenulocalesg-fr",
        children: {
          emploi: { id: 77, slug: "emploi-fr-fr" },
          impactEnvironnemental: { id: 78, slug: "impactenvironnemental-fr-fr" },
          sousTraitanceNational: { id: 79, slug: "sous-traitancenational-fr-fr" },
        },
      },
      criticalMinerals: {
        id: 511,
        slug: "critical-minerals",
      },
      energieIndustrieFr: {
        id: 80,
        slug: "energieindustrie-fr",
        children: {
          barragesAlimentation: { id: 82, slug: "barrages-et-alimentation-fr" },
          mixEnergetique: { id: 81, slug: "mixenergetique-fr" },
          sitesIndustriels: { id: 83, slug: "sitesindustriels-fr" },
        },
      },
      localContentEsgEn: {
        id: 274,
        slug: "local-content-esg",
        children: {
          employment: { id: 276, slug: "employment" },
          environmentalImpact: { id: 280, slug: "environmental-impact" },
          nationalSubcontracting: { id: 296, slug: "national-subcontracting" },
        },
      },
      logisticsInfrastructureEn: {
        id: 190,
        slug: "logistics-infrastructure",
        children: {
          cheminsDeFerPortsCorridors: { id: 517, slug: "chemins-de-fer-ports-en-eaux-profondes-et-corridors-de-transport" },
          deepWaterPort: { id: 192, slug: "deep-water-port" },
          railways: { id: 264, slug: "railways" },
          transportCorridors: { id: 267, slug: "transport-corridors" },
        },
      },
      logistiqueInfrastructuresFr: {
        id: 72,
        slug: "logistiqueinfrastructures-fr",
        children: {
          cheminsDeFer: { id: 73, slug: "cheminsdefer-fr" },
          corridorsDeTransport: { id: 75, slug: "corridorsdetransport-fr" },
          portsEauxProfondes: { id: 74, slug: "portseneauxprofondes-fr" },
        },
      },
      metauxTransitionFr: {
        id: 304,
        slug: "metaux-de-la-transition",
        children: {
          cobaltMetauxStrategiques: { id: 306, slug: "cobalt-et-metaux-strategiques" },
          lithium: { id: 308, slug: "lithium-fr" },
        },
      },
      mining: {
        id: 136,
        slug: "mining",
      },
      miningMappingEn: {
        id: 272,
        slug: "mining-mapping",
        children: {
          infrastructures: { id: 282, slug: "mining-infrastructures" },
          locationOfDeposits: { id: 278, slug: "location-of-deposits" },
          miningPermits: { id: 284, slug: "mining-permits" },
          sig: { id: 288, slug: "sig-en" },
        },
      },
      powerIndustryEn: {
        id: 138,
        slug: "power-and-industry",
        children: {
          damsWaterSupply: { id: 254, slug: "dams-and-water-supply" },
          energyMix: { id: 258, slug: "energy-mix" },
          industrialSites: { id: 261, slug: "industrial-sites" },
        },
      },
      resourcesSovereigntyEn: {
        id: 505,
        slug: "resources-sovereignty",
      },
      simandou2040En: {
        id: 45,
        slug: "simandou2040-en",
        children: {
          etapesDuProjet: { id: 60, slug: "etapesduprojet" },
          infrastructures: { id: 166, slug: "infrastructure" },
          logisticsCorridor: { id: 170, slug: "logistics-corridor" },
          logistique: { id: 59, slug: "logistique" },
          port: { id: 168, slug: "port" },
          projectStages: { id: 172, slug: "project-stages" },
          rail: { id: 56, slug: "rail-en" },
        },
      },
      simandou2040Fr: {
        id: 286,
        slug: "simandou2040-fr",
        children: {
          corridorLogistique: { id: 58, slug: "corridor-fr" },
          etapesDuProjet: { id: 291, slug: "etapes-du-projet" },
          infrastructures: { id: 298, slug: "infrastructures-fr" },
          port: { id: 57, slug: "port-fr" },
          rail: { id: 293, slug: "rail-fr" },
        },
      },
      souveraineteRessourcesFr: {
        id: 46,
        slug: "souveraineteressources-fr",
        children: {
          hydrocarbures: { id: 62, slug: "hydrocarbures-fr" },
          minesBauxite: { id: 314, slug: "mines-bauxite" },
          minesOr: { id: 312, slug: "mines-or" },
          miningFer: { id: 310, slug: "mining-fer" },
          strategieEtat: { id: 63, slug: "strategiedeetat-fr" },
        },
      },
      sovereigntyResourcesEn: {
        id: 174,
        slug: "sovereignty-resources",
        children: {
          bauxite: { id: 178, slug: "bauxite-sovereignty-resources" },
          hydrocarbons: { id: 301, slug: "hydrocarbons" },
          miningIron: { id: 176, slug: "mining-iron" },
          miningGold: { id: 180, slug: "gold" },
          stateStrategy: { id: 182, slug: "state-strategy" },
        },
      },
      transitionMetalsEn: {
        id: 184,
        slug: "transition-metals",
        children: {
          cobaltStrategicMetals: { id: 188, slug: "cobalt-and-strategic-metals" },
          lithium: { id: 186, slug: "lithium" },
        },
      },
    },
  },

  asint: {
    taxonomy: "asint-categories",
    slug: "asint",
    categories: {
      agribusinessLandEn: {
        id: 205,
        slug: "agribusiness-land",
      },
      agrobusinessTerreFr: {
        id: 133,
        slug: "agrobusiness-terre-fr",
      },
      cadreLegalOhadaFr: {
        id: 224,
        slug: "cadre-legal-ohada",
        children: {
          climatDesInvestissements: { id: 681, slug: "climat-des-investissements" },
          droitDesAffaires: { id: 637, slug: "droit-des-affaires" },
          reformesFiscales: { id: 675, slug: "reformes-fiscales" },
        },
      },
      commerceDouanesFr: {
        id: 218,
        slug: "commerce-douanes",
      },
      financeInstitutionsEn: {
        id: 208,
        slug: "finance-and-institutions",
        children: {
          banks: { id: 148, slug: "banks-en" },
          centralBankMonetaryRegulations: { id: 235, slug: "central-bank-and-monetary-regulations" },
          insurance: { id: 152, slug: "insurance-en" },
        },
      },
      financeInstitutionsFr: {
        id: 228,
        slug: "finance-institutions",
        children: {
          assurances: { id: 115, slug: "assurances-fr" },
          banqueCentraleRegulations: { id: 150, slug: "central-bank-bceao-fr" },
          banques: { id: 230, slug: "banques" },
        },
      },
      geopoliticsRiskEn: {
        id: 146,
        slug: "geopolitics-and-risk",
        children: {
          diplomacy: { id: 162, slug: "diplomacy-en" },
          regionalStability: { id: 164, slug: "regional-stability-en" },
        },
      },
      geopolitiqueRisquesFr: {
        id: 51,
        slug: "geopolitiquerisques-fr",
        children: {
          diplomatie: { id: 232, slug: "diplomatie" },
          stabiliteRegionale: { id: 316, slug: "stabilite-regionale" },
        },
      },
      legalRegulatoryEn: {
        id: 212,
        slug: "legal-regulatory",
        children: {
          businessLaw: { id: 673, slug: "business-law" },
          investmentClimate: { id: 679, slug: "investment-climate" },
          taxReforms: { id: 677, slug: "tax-reforms" },
        },
      },
      macroStrategyEn: {
        id: 210,
        slug: "macro-strategy",
        children: {
          gdp: { id: 156, slug: "gdp-en" },
          growthIndex: { id: 160, slug: "growth-index-en" },
          inflation: { id: 158, slug: "inflation-en" },
          sovereignDebt: { id: 154, slug: "sovereign-debt-en" },
        },
      },
      partenariatsPublicPriveFr: {
        id: 222,
        slug: "partenariats-public-prive",
      },
      publicPrivatePartnershipsEn: {
        id: 214,
        slug: "public-private-partnerships",
      },
      strategieMacroFr: {
        id: 226,
        slug: "strategie-macro",
        children: {
          detteSouveraine: { id: 243, slug: "dette-souveraine" },
          gdp: { id: 237, slug: "gdp-fr" },
          indiceCroissance: { id: 239, slug: "indice-croissance" },
          inflation: { id: 241, slug: "inflation-fr" },
        },
      },
      tradeCustomsEn: {
        id: 216,
        slug: "trade-and-customs",
      },
    },
  },

  guineaIntel: {
    taxonomy: "guinea-intel-categories",
    slug: "guinea-intel",
    categories: {
      annuaireStakeholdersFr: {
        id: 393,
        slug: "annuaire-des-stakeholders",
        children: {
          acteursClesPublicPrive: { id: 402, slug: "acteurs-cles-du-secteur-public-prive" },
          cartographieDecideurs: { id: 398, slug: "cartographie-des-decideurs" },
        },
      },
      appelsOffresFr: {
        id: 367,
        slug: "appels-doffres",
        children: {
          marchesPublicsPrives: { id: 376, slug: "marches-publics-et-prives" },
          monitoringTempsReel: { id: 372, slug: "monitoring-en-temps-reel" },
        },
      },
      guideInvestisseurFr: {
        id: 380,
        slug: "guide-de-linvestisseur",
        children: {
          fiscaliteLocaleZonesEconomiques: { id: 389, slug: "fiscalite-locale-et-zones-economiques" },
          formalitesAdministratives: { id: 385, slug: "formalites-administratives" },
        },
      },
      investorsGuideEn: {
        id: 382,
        slug: "investors-guide",
        children: {
          administrativeFormalities: { id: 387, slug: "administrative-formalities" },
          localTaxationEconomicZones: { id: 391, slug: "local-taxation-and-economic-zones" },
        },
      },
      monitoringProjetsEtatFr: {
        id: 406,
        slug: "monitoring-de-projets-detat",
        children: {
          suiviOperationnelGrandsChantiers: { id: 411, slug: "suivi-operationnel-des-grands-chantiers-gouvernementaux" },
        },
      },
      stakeholdersDirectoryEn: {
        id: 395,
        slug: "stakeholders-directory",
        children: {
          keyPublicPrivateActors: { id: 404, slug: "key-public-private-sector-actors" },
          mappingDecisionMakers: { id: 400, slug: "mapping-of-decision-makers" },
        },
      },
      stateProjectTrackerEn: {
        id: 408,
        slug: "state-project-tracker",
        children: {
          operationalTrackingGovernmentProjects: { id: 413, slug: "operational-tracking-of-major-government-projects" },
        },
      },
      tendersProcurementEn: {
        id: 369,
        slug: "tenders-procurement",
        children: {
          publicPrivateContracts: { id: 378, slug: "public-and-private-contracts" },
          realTimeMonitoring: { id: 374, slug: "real-time-monitoring" },
        },
      },
    },
  },
} as const;
// Recursive function to find all objects with a 'slug' key
export const getAllSlugs = (obj: any): any[] => {
  let results: any[] = [];

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
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

/**
 * Extracts the top-level custom category from a WordPress REST API post response.
 * Expects the post object to include the '_embedded' property (fetched with ?_embed).
 */

export function getTopLevelCategory(
  post: Post,
  taxonomyName: string = "category",
) {
  // 1. Flatten the term arrays
  const allTerms = post?._embedded?.["wp:term"]?.flat() || [];

  // Protect against empty arrays to prevent .reduce() from crashing
  if (!allTerms || allTerms.length === 0) {
    return {} as any;
  }

  console.log(allTerms);

  // 2. Filter dynamically based on the passed taxonomyName

  // 4. Fallback: Shortest URL length

  const topCategory = allTerms.reduce((prev, current) => {
    return prev.link.length < current.link.length ? prev : current;
  });

  console.log("Top category:", topCategory);

  return topCategory;
}




export function getCategoryTitleBySlug(slug: string, navCategories: any[]): string {
  // Search through the translation JSON hierarchy
  for (const topLevel of navCategories) {
    if (topLevel.slug === slug) return topLevel.title;
    
    if (topLevel.categories) {
      for (const cat of topLevel.categories) {
        if (cat.slug === slug) return cat.title;
        
        if (cat.subcategories) {
          for (const subCat of cat.subcategories) {
            if (subCat.slug === slug) return subCat.title;
          }
        }
      }
    }
  }
  
  // Fallback if somehow not found in JSON but valid in MAP
  return slug.replace(/-/g, " ");
}




export function getCategoryContext(slug: string, navTranslations: any, locale: "en" | "fr") {
  const idKey = locale === "en" ? "en_id" : "fr_id";

  for (const topSection of navTranslations) {
    
    // SCENARIO 0: The slug matches the Top-Level Post Type 
    if (topSection.slug === slug) {
      return {
        title: topSection.title,
        categoryId: null,
        taxonomy: topSection.taxonomy,
        isParent: true,
        parentLink: null,
        activeLevel2Slug: null,
        navLinks: topSection.categories ? topSection.categories.map((cat: any) => ({
          title: cat.title,
          slug: cat.slug,
        })) : [],
        childLinks: [], // No level 3 here
      };
    }

    for (const parentCat of topSection.categories) {
      // SCENARIO A: The slug matches a Parent Category (Level 2)
      if (parentCat.slug === slug) {
        return {
          title: parentCat.title,
          categoryId: parentCat[idKey],
          taxonomy: topSection.taxonomy,
          isParent: true,
          parentLink: { title: topSection.title, slug: topSection.slug },
          activeLevel2Slug: parentCat.slug, 
          // Return Level 2 Siblings
          navLinks: topSection.categories.map((sibling: any) => ({
            title: sibling.title,
            slug: sibling.slug,
          })),
          // Pass the children separately so we don't lose them
          childLinks: parentCat.subcategories ? parentCat.subcategories.map((sub: any) => ({
            title: sub.title,
            slug: sub.slug,
          })) : [],
        };
      }

      // SCENARIO B: The slug matches a Subcategory (Level 3)
      if (parentCat.subcategories) {
        for (const subCat of parentCat.subcategories) {
          if (subCat.slug === slug) {
            return {
              title: subCat.title,
              categoryId: subCat[idKey],
              taxonomy: topSection.taxonomy,
              isParent: false,
              parentLink: { title: topSection.title, slug: topSection.slug },
              activeLevel2Slug: parentCat.slug, // Tells UI which Level 2 parent is active
              // Keep Level 2 Siblings in the main row
              navLinks: topSection.categories.map((sibling: any) => ({
                title: sibling.title,
                slug: sibling.slug,
              })),
              // Pass all Level 3 subcategories for the sub-row
              childLinks: parentCat.subcategories.map((sibling: any) => ({
                  title: sibling.title,
                  slug: sibling.slug,
              })),
            };
          }
        }
      }
    }
  }

  return null;
}