// app/[locale]/context/types.ts
export type Locale = "en" | "fr";

export type PricingPlan = {
  title: string;
  price: string;
  description: string;
  offers: string[];
  popular?: string;
};

export type PricingDict = {
  pageTitle: string;
  headline: string;
  subtext: string;
  plans: PricingPlan[];
  month: string;
  subscribe: string;
};

export type Dict = {
  pricing: PricingDict;
  // add other namespaces you use: nav, footer, profile, etc.
  nav?: Record<string, string>;
  footer?: Record<string, string>;
  profile?: Record<string, any>;
};
