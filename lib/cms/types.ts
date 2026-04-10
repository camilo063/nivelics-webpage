// ─── CMS Types — TypeScript interfaces for all DB content ───

export interface CMSBenefit {
  icon: string;
  titleEs: string;
  titleEn: string;
  copyEs: string;
  copyEn: string;
}

export interface CMSProcessStep {
  number: number;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  duration: string;
}

export interface CMSMetric {
  value: string;
  unit: string;
  labelEs: string;
  labelEn: string;
}

export interface CMSFAQ {
  questionEs: string;
  questionEn: string;
  answerEs: string;
  answerEn: string;
}

export interface CMSPainPoint {
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

export interface CMSDifferentiator {
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

// ─── Mapped types (locale-resolved) ─────────────────────

export interface MappedServicio {
  id: string;
  slug: string;
  slugEn: string | null;
  parentId: string | null;
  serviceType: string;
  accentColor: string;
  icon: string | null;
  title: string;
  subtitle: string;
  description: string;
  benefits: Array<{ icon: string; title: string; copy: string }>;
  processSteps: Array<{ number: number; title: string; desc: string; duration: string }>;
  metrics: Array<{ value: string; unit: string; label: string }>;
  faqs: Array<{ question: string; answer: string }>;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string | null;
  ctaSecondaryText: string;
  ctaSecondaryUrl: string | null;
  coverImage: string | null;
  seoTitle: string;
  seoDescription: string;
}

export interface MappedIndustria {
  id: string;
  slug: string;
  icon: string | null;
  accentColor: string;
  name: string;
  heroTitle: string;
  heroSubtitle: string;
  painPoints: Array<{ icon: string; title: string; desc: string }>;
  solutions: Array<{ icon: string; title: string; desc: string }>;
  differentiators: Array<{ title: string; desc: string }>;
  ctaText: string;
  seoTitle: string;
  seoDescription: string;
}

export interface MappedCasoExito {
  id: string;
  slug: string;
  clientName: string;
  clientLogo: string | null;
  clientCountry: string | null;
  clientSector: string | null;
  title: string;
  challenge: string;
  solution: string;
  results: string;
  metrics: Array<{ value: string; label: string }>;
  testimonialQuote: string;
  testimonialAuthor: string | null;
  testimonialRole: string | null;
  coverImage: string | null;
  servicesUsed: string[];
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface MappedBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  coverImageAlt: string;
  tags: string[];
  readingTimeMinutes: number | null;
  publishedAt: Date | null;
  seoTitle: string;
  seoDescription: string;
}

export interface MappedHomeContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroImage: string | null;
  metrics: Array<{ value: string; unit: string; label: string }>;
  servicesSectionTitle: string;
  casesSectionTitle: string;
  faqs: Array<{ question: string; answer: string }>;
  finalCtaTitle: string;
  finalCtaCopy: string;
}

export interface MappedTeamMember {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  linkedinUrl: string | null;
  isFounder: boolean;
  isFeatured: boolean;
}

export interface MappedHistoriaItem {
  id: string;
  year: number;
  month: number | null;
  title: string;
  description: string;
  icon: string | null;
  image: string | null;
  milestoneType: string;
}

export interface MappedPageGeneral {
  id: string;
  slug: string;
  pageType: string;
  title: string;
  content: unknown;
  seoTitle: string;
  seoDescription: string;
}

export type Locale = "es" | "en";
