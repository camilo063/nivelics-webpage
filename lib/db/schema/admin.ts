import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── ENUMS ───────────────────────────────────────────────

export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "published",
  "scheduled",
  "archived",
]);

export const translationStatusEnum = pgEnum("translation_status", [
  "complete",
  "partial",
  "pending",
  "auto",
]);

export const userRoleEnum = pgEnum("user_role", ["admin", "editor"]);

export const milestoneTypeEnum = pgEnum("milestone_type", [
  "founding",
  "growth",
  "award",
  "expansion",
  "product",
]);

export const serviceTypeEnum = pgEnum("service_type_enum", ["hub", "sub"]);

export const accentColorEnum = pgEnum("accent_color", ["ia", "cloud", "staffing", "finops", "dev"]);

export const pageTypeEnum = pgEnum("page_type", ["contact", "privacy", "support", "careers"]);

export const landingStatusEnum = pgEnum("landing_status", ["draft", "published", "archived"]);

// ─── ADMIN USERS ─────────────────────────────────────────

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("editor").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  mustChangePassword: boolean("must_change_password").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── BLOG ────────────────────────────────────────────────

export const blogCategories = pgTable("blog_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  nameEs: varchar("name_es", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }),
  color: varchar("color", { length: 50 }),
  icon: varchar("icon", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  titleEs: varchar("title_es", { length: 500 }).notNull(),
  titleEn: varchar("title_en", { length: 500 }),
  excerptEs: text("excerpt_es"),
  excerptEn: text("excerpt_en"),
  contentEs: text("content_es"),
  contentEn: text("content_en"),
  coverImage: text("cover_image"),
  coverImageAltEs: varchar("cover_image_alt_es", { length: 500 }),
  coverImageAltEn: varchar("cover_image_alt_en", { length: 500 }),
  authorId: uuid("author_id").references(() => adminUsers.id),
  categoryId: uuid("category_id").references(() => blogCategories.id),
  tags: jsonb("tags").$type<string[]>().default([]),
  seoTitleEs: varchar("seo_title_es", { length: 255 }),
  seoTitleEn: varchar("seo_title_en", { length: 255 }),
  seoDescriptionEs: text("seo_description_es"),
  seoDescriptionEn: text("seo_description_en"),
  ogImage: text("og_image"),
  readingTimeMinutes: integer("reading_time_minutes"),
  status: contentStatusEnum("status").default("draft").notNull(),
  translationStatusEn: translationStatusEnum("translation_status_en").default("pending").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// ─── CASOS DE EXITO ──────────────────────────────────────

export const casosExito = pgTable("casos_exito", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  clientLogo: text("client_logo"),
  /** @deprecated Use clientCountryEs/clientCountryEn. Kept for backward-compat. */
  clientCountry: varchar("client_country", { length: 100 }),
  clientCountryEs: varchar("client_country_es", { length: 100 }),
  clientCountryEn: varchar("client_country_en", { length: 100 }),
  /** @deprecated Use clientSectorEs/clientSectorEn. Kept for backward-compat. */
  clientSector: varchar("client_sector", { length: 100 }),
  clientSectorEs: varchar("client_sector_es", { length: 100 }),
  clientSectorEn: varchar("client_sector_en", { length: 100 }),
  titleEs: varchar("title_es", { length: 500 }).notNull(),
  titleEn: varchar("title_en", { length: 500 }),
  challengeEs: text("challenge_es"),
  challengeEn: text("challenge_en"),
  solutionEs: text("solution_es"),
  solutionEn: text("solution_en"),
  resultsEs: text("results_es"),
  resultsEn: text("results_en"),
  metric1Value: varchar("metric_1_value", { length: 100 }),
  metric1LabelEs: varchar("metric_1_label_es", { length: 255 }),
  metric1LabelEn: varchar("metric_1_label_en", { length: 255 }),
  metric2Value: varchar("metric_2_value", { length: 100 }),
  metric2LabelEs: varchar("metric_2_label_es", { length: 255 }),
  metric2LabelEn: varchar("metric_2_label_en", { length: 255 }),
  metric3Value: varchar("metric_3_value", { length: 100 }),
  metric3LabelEs: varchar("metric_3_label_es", { length: 255 }),
  metric3LabelEn: varchar("metric_3_label_en", { length: 255 }),
  testimonialQuoteEs: text("testimonial_quote_es"),
  testimonialQuoteEn: text("testimonial_quote_en"),
  testimonialAuthor: varchar("testimonial_author", { length: 255 }),
  /** @deprecated Use testimonialRoleEs/testimonialRoleEn. Kept for backward-compat. */
  testimonialRole: varchar("testimonial_role", { length: 255 }),
  testimonialRoleEs: varchar("testimonial_role_es", { length: 255 }),
  testimonialRoleEn: varchar("testimonial_role_en", { length: 255 }),
  coverImage: text("cover_image"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  servicesUsed: jsonb("services_used").$type<string[]>().default([]),
  featured: boolean("featured").default(false).notNull(),
  seoTitleEs: varchar("seo_title_es", { length: 255 }),
  seoTitleEn: varchar("seo_title_en", { length: 255 }),
  seoDescriptionEs: text("seo_description_es"),
  seoDescriptionEn: text("seo_description_en"),
  status: contentStatusEnum("status").default("draft").notNull(),
  translationStatusEn: translationStatusEnum("translation_status_en").default("pending").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// ─── SERVICIOS ───────────────────────────────────────────

export const servicios = pgTable("servicios", {
  id: uuid("id").primaryKey().defaultRandom(),
  slugEs: varchar("slug_es", { length: 255 }).unique().notNull(),
  slugEn: varchar("slug_en", { length: 255 }).unique(),
  parentId: uuid("parent_id"),
  serviceType: serviceTypeEnum("service_type").default("sub").notNull(),
  accentColor: accentColorEnum("accent_color").default("dev").notNull(),
  icon: varchar("icon", { length: 100 }),
  titleEs: varchar("title_es", { length: 500 }).notNull(),
  titleEn: varchar("title_en", { length: 500 }),
  subtitleEs: text("subtitle_es"),
  subtitleEn: text("subtitle_en"),
  descriptionEs: text("description_es"),
  descriptionEn: text("description_en"),
  benefits: jsonb("benefits").$type<
    Array<{
      icon: string;
      titleEs: string;
      titleEn: string;
      copyEs: string;
      copyEn: string;
    }>
  >(),
  processSteps: jsonb("process_steps").$type<
    Array<{
      number: number;
      titleEs: string;
      titleEn: string;
      descEs: string;
      descEn: string;
      duration: string;
    }>
  >(),
  metrics: jsonb("metrics").$type<
    Array<{
      value: string;
      unit: string;
      labelEs: string;
      labelEn: string;
    }>
  >(),
  faqs: jsonb("faqs").$type<
    Array<{
      questionEs: string;
      questionEn: string;
      answerEs: string;
      answerEn: string;
    }>
  >(),
  ctaPrimaryTextEs: varchar("cta_primary_text_es", { length: 255 }),
  ctaPrimaryTextEn: varchar("cta_primary_text_en", { length: 255 }),
  ctaPrimaryUrl: varchar("cta_primary_url", { length: 500 }),
  ctaSecondaryTextEs: varchar("cta_secondary_text_es", { length: 255 }),
  ctaSecondaryTextEn: varchar("cta_secondary_text_en", { length: 255 }),
  ctaSecondaryUrl: varchar("cta_secondary_url", { length: 500 }),
  coverImage: text("cover_image"),
  seoTitleEs: varchar("seo_title_es", { length: 255 }),
  seoTitleEn: varchar("seo_title_en", { length: 255 }),
  seoDescriptionEs: text("seo_description_es"),
  seoDescriptionEn: text("seo_description_en"),
  schemaServiceJson: jsonb("schema_service_json"),
  // ─── HUB-ONLY FIELDS (service_type = 'hub') ───
  hubMetrics:
    jsonb("hub_metrics").$type<Array<{ value: string; labelEs: string; labelEn: string }>>(),
  frameworkTitleEs: text("framework_title_es"),
  frameworkTitleEn: text("framework_title_en"),
  frameworkSubtitleEs: text("framework_subtitle_es"),
  frameworkSubtitleEn: text("framework_subtitle_en"),
  frameworkPillars: jsonb("framework_pillars").$type<
    Array<{
      letter: string;
      colorClass: string;
      borderClass: string;
      titleEs: string;
      titleEn: string;
      descEs: string;
      descEn: string;
    }>
  >(),
  sectorsTitleEs: text("sectors_title_es"),
  sectorsTitleEn: text("sectors_title_en"),
  sectors:
    jsonb("sectors").$type<
      Array<{ slug: string; icon: string; labelEs: string; labelEn: string }>
    >(),
  sortOrder: integer("sort_order").default(0).notNull(),
  status: contentStatusEnum("status").default("draft").notNull(),
  translationStatusEn: translationStatusEnum("translation_status_en").default("pending").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// ─── INDUSTRIAS ──────────────────────────────────────────

export const industrias = pgTable("industrias", {
  id: uuid("id").primaryKey().defaultRandom(),
  slugEs: varchar("slug_es", { length: 255 }).unique().notNull(),
  slugEn: varchar("slug_en", { length: 255 }).unique(),
  icon: varchar("icon", { length: 100 }),
  accentColor: accentColorEnum("accent_color").default("dev").notNull(),
  nameEs: varchar("name_es", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }),
  heroTitleEs: varchar("hero_title_es", { length: 500 }),
  heroTitleEn: varchar("hero_title_en", { length: 500 }),
  heroSubtitleEs: text("hero_subtitle_es"),
  heroSubtitleEn: text("hero_subtitle_en"),
  painPoints: jsonb("pain_points").$type<
    Array<{
      icon: string;
      titleEs: string;
      titleEn: string;
      descEs: string;
      descEn: string;
      statEs?: string;
      statEn?: string;
    }>
  >(),
  solutions: jsonb("solutions").$type<
    Array<{
      icon: string;
      titleEs: string;
      titleEn: string;
      descEs: string;
      descEn: string;
    }>
  >(),
  casoDestacadoId: uuid("caso_destacado_id"),
  differentiators: jsonb("differentiators").$type<
    Array<{
      titleEs: string;
      titleEn: string;
      descEs: string;
      descEn: string;
    }>
  >(),
  // ─── RICH EXPERTISE FIELDS ───
  metrics: jsonb("metrics").$type<Array<{ value: string; labelEs: string; labelEn: string }>>(),
  statHighlights:
    jsonb("stat_highlights").$type<
      Array<{ value: string; labelEs: string; labelEn: string; source?: string }>
    >(),
  regulations:
    jsonb("regulations").$type<
      Array<{ code: string; nameEs: string; nameEn: string; descEs?: string; descEn?: string }>
    >(),
  useCases: jsonb("use_cases").$type<
    Array<{
      icon: string;
      titleEs: string;
      titleEn: string;
      descEs: string;
      descEn: string;
      outcomeEs?: string;
      outcomeEn?: string;
    }>
  >(),
  playbook:
    jsonb("playbook").$type<
      Array<{ number: string; titleEs: string; titleEn: string; descEs: string; descEn: string }>
    >(),
  industryFaqs:
    jsonb("industry_faqs").$type<
      Array<{ questionEs: string; questionEn: string; answerEs: string; answerEn: string }>
    >(),
  techStack: jsonb("tech_stack").$type<
    Array<{
      label: string;
      category: "cloud" | "data" | "ai" | "frontend" | "backend" | "security" | "other";
    }>
  >(),
  servicesHighlight: jsonb("services_highlight").$type<string[]>(),
  relatedCaseSlugs: jsonb("related_case_slugs").$type<string[]>(),
  ctaTitleEs: text("cta_title_es"),
  ctaTitleEn: text("cta_title_en"),
  ctaPrimaryTextEs: varchar("cta_primary_text_es", { length: 255 }),
  ctaPrimaryTextEn: varchar("cta_primary_text_en", { length: 255 }),
  ctaPrimaryUrl: varchar("cta_primary_url", { length: 500 }),
  hubIntroTitleEs: text("hub_intro_title_es"),
  hubIntroTitleEn: text("hub_intro_title_en"),
  hubIntroSubtitleEs: text("hub_intro_subtitle_es"),
  hubIntroSubtitleEn: text("hub_intro_subtitle_en"),
  ctaTextEs: varchar("cta_text_es", { length: 255 }),
  ctaTextEn: varchar("cta_text_en", { length: 255 }),
  seoTitleEs: varchar("seo_title_es", { length: 255 }),
  seoTitleEn: varchar("seo_title_en", { length: 255 }),
  seoDescriptionEs: text("seo_description_es"),
  seoDescriptionEn: text("seo_description_en"),
  status: contentStatusEnum("status").default("draft").notNull(),
  translationStatusEn: translationStatusEnum("translation_status_en").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// ─── LANDING PAGES ───────────────────────────────────────

export const landingPages = pgTable("landing_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  campaignName: varchar("campaign_name", { length: 255 }).notNull(),
  serviceType: accentColorEnum("service_type"),
  accentColor: accentColorEnum("accent_color_lp").default("dev").notNull(),
  noindex: boolean("noindex").default(true).notNull(),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  ogImage: text("og_image"),
  blocks: jsonb("blocks").$type<
    Array<{
      type: string;
      order: number;
      data: Record<string, unknown>;
    }>
  >(),
  formDestination: varchar("form_destination", { length: 50 }),
  formWebhookUrl: text("form_webhook_url"),
  whatsappMessage: text("whatsapp_message"),
  utmCampaign: varchar("utm_campaign", { length: 255 }),
  utmSource: varchar("utm_source", { length: 255 }),
  utmMedium: varchar("utm_medium", { length: 255 }),
  pixelFacebook: boolean("pixel_facebook").default(false).notNull(),
  googleAdsTag: varchar("google_ads_tag", { length: 255 }),
  status: landingStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── TEAM MEMBERS ────────────────────────────────────────

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  roleEs: varchar("role_es", { length: 255 }),
  roleEn: varchar("role_en", { length: 255 }),
  bioEs: text("bio_es"),
  bioEn: text("bio_en"),
  photo: text("photo"),
  linkedinUrl: text("linkedin_url"),
  isFounder: boolean("is_founder").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  status: contentStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── HISTORIA ────────────────────────────────────────────

export const historiaItems = pgTable("historia_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  year: integer("year").notNull(),
  month: integer("month"),
  titleEs: varchar("title_es", { length: 500 }).notNull(),
  titleEn: varchar("title_en", { length: 500 }),
  descriptionEs: text("description_es"),
  descriptionEn: text("description_en"),
  icon: varchar("icon", { length: 100 }),
  image: text("image"),
  milestoneType: milestoneTypeEnum("milestone_type").default("growth").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ─── CERTIFICACIONES ────────────────────────────────────

export const certificaciones = pgTable("certificaciones", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameEs: varchar("name_es", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }),
  issuer: varchar("issuer", { length: 255 }),
  year: integer("year"),
  logo: text("logo"),
  certificateUrl: text("certificate_url"),
  descriptionEs: text("description_es"),
  descriptionEn: text("description_en"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ─── NAV CONFIG ──────────────────────────────────────────

export const navConfig = pgTable("nav_config", {
  id: varchar("id", { length: 50 }).primaryKey().default("main"),
  megaMenu: jsonb("mega_menu"),
  footer: jsonb("footer"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── HOME CONTENT ────────────────────────────────────────

export const homeContent = pgTable("home_content", {
  id: varchar("id", { length: 50 }).primaryKey().default("main"),
  heroBadgeEs: varchar("hero_badge_es", { length: 255 }),
  heroBadgeEn: varchar("hero_badge_en", { length: 255 }),
  heroTitleEs: text("hero_title_es"),
  heroTitleEn: text("hero_title_en"),
  heroSubtitleEs: text("hero_subtitle_es"),
  heroSubtitleEn: text("hero_subtitle_en"),
  heroCtaPrimaryEs: varchar("hero_cta_primary_es", { length: 255 }),
  heroCtaPrimaryEn: varchar("hero_cta_primary_en", { length: 255 }),
  heroCtaSecondaryEs: varchar("hero_cta_secondary_es", { length: 255 }),
  heroCtaSecondaryEn: varchar("hero_cta_secondary_en", { length: 255 }),
  heroImage: text("hero_image"),
  heroCtaPrimaryUrl: varchar("hero_cta_primary_url", { length: 500 }),
  heroCtaSecondaryUrl: varchar("hero_cta_secondary_url", { length: 500 }),
  metrics: jsonb("metrics").$type<
    Array<{
      value: string;
      unit: string;
      labelEs: string;
      labelEn: string;
    }>
  >(),
  // ─── TRUST BAR (client logos marquee) ───
  trustBarLogos: jsonb("trust_bar_logos").$type<string[]>(),
  trustBarTitleEs: text("trust_bar_title_es"),
  trustBarTitleEn: text("trust_bar_title_en"),
  // ─── PILLARS SECTION (I+C+S) ───
  servicesSectionTitleEs: varchar("services_section_title_es", { length: 500 }),
  servicesSectionTitleEn: varchar("services_section_title_en", { length: 500 }),
  pillarsSubtitleEs: text("pillars_subtitle_es"),
  pillarsSubtitleEn: text("pillars_subtitle_en"),
  // ─── CASES SECTION ───
  casesSectionTitleEs: varchar("cases_section_title_es", { length: 500 }),
  casesSectionTitleEn: varchar("cases_section_title_en", { length: 500 }),
  casesSectionSubtitleEs: text("cases_section_subtitle_es"),
  casesSectionSubtitleEn: text("cases_section_subtitle_en"),
  casesSectionFooterEs: text("cases_section_footer_es"),
  casesSectionFooterEn: text("cases_section_footer_en"),
  casesSectionCtaEs: varchar("cases_section_cta_es", { length: 255 }),
  casesSectionCtaEn: varchar("cases_section_cta_en", { length: 255 }),
  // ─── PRODUCTS STRIP ───
  productsStripTitleEs: text("products_strip_title_es"),
  productsStripTitleEn: text("products_strip_title_en"),
  productsStripCtaEs: varchar("products_strip_cta_es", { length: 255 }),
  productsStripCtaEn: varchar("products_strip_cta_en", { length: 255 }),
  // ─── MAP SECTION ("13 años. 7 países.") ───
  mapTitleEs: text("map_title_es"),
  mapTitleEn: text("map_title_en"),
  mapSubtitleEs: text("map_subtitle_es"),
  mapSubtitleEn: text("map_subtitle_en"),
  mapMetrics: jsonb("map_metrics").$type<
    Array<{
      value: string;
      labelEs: string;
      labelEn: string;
      sublabelEs?: string;
      sublabelEn?: string;
    }>
  >(),
  // ─── WHY US SECTION ("¿Por qué Nivelics?") ───
  whyUsTitleEs: text("why_us_title_es"),
  whyUsTitleEn: text("why_us_title_en"),
  whyUsSubtitleEs: text("why_us_subtitle_es"),
  whyUsSubtitleEn: text("why_us_subtitle_en"),
  whyUsItems: jsonb("why_us_items").$type<
    Array<{
      icon: string;
      color: string;
      titleEs: string;
      titleEn: string;
      copyEs: string;
      copyEn: string;
    }>
  >(),
  faqs: jsonb("faqs").$type<
    Array<{
      questionEs: string;
      questionEn: string;
      answerEs: string;
      answerEn: string;
    }>
  >(),
  // ─── FAQs SECTION (wrapper around existing `faqs` jsonb) ───
  faqsTitleEs: text("faqs_title_es"),
  faqsTitleEn: text("faqs_title_en"),
  // ─── FINAL CTA ───
  finalCtaTitleEs: text("final_cta_title_es"),
  finalCtaTitleEn: text("final_cta_title_en"),
  finalCtaCopyEs: text("final_cta_copy_es"),
  finalCtaCopyEn: text("final_cta_copy_en"),
  finalCtaBullets: jsonb("final_cta_bullets").$type<Array<{ textEs: string; textEn: string }>>(),
  finalCtaPrimaryEs: varchar("final_cta_primary_es", { length: 255 }),
  finalCtaPrimaryEn: varchar("final_cta_primary_en", { length: 255 }),
  finalCtaPrimaryUrl: varchar("final_cta_primary_url", { length: 500 }),
  finalCtaSecondaryEs: varchar("final_cta_secondary_es", { length: 255 }),
  finalCtaSecondaryEn: varchar("final_cta_secondary_en", { length: 255 }),
  finalCtaSecondaryUrl: varchar("final_cta_secondary_url", { length: 500 }),
  finalCtaFinePrintEs: text("final_cta_fine_print_es"),
  finalCtaFinePrintEn: text("final_cta_fine_print_en"),
  // ─── HUB DE INDUSTRIAS (/industrias) ───
  industriasHubTitleEs: text("industrias_hub_title_es"),
  industriasHubTitleEn: text("industrias_hub_title_en"),
  industriasHubSubtitleEs: text("industrias_hub_subtitle_es"),
  industriasHubSubtitleEn: text("industrias_hub_subtitle_en"),
  industriasHubStatEs: text("industrias_hub_stat_es"),
  industriasHubStatEn: text("industrias_hub_stat_en"),
  // ─── SECCIÓN "AÑOS DE EXPERIENCIA" (debajo de las cards de /industrias) ───
  industriasSectionTitleEs: text("industrias_section_title_es"),
  industriasSectionTitleEn: text("industrias_section_title_en"),
  industriasSectionSubtitleEs: text("industrias_section_subtitle_es"),
  industriasSectionSubtitleEn: text("industrias_section_subtitle_en"),
  industriasSectionMetrics: jsonb("industrias_section_metrics").$type<
    Array<{ value: string; labelEs: string; labelEn: string }>
  >(),
  // ─── PROCESS SECTION ───
  processSectionTitleEs: text("process_section_title_es"),
  processSectionTitleEn: text("process_section_title_en"),
  processSectionSubtitleEs: text("process_section_subtitle_es"),
  processSectionSubtitleEn: text("process_section_subtitle_en"),
  processSteps: jsonb("process_steps").$type<
    Array<{
      number: string;
      icon: string;
      titleEs: string;
      titleEn: string;
      descEs: string;
      descEn: string;
      durationEs: string;
      durationEn: string;
    }>
  >(),
  translationStatusEn: translationStatusEnum("translation_status_en").default("pending").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── SITE CONFIG ─────────────────────────────────────────

export const siteConfig = pgTable("site_config", {
  id: varchar("id", { length: 50 }).primaryKey().default("main"),
  siteNameEs: varchar("site_name_es", { length: 255 }),
  siteNameEn: varchar("site_name_en", { length: 255 }),
  taglineEs: text("tagline_es"),
  taglineEn: text("tagline_en"),
  logoUrl: text("logo_url"),
  logoWidth: integer("logo_width"),
  logoHeight: integer("logo_height"),
  logoAltEs: text("logo_alt_es").default("Nivelics"),
  logoAltEn: text("logo_alt_en").default("Nivelics"),
  logoTitleEs: text("logo_title_es"),
  logoTitleEn: text("logo_title_en"),
  faviconUrl: text("favicon_url"),
  defaultOgImage: text("default_og_image"),
  phoneWhatsapp: varchar("phone_whatsapp", { length: 50 }),
  emailContact: varchar("email_contact", { length: 255 }),
  addressBogota: text("address_bogota"),
  addressMiami: text("address_miami"),
  linkedinUrl: text("linkedin_url"),
  googleAnalyticsId: varchar("google_analytics_id", { length: 100 }),
  googleTagManagerId: varchar("google_tag_manager_id", { length: 100 }),
  llmsTxtContent: text("llms_txt_content"),
  llmsFullTxtContent: text("llms_full_txt_content"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── PAGES GENERAL ───────────────────────────────────────

export const pagesGeneral = pgTable("pages_general", {
  id: uuid("id").primaryKey().defaultRandom(),
  slugEs: varchar("slug_es", { length: 255 }).unique().notNull(),
  slugEn: varchar("slug_en", { length: 255 }).unique(),
  pageType: pageTypeEnum("page_type").notNull(),
  titleEs: varchar("title_es", { length: 500 }).notNull(),
  titleEn: varchar("title_en", { length: 500 }),
  contentEs: jsonb("content_es"),
  contentEn: jsonb("content_en"),
  seoTitleEs: varchar("seo_title_es", { length: 255 }),
  seoTitleEn: varchar("seo_title_en", { length: 255 }),
  seoDescriptionEs: text("seo_description_es"),
  seoDescriptionEn: text("seo_description_en"),
  translationStatusEn: translationStatusEnum("translation_status_en").default("pending").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── MEDIA ───────────────────────────────────────────────

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  filename: varchar("filename", { length: 500 }).notNull(),
  originalName: varchar("original_name", { length: 500 }).notNull(),
  url: text("url").notNull(),
  altEs: varchar("alt_es", { length: 500 }),
  altEn: varchar("alt_en", { length: 500 }),
  sizeBytes: integer("size_bytes"),
  mimeType: varchar("mime_type", { length: 100 }),
  width: integer("width"),
  height: integer("height"),
  uploadedBy: uuid("uploaded_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── UI LABELS (reusable bilingual strings across pages) ────

export const uiLabels = pgTable("ui_labels", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 120 }).unique().notNull(),
  labelEs: text("label_es").notNull(),
  labelEn: text("label_en").notNull(),
  category: varchar("category", { length: 50 }),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── ACTIVITY LOG ────────────────────────────────────────

export const adminActivityLog = pgTable("admin_activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => adminUsers.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: varchar("entity_id", { length: 255 }),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── RELATIONS ───────────────────────────────────────────

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(adminUsers, {
    fields: [blogPosts.authorId],
    references: [adminUsers.id],
  }),
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
}));

export const casosExitoRelations = relations(casosExito, ({ one }) => ({
  casoDestacado: one(industrias, {
    fields: [casosExito.id],
    references: [industrias.casoDestacadoId],
  }),
}));

// ─── LEADS (Landing Pages) ───────────────────────────────

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  // Nullable: job applications don't have a company.
  empresa: varchar("empresa", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  servicio: varchar("servicio", { length: 100 }),
  // Origin tag: 'contact', 'careers', or an LP slug like 'lp-finops'.
  fuente: varchar("fuente", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("nuevo").notNull(),
  mensaje: text("mensaje"),
  // Absolute URL of the page where the lead was captured.
  referrerUrl: varchar("referrer_url", { length: 500 }),
  // Service/page slug the user was on when they clicked the contact CTA
  // (e.g. 'cloud/finops', 'industria/fintech', 'producto/paywl', 'home').
  // Populated from a ?from= query param or document.referrer. Only set for
  // /api/contact leads — for /api/leads and /api/apply the `fuente` field
  // already carries the origin.
  fromService: varchar("from_service", { length: 200 }),
  isSpam: boolean("is_spam").default(false).notNull(),
  spamReason: varchar("spam_reason", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── PRODUCTOS (SaaS propios de Nivelics) ────────────────

export const productos = pgTable("productos", {
  id: uuid("id").primaryKey().defaultRandom(),
  slugEs: varchar("slug_es", { length: 100 }).notNull().unique(),
  slugEn: varchar("slug_en", { length: 100 }).notNull().unique(),

  name: varchar("name", { length: 100 }).notNull(),
  taglineEs: varchar("tagline_es", { length: 200 }).notNull(),
  taglineEn: varchar("tagline_en", { length: 200 }).notNull(),
  descriptionEs: text("description_es").notNull(),
  descriptionEn: text("description_en").notNull(),

  externalUrl: varchar("external_url", { length: 300 }).notNull(),
  externalCtaEs: varchar("external_cta_es", { length: 100 }).default("Ver producto").notNull(),
  externalCtaEn: varchar("external_cta_en", { length: 100 }).default("View product").notNull(),

  icpEs: varchar("icp_es", { length: 300 }).notNull(),
  icpEn: varchar("icp_en", { length: 300 }).notNull(),
  categoryEs: varchar("category_es", { length: 100 }).notNull(),
  categoryEn: varchar("category_en", { length: 100 }).notNull(),

  pricingFrom: integer("pricing_from"),
  pricingCurrency: varchar("pricing_currency", { length: 10 }).default("USD"),
  pricingLabelEs: varchar("pricing_label_es", { length: 100 }),
  pricingLabelEn: varchar("pricing_label_en", { length: 100 }),
  pricingNoteEs: varchar("pricing_note_es", { length: 200 }),
  pricingNoteEn: varchar("pricing_note_en", { length: 200 }),

  metrics: jsonb("metrics").$type<
    Array<{
      value: string;
      labelEs: string;
      labelEn: string;
    }>
  >(),

  features: jsonb("features").$type<
    Array<{
      icon: string;
      titleEs: string;
      titleEn: string;
      descriptionEs: string;
      descriptionEn: string;
    }>
  >(),

  comparisonTable: jsonb("comparison_table").$type<{
    headersEs: string[];
    headersEn: string[];
    rows: Array<{
      featureEs: string;
      featureEn: string;
      isNivelicsProduct: boolean;
      values: string[];
    }>;
  }>(),

  faqs: jsonb("faqs").$type<
    Array<{
      questionEs: string;
      questionEn: string;
      answerEs: string;
      answerEn: string;
    }>
  >(),

  accentColor: varchar("accent_color", { length: 20 }).default("cyan").notNull(),
  heroEffect: varchar("hero_effect", { length: 20 }).default("particles").notNull(),
  ogImage: varchar("og_image", { length: 500 }),

  seoTitleEs: varchar("seo_title_es", { length: 100 }).notNull(),
  seoTitleEn: varchar("seo_title_en", { length: 100 }).notNull(),
  seoDescriptionEs: varchar("seo_description_es", { length: 200 }).notNull(),
  seoDescriptionEn: varchar("seo_description_en", { length: 200 }).notNull(),
  schemaCategory: varchar("schema_category", { length: 100 }).default("BusinessApplication"),

  status: contentStatusEnum("status").default("draft").notNull(),
  translationStatusEn: translationStatusEnum("translation_status_en").default("pending").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Producto = typeof productos.$inferSelect;
export type NuevoProducto = typeof productos.$inferInsert;
