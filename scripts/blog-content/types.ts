export type BriefType = "MIGRATE_FULL" | "MIGRATE_NEW_SLUG" | "NEW";

export type Locale = "es" | "en";

export interface CTA {
  text: string;
  url: string;
}

export interface Brief {
  id: string;
  isPillar: boolean;
  type: BriefType;
  title: string;
  slugEs: string;
  slugEn: string;
  category: string;
  cluster?: string;
  queryObjective: string;
  queryVariants: string[];
  intent: string;
  wordsMin: number;
  wordsMax: number;
  structureRaw: string;
  h2List: string[];
  mustCover: string[];
  verifyItems: string[];
  ctaPrimary?: CTA;
  ctaSecondary?: CTA;
  metaDescriptionEs?: string;
  metaDescriptionEn?: string;
  schemaOrg: string[];
  internalLinks: string[];
  redirectFrom: string[];
}

export interface GeneratedArticle {
  title: string;
  slug: string;
  metaDescription: string;
  h1: string;
  body: string;
  faqItems: Array<{ question: string; answer: string }>;
  schemaOrg: string[];
  verifyMarkers: string[];
}

export interface GenerationResult {
  brief: Brief;
  locale: Locale;
  article?: GeneratedArticle;
  error?: string;
  tokensIn?: number;
  tokensOut?: number;
  attempts: number;
  wordCount?: number;
  filePath?: string;
  skipped?: boolean;
  validationErrors?: string[];
}
