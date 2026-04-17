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
  statEs?: string;
  statEn?: string;
}

export interface CMSDifferentiator {
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

// ─── Hub de Servicios ───────────────────────────────────

export interface CMSHubMetric {
  value: string;
  labelEs: string;
  labelEn: string;
}

export interface CMSFrameworkPillar {
  letter: string;
  colorClass: string;
  borderClass: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

export interface CMSSector {
  slug: string;
  icon: string;
  labelEs: string;
  labelEn: string;
}

// ─── Industrias — contenido rico ────────────────────────

export interface CMSIndustriaMetric {
  value: string;
  labelEs: string;
  labelEn: string;
}

export interface CMSStatHighlight {
  value: string;
  labelEs: string;
  labelEn: string;
  source?: string;
}

export interface CMSRegulation {
  code: string;
  nameEs: string;
  nameEn: string;
  descEs?: string;
  descEn?: string;
}

export interface CMSUseCase {
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  outcomeEs?: string;
  outcomeEn?: string;
}

export interface CMSPlaybookStep {
  number: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

export interface CMSTechTag {
  label: string;
  category: "cloud" | "data" | "ai" | "frontend" | "backend" | "security" | "other";
}

// ─── Home — proceso en 3 pasos ──────────────────────────

export interface CMSProcessStepHome {
  number: string;
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  durationEs: string;
  durationEn: string;
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
  // Hub-only
  hubMetrics: Array<{ value: string; label: string }>;
  frameworkTitle: string;
  frameworkSubtitle: string;
  frameworkPillars: Array<{
    letter: string;
    colorClass: string;
    borderClass: string;
    title: string;
    desc: string;
  }>;
  sectorsTitle: string;
  sectors: Array<{ slug: string; icon: string; label: string }>;
}

export interface MappedIndustria {
  id: string;
  slug: string;
  icon: string | null;
  accentColor: string;
  name: string;
  heroTitle: string;
  heroSubtitle: string;
  painPoints: Array<{ icon: string; title: string; desc: string; stat?: string }>;
  solutions: Array<{ icon: string; title: string; desc: string }>;
  differentiators: Array<{ title: string; desc: string }>;
  ctaText: string;
  seoTitle: string;
  seoDescription: string;
  // Rich expertise fields
  metrics: Array<{ value: string; label: string }>;
  statHighlights: Array<{ value: string; label: string; source?: string }>;
  regulations: Array<{ code: string; name: string; desc?: string }>;
  useCases: Array<{ icon: string; title: string; desc: string; outcome?: string }>;
  playbook: Array<{ number: string; title: string; desc: string }>;
  industryFaqs: Array<{ question: string; answer: string }>;
  techStack: Array<{ label: string; category: string }>;
  servicesHighlight: string[];
  relatedCaseSlugs: string[];
  ctaTitle: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string | null;
  hubIntroTitle: string;
  hubIntroSubtitle: string;
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
  heroCtaPrimaryUrl: string;
  heroCtaSecondary: string;
  heroCtaSecondaryUrl: string;
  heroImage: string | null;
  metrics: Array<{ value: string; unit: string; label: string }>;
  // Trust bar
  trustBarTitle: string;
  trustBarLogos: string[];
  // Pillars section
  servicesSectionTitle: string;
  pillarsSubtitle: string;
  // Cases section
  casesSectionTitle: string;
  casesSectionSubtitle: string;
  casesSectionFooter: string;
  casesSectionCta: string;
  // Products strip
  productsStripTitle: string;
  productsStripCta: string;
  // Map section
  mapTitle: string;
  mapSubtitle: string;
  mapMetrics: Array<{
    value: string;
    label: string;
    sublabel: string;
  }>;
  // Why us
  whyUsTitle: string;
  whyUsSubtitle: string;
  whyUsItems: Array<{
    icon: string;
    color: string;
    title: string;
    copy: string;
  }>;
  // FAQs
  faqsTitle: string;
  faqs: Array<{ question: string; answer: string }>;
  // Final CTA
  finalCtaTitle: string;
  finalCtaCopy: string;
  finalCtaBullets: string[];
  finalCtaPrimary: string;
  finalCtaPrimaryUrl: string;
  finalCtaSecondary: string;
  finalCtaSecondaryUrl: string;
  finalCtaFinePrint: string;
  // Industrias section on home
  industriasSectionTitle: string;
  industriasSectionSubtitle: string;
  // Process section
  processSectionTitle: string;
  processSectionSubtitle: string;
  processSteps: Array<{
    number: string;
    icon: string;
    title: string;
    desc: string;
    duration: string;
  }>;
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
