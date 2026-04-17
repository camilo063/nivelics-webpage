import type {
  Locale,
  CMSBenefit,
  CMSProcessStep,
  CMSMetric,
  CMSFAQ,
  CMSPainPoint,
  CMSDifferentiator,
  CMSHubMetric,
  CMSFrameworkPillar,
  CMSSector,
  CMSIndustriaMetric,
  CMSStatHighlight,
  CMSRegulation,
  CMSUseCase,
  CMSPlaybookStep,
  CMSTechTag,
  CMSProcessStepHome,
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

  const hubMetrics = ((data.hubMetrics as CMSHubMetric[] | null) || []).map((m) => ({
    value: m.value,
    label: pick(locale, m.labelEs, m.labelEn),
  }));

  const frameworkPillars = ((data.frameworkPillars as CMSFrameworkPillar[] | null) || []).map(
    (p) => ({
      letter: p.letter,
      colorClass: p.colorClass,
      borderClass: p.borderClass,
      title: pick(locale, p.titleEs, p.titleEn),
      desc: pick(locale, p.descEs, p.descEn),
    }),
  );

  const sectors = ((data.sectors as CMSSector[] | null) || []).map((s) => ({
    slug: s.slug,
    icon: s.icon,
    label: pick(locale, s.labelEs, s.labelEn),
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
    hubMetrics,
    frameworkTitle:
      pick(locale, data.frameworkTitleEs as string, data.frameworkTitleEn as string) || "",
    frameworkSubtitle:
      pick(locale, data.frameworkSubtitleEs as string, data.frameworkSubtitleEn as string) || "",
    frameworkPillars,
    sectorsTitle: pick(locale, data.sectorsTitleEs as string, data.sectorsTitleEn as string) || "",
    sectors,
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
    stat: p.statEs || p.statEn ? pick(locale, p.statEs ?? "", p.statEn ?? "") : undefined,
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

  const metrics = ((data.metrics as CMSIndustriaMetric[] | null) || []).map((m) => ({
    value: m.value,
    label: pick(locale, m.labelEs, m.labelEn),
  }));

  const statHighlights = ((data.statHighlights as CMSStatHighlight[] | null) || []).map((s) => ({
    value: s.value,
    label: pick(locale, s.labelEs, s.labelEn),
    source: s.source,
  }));

  const regulations = ((data.regulations as CMSRegulation[] | null) || []).map((r) => ({
    code: r.code,
    name: pick(locale, r.nameEs, r.nameEn),
    desc: r.descEs || r.descEn ? pick(locale, r.descEs ?? "", r.descEn ?? "") : undefined,
  }));

  const useCases = ((data.useCases as CMSUseCase[] | null) || []).map((u) => ({
    icon: u.icon,
    title: pick(locale, u.titleEs, u.titleEn),
    desc: pick(locale, u.descEs, u.descEn),
    outcome:
      u.outcomeEs || u.outcomeEn ? pick(locale, u.outcomeEs ?? "", u.outcomeEn ?? "") : undefined,
  }));

  const playbook = ((data.playbook as CMSPlaybookStep[] | null) || []).map((p) => ({
    number: p.number,
    title: pick(locale, p.titleEs, p.titleEn),
    desc: pick(locale, p.descEs, p.descEn),
  }));

  const industryFaqs = ((data.industryFaqs as CMSFAQ[] | null) || []).map((f) => ({
    question: pick(locale, f.questionEs, f.questionEn),
    answer: pick(locale, f.answerEs, f.answerEn),
  }));

  const techStack = ((data.techStack as CMSTechTag[] | null) || []).map((t) => ({
    label: t.label,
    category: t.category,
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
    metrics,
    statHighlights,
    regulations,
    useCases,
    playbook,
    industryFaqs,
    techStack,
    servicesHighlight: (data.servicesHighlight as string[]) || [],
    relatedCaseSlugs: (data.relatedCaseSlugs as string[]) || [],
    ctaTitle: pick(locale, data.ctaTitleEs as string, data.ctaTitleEn as string) || "",
    ctaPrimaryText:
      pick(locale, data.ctaPrimaryTextEs as string, data.ctaPrimaryTextEn as string) || "",
    ctaPrimaryUrl: (data.ctaPrimaryUrl as string) || null,
    hubIntroTitle:
      pick(locale, data.hubIntroTitleEs as string, data.hubIntroTitleEn as string) || "",
    hubIntroSubtitle:
      pick(locale, data.hubIntroSubtitleEs as string, data.hubIntroSubtitleEn as string) || "",
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

  // Resolve bilingual country/sector/role, falling back to the legacy monolingual
  // column when the *_es pair is still empty (during the transition window).
  const countryEs = (data.clientCountryEs as string) || (data.clientCountry as string) || "";
  const countryEn = (data.clientCountryEn as string) || "";
  const sectorEs = (data.clientSectorEs as string) || (data.clientSector as string) || "";
  const sectorEn = (data.clientSectorEn as string) || "";
  const roleEs = (data.testimonialRoleEs as string) || (data.testimonialRole as string) || "";
  const roleEn = (data.testimonialRoleEn as string) || "";

  return {
    id: data.id as string,
    slug: (data.slug as string) || "",
    clientName: (data.clientName as string) || "",
    clientLogo: (data.clientLogo as string) || null,
    clientCountry: pick(locale, countryEs, countryEn) || null,
    clientSector: pick(locale, sectorEs, sectorEn) || null,
    title: pick(locale, data.titleEs as string, data.titleEn as string) || "",
    challenge: pick(locale, data.challengeEs as string, data.challengeEn as string) || "",
    solution: pick(locale, data.solutionEs as string, data.solutionEn as string) || "",
    results: pick(locale, data.resultsEs as string, data.resultsEn as string) || "",
    metrics,
    testimonialQuote:
      pick(locale, data.testimonialQuoteEs as string, data.testimonialQuoteEn as string) || "",
    testimonialAuthor: (data.testimonialAuthor as string) || null,
    testimonialRole: pick(locale, roleEs, roleEn) || null,
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

  const processSteps = ((data.processSteps as CMSProcessStepHome[] | null) || []).map((s) => ({
    number: s.number,
    icon: s.icon,
    title: pick(locale, s.titleEs, s.titleEn),
    desc: pick(locale, s.descEs, s.descEn),
    duration: pick(locale, s.durationEs, s.durationEn),
  }));

  const mapMetricsRaw =
    (data.mapMetrics as Array<{
      value: string;
      labelEs: string;
      labelEn: string;
      sublabelEs?: string;
      sublabelEn?: string;
    }> | null) || [];
  const mapMetrics = mapMetricsRaw.map((m) => ({
    value: m.value,
    label: pick(locale, m.labelEs, m.labelEn),
    sublabel: pick(locale, m.sublabelEs ?? "", m.sublabelEn ?? ""),
  }));

  const whyUsItemsRaw =
    (data.whyUsItems as Array<{
      icon: string;
      color: string;
      titleEs: string;
      titleEn: string;
      copyEs: string;
      copyEn: string;
    }> | null) || [];
  const whyUsItems = whyUsItemsRaw.map((w) => ({
    icon: w.icon,
    color: w.color,
    title: pick(locale, w.titleEs, w.titleEn),
    copy: pick(locale, w.copyEs, w.copyEn),
  }));

  const finalCtaBulletsRaw =
    (data.finalCtaBullets as Array<{ textEs: string; textEn: string }> | null) || [];
  const finalCtaBullets = finalCtaBulletsRaw.map((b) => pick(locale, b.textEs, b.textEn));

  return {
    heroBadge: pick(locale, data.heroBadgeEs as string, data.heroBadgeEn as string) || "",
    heroTitle: pick(locale, data.heroTitleEs as string, data.heroTitleEn as string) || "",
    heroSubtitle: pick(locale, data.heroSubtitleEs as string, data.heroSubtitleEn as string) || "",
    heroCtaPrimary:
      pick(locale, data.heroCtaPrimaryEs as string, data.heroCtaPrimaryEn as string) || "",
    heroCtaPrimaryUrl: (data.heroCtaPrimaryUrl as string) || "/contacto",
    heroCtaSecondary:
      pick(locale, data.heroCtaSecondaryEs as string, data.heroCtaSecondaryEn as string) || "",
    heroCtaSecondaryUrl: (data.heroCtaSecondaryUrl as string) || "",
    heroImage: (data.heroImage as string) || null,
    metrics,

    trustBarTitle:
      pick(locale, data.trustBarTitleEs as string, data.trustBarTitleEn as string) || "",
    trustBarLogos: (data.trustBarLogos as string[] | null) || [],

    servicesSectionTitle:
      pick(locale, data.servicesSectionTitleEs as string, data.servicesSectionTitleEn as string) ||
      "",
    pillarsSubtitle:
      pick(locale, data.pillarsSubtitleEs as string, data.pillarsSubtitleEn as string) || "",

    casesSectionTitle:
      pick(locale, data.casesSectionTitleEs as string, data.casesSectionTitleEn as string) || "",
    casesSectionSubtitle:
      pick(locale, data.casesSectionSubtitleEs as string, data.casesSectionSubtitleEn as string) ||
      "",
    casesSectionFooter:
      pick(locale, data.casesSectionFooterEs as string, data.casesSectionFooterEn as string) || "",
    casesSectionCta:
      pick(locale, data.casesSectionCtaEs as string, data.casesSectionCtaEn as string) || "",

    productsStripTitle:
      pick(locale, data.productsStripTitleEs as string, data.productsStripTitleEn as string) || "",
    productsStripCta:
      pick(locale, data.productsStripCtaEs as string, data.productsStripCtaEn as string) || "",

    mapTitle: pick(locale, data.mapTitleEs as string, data.mapTitleEn as string) || "",
    mapSubtitle: pick(locale, data.mapSubtitleEs as string, data.mapSubtitleEn as string) || "",
    mapMetrics,

    whyUsTitle: pick(locale, data.whyUsTitleEs as string, data.whyUsTitleEn as string) || "",
    whyUsSubtitle:
      pick(locale, data.whyUsSubtitleEs as string, data.whyUsSubtitleEn as string) || "",
    whyUsItems,

    faqsTitle: pick(locale, data.faqsTitleEs as string, data.faqsTitleEn as string) || "",
    faqs,

    finalCtaTitle:
      pick(locale, data.finalCtaTitleEs as string, data.finalCtaTitleEn as string) || "",
    finalCtaCopy: pick(locale, data.finalCtaCopyEs as string, data.finalCtaCopyEn as string) || "",
    finalCtaBullets,
    finalCtaPrimary:
      pick(locale, data.finalCtaPrimaryEs as string, data.finalCtaPrimaryEn as string) || "",
    finalCtaPrimaryUrl: (data.finalCtaPrimaryUrl as string) || "/contacto",
    finalCtaSecondary:
      pick(locale, data.finalCtaSecondaryEs as string, data.finalCtaSecondaryEn as string) || "",
    finalCtaSecondaryUrl: (data.finalCtaSecondaryUrl as string) || "",
    finalCtaFinePrint:
      pick(locale, data.finalCtaFinePrintEs as string, data.finalCtaFinePrintEn as string) || "",

    industriasSectionTitle:
      pick(
        locale,
        data.industriasSectionTitleEs as string,
        data.industriasSectionTitleEn as string,
      ) || "",
    industriasSectionSubtitle:
      pick(
        locale,
        data.industriasSectionSubtitleEs as string,
        data.industriasSectionSubtitleEn as string,
      ) || "",
    processSectionTitle:
      pick(locale, data.processSectionTitleEs as string, data.processSectionTitleEn as string) ||
      "",
    processSectionSubtitle:
      pick(
        locale,
        data.processSectionSubtitleEs as string,
        data.processSectionSubtitleEn as string,
      ) || "",
    processSteps,
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
