import type {
  Locale,
  CMSBenefit,
  CMSProcessStep,
  CMSMetric,
  CMSFAQ,
  CMSPainPoint,
  CMSDifferentiator,
  MappedServicio,
  MappedIndustria,
  MappedCasoExito,
  MappedBlogPost,
  MappedHomeContent,
  MappedTeamMember,
  MappedHistoriaItem,
  MappedPageGeneral,
} from "./types";

function pick<T>(locale: Locale, es: T, en: T): T {
  return locale === "en" ? en || es : es;
}

export function mapServicio(data: Record<string, unknown>, locale: Locale): MappedServicio {
  const benefits = ((data.benefits as CMSBenefit[] | null) || []).map((b) => ({
    icon: b.icon,
    title: pick(locale, b.titleEs, b.titleEn),
    copy: pick(locale, b.copyEs, b.copyEn),
  }));

  const processSteps = (
    (data.processSteps as CMSProcessStep[] | null) ||
    (data.process_steps as CMSProcessStep[] | null) ||
    []
  ).map((s) => ({
    number: s.number,
    title: pick(locale, s.titleEs, s.titleEn),
    desc: pick(locale, s.descEs, s.descEn),
    duration: s.duration,
  }));

  const metrics = ((data.metrics as CMSMetric[] | null) || []).map((m) => ({
    value: m.value,
    unit: m.unit,
    label: pick(locale, m.labelEs, m.labelEn),
  }));

  const faqs = ((data.faqs as CMSFAQ[] | null) || []).map((f) => ({
    question: pick(locale, f.questionEs, f.questionEn),
    answer: pick(locale, f.answerEs, f.answerEn),
  }));

  return {
    id: data.id as string,
    slug: (data.slugEs as string) || "",
    slugEn: (data.slugEn as string) || null,
    parentId: (data.parentId as string) || null,
    serviceType: (data.serviceType as string) || "sub",
    accentColor: (data.accentColor as string) || "dev",
    icon: (data.icon as string) || null,
    title: pick(locale, data.titleEs as string, data.titleEn as string) || "",
    subtitle: pick(locale, data.subtitleEs as string, data.subtitleEn as string) || "",
    description: pick(locale, data.descriptionEs as string, data.descriptionEn as string) || "",
    benefits,
    processSteps,
    metrics,
    faqs,
    ctaPrimaryText:
      pick(locale, data.ctaPrimaryTextEs as string, data.ctaPrimaryTextEn as string) || "",
    ctaPrimaryUrl: (data.ctaPrimaryUrl as string) || null,
    ctaSecondaryText:
      pick(locale, data.ctaSecondaryTextEs as string, data.ctaSecondaryTextEn as string) || "",
    ctaSecondaryUrl: (data.ctaSecondaryUrl as string) || null,
    coverImage: (data.coverImage as string) || null,
    seoTitle: pick(locale, data.seoTitleEs as string, data.seoTitleEn as string) || "",
    seoDescription:
      pick(locale, data.seoDescriptionEs as string, data.seoDescriptionEn as string) || "",
  };
}

export function mapIndustria(data: Record<string, unknown>, locale: Locale): MappedIndustria {
  const painPoints = (
    (data.painPoints as CMSPainPoint[] | null) ||
    (data.pain_points as CMSPainPoint[] | null) ||
    []
  ).map((p) => ({
    icon: p.icon,
    title: pick(locale, p.titleEs, p.titleEn),
    desc: pick(locale, p.descEs, p.descEn),
  }));

  const solutions = ((data.solutions as CMSPainPoint[] | null) || []).map((s) => ({
    icon: s.icon,
    title: pick(locale, s.titleEs, s.titleEn),
    desc: pick(locale, s.descEs, s.descEn),
  }));

  const differentiators = ((data.differentiators as CMSDifferentiator[] | null) || []).map((d) => ({
    title: pick(locale, d.titleEs, d.titleEn),
    desc: pick(locale, d.descEs, d.descEn),
  }));

  return {
    id: data.id as string,
    slug: (data.slugEs as string) || "",
    icon: (data.icon as string) || null,
    accentColor: (data.accentColor as string) || "dev",
    name: pick(locale, data.nameEs as string, data.nameEn as string) || "",
    heroTitle: pick(locale, data.heroTitleEs as string, data.heroTitleEn as string) || "",
    heroSubtitle: pick(locale, data.heroSubtitleEs as string, data.heroSubtitleEn as string) || "",
    painPoints,
    solutions,
    differentiators,
    ctaText: pick(locale, data.ctaTextEs as string, data.ctaTextEn as string) || "",
    seoTitle: pick(locale, data.seoTitleEs as string, data.seoTitleEn as string) || "",
    seoDescription:
      pick(locale, data.seoDescriptionEs as string, data.seoDescriptionEn as string) || "",
  };
}

export function mapCasoExito(data: Record<string, unknown>, locale: Locale): MappedCasoExito {
  const m1 = data.metric1Value as string;
  const m2 = data.metric2Value as string;
  const m3 = data.metric3Value as string;
  const metrics: Array<{ value: string; label: string }> = [];
  if (m1)
    metrics.push({
      value: m1,
      label: pick(locale, data.metric1LabelEs as string, data.metric1LabelEn as string) || "",
    });
  if (m2)
    metrics.push({
      value: m2,
      label: pick(locale, data.metric2LabelEs as string, data.metric2LabelEn as string) || "",
    });
  if (m3)
    metrics.push({
      value: m3,
      label: pick(locale, data.metric3LabelEs as string, data.metric3LabelEn as string) || "",
    });

  return {
    id: data.id as string,
    slug: (data.slug as string) || "",
    clientName: (data.clientName as string) || "",
    clientLogo: (data.clientLogo as string) || null,
    clientCountry: (data.clientCountry as string) || null,
    clientSector: (data.clientSector as string) || null,
    title: pick(locale, data.titleEs as string, data.titleEn as string) || "",
    challenge: pick(locale, data.challengeEs as string, data.challengeEn as string) || "",
    solution: pick(locale, data.solutionEs as string, data.solutionEn as string) || "",
    results: pick(locale, data.resultsEs as string, data.resultsEn as string) || "",
    metrics,
    testimonialQuote:
      pick(locale, data.testimonialQuoteEs as string, data.testimonialQuoteEn as string) || "",
    testimonialAuthor: (data.testimonialAuthor as string) || null,
    testimonialRole: (data.testimonialRole as string) || null,
    coverImage: (data.coverImage as string) || null,
    servicesUsed: (data.servicesUsed as string[]) || [],
    featured: (data.featured as boolean) || false,
    seoTitle: pick(locale, data.seoTitleEs as string, data.seoTitleEn as string) || "",
    seoDescription:
      pick(locale, data.seoDescriptionEs as string, data.seoDescriptionEn as string) || "",
  };
}

export function mapBlogPost(data: Record<string, unknown>, locale: Locale): MappedBlogPost {
  return {
    id: data.id as string,
    slug: (data.slug as string) || "",
    title: pick(locale, data.titleEs as string, data.titleEn as string) || "",
    excerpt: pick(locale, data.excerptEs as string, data.excerptEn as string) || "",
    content: pick(locale, data.contentEs as string, data.contentEn as string) || "",
    coverImage: (data.coverImage as string) || null,
    coverImageAlt:
      pick(locale, data.coverImageAltEs as string, data.coverImageAltEn as string) || "",
    tags: (data.tags as string[]) || [],
    readingTimeMinutes: (data.readingTimeMinutes as number) || null,
    publishedAt: (data.publishedAt as Date) || null,
    seoTitle: pick(locale, data.seoTitleEs as string, data.seoTitleEn as string) || "",
    seoDescription:
      pick(locale, data.seoDescriptionEs as string, data.seoDescriptionEn as string) || "",
  };
}

export function mapHomeContent(data: Record<string, unknown>, locale: Locale): MappedHomeContent {
  const metrics = ((data.metrics as CMSMetric[] | null) || []).map((m) => ({
    value: m.value,
    unit: m.unit,
    label: pick(locale, m.labelEs, m.labelEn),
  }));

  const faqs = ((data.faqs as CMSFAQ[] | null) || []).map((f) => ({
    question: pick(locale, f.questionEs, f.questionEn),
    answer: pick(locale, f.answerEs, f.answerEn),
  }));

  return {
    heroBadge: pick(locale, data.heroBadgeEs as string, data.heroBadgeEn as string) || "",
    heroTitle: pick(locale, data.heroTitleEs as string, data.heroTitleEn as string) || "",
    heroSubtitle: pick(locale, data.heroSubtitleEs as string, data.heroSubtitleEn as string) || "",
    heroCtaPrimary:
      pick(locale, data.heroCtaPrimaryEs as string, data.heroCtaPrimaryEn as string) || "",
    heroCtaSecondary:
      pick(locale, data.heroCtaSecondaryEs as string, data.heroCtaSecondaryEn as string) || "",
    heroImage: (data.heroImage as string) || null,
    metrics,
    servicesSectionTitle:
      pick(locale, data.servicesSectionTitleEs as string, data.servicesSectionTitleEn as string) ||
      "",
    casesSectionTitle:
      pick(locale, data.casesSectionTitleEs as string, data.casesSectionTitleEn as string) || "",
    faqs,
    finalCtaTitle:
      pick(locale, data.finalCtaTitleEs as string, data.finalCtaTitleEn as string) || "",
    finalCtaCopy: pick(locale, data.finalCtaCopyEs as string, data.finalCtaCopyEn as string) || "",
  };
}

export function mapTeamMember(data: Record<string, unknown>, locale: Locale): MappedTeamMember {
  return {
    id: data.id as string,
    slug: (data.slug as string) || "",
    name: (data.name as string) || "",
    role: pick(locale, data.roleEs as string, data.roleEn as string) || "",
    bio: pick(locale, data.bioEs as string, data.bioEn as string) || "",
    photo: (data.photo as string) || null,
    linkedinUrl: (data.linkedinUrl as string) || null,
    isFounder: (data.isFounder as boolean) || false,
    isFeatured: (data.isFeatured as boolean) || false,
  };
}

export function mapHistoriaItem(data: Record<string, unknown>, locale: Locale): MappedHistoriaItem {
  return {
    id: data.id as string,
    year: (data.year as number) || 0,
    month: (data.month as number) || null,
    title: pick(locale, data.titleEs as string, data.titleEn as string) || "",
    description: pick(locale, data.descriptionEs as string, data.descriptionEn as string) || "",
    icon: (data.icon as string) || null,
    image: (data.image as string) || null,
    milestoneType: (data.milestoneType as string) || "growth",
  };
}

export function mapPageGeneral(data: Record<string, unknown>, locale: Locale): MappedPageGeneral {
  return {
    id: data.id as string,
    slug: (data.slugEs as string) || "",
    pageType: (data.pageType as string) || "",
    title: pick(locale, data.titleEs as string, data.titleEn as string) || "",
    content: pick(locale, data.contentEs as unknown, data.contentEn as unknown) || null,
    seoTitle: pick(locale, data.seoTitleEs as string, data.seoTitleEn as string) || "",
    seoDescription:
      pick(locale, data.seoDescriptionEs as string, data.seoDescriptionEn as string) || "",
  };
}
