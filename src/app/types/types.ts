export interface State {
  username: string;
  mission: string;
  techStack: string[];
  reminderFrequency: string;
  difficultyLevel: string;
  lastOnboardingStep: string;
  lastUrl: string;
}
export interface OnboardingProviderProps {
  children: React.ReactNode;
  defaultState: State;
}
export interface OnboardingContextProps {
  state: State;
  dispatch: React.Dispatch<any>;
}

export interface MainAppState {
  menuOpen: boolean;
}
export interface MainAppStateProps {
  children: React.ReactNode;
}

export interface MainAppContextProps {
  state: MainAppState;
  dispatch: React.Dispatch<any>;
}

// NAV-TYPES

export interface links {
  id: number;
  title: string;
  href: string;
}

export interface NavLinks {
  id: number;
  title: string;
  href: string;
  subMenu: Array<links> | null;
}

export interface HeroSection {
  headline: string;
  subheadline: string;
  cta: string;
}

export interface CTASection {
  headline: string;
  buttons: string[];
}

export interface PageContents {
  hero: HeroSection;

  // Generic intro (services pages)
  intro?: string;

  // Services pages
  services?: { title: string; description: string }[];
  whoFor?: string[];
  caseStudy?: { title: string; content: string };

  // About page
  mission?: string;
  story?: string;
  values?: string[];
  teamIntro?: string;

  // Industries page
  industries?: { title: string; description: string }[];

  // Shared
  whyChoose?: string[];
  ctaBanner?: CTASection;
}

export interface PageLayoutProps {
  contents: PageContents;
}
