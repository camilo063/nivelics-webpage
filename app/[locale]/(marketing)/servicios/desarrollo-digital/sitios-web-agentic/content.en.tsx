import Link from "next/link";
import {
  Search,
  Bot,
  Brain,
  Globe,
  LinkIcon,
  Zap,
  Code2,
  FileText,
  Shield,
  Menu,
  ChevronsRight,
  Layers,
  Check,
} from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getFAQSchema } from "@/lib/schema/faq";

const INCLUDED_ITEMS = [
  {
    icon: "globe",
    title: "Technical multi-language (i18n)",
    description:
      "Architecture from first commit, semantic routes per language, hreflang, x-default, og:locale.",
  },
  {
    icon: "link-icon",
    title: "URL architecture without errors",
    description: "No 404s, documented 301 redirects, canonical tags, no duplicate content.",
  },
  {
    icon: "zap",
    title: "Performance that Google rewards",
    description: "LCP < 2s, CLS = 0, INP < 150ms, WebP/AVIF, hosted fonts.",
  },
  {
    icon: "code2",
    title: "Structured data for machines",
    description: "JSON-LD server-side, Organization, Service, BreadcrumbList, FAQPage.",
  },
  {
    icon: "file-text",
    title: "The robots.txt of LLMs",
    description: "llms.txt standard, bilingual, with ES/EN URL pairs.",
  },
  {
    icon: "shield",
    title: "Granular access for AI bots",
    description: "robots.txt configured for GPTBot, Claude-Web, PerplexityBot etc.",
  },
  {
    icon: "menu",
    title: "Navigation that agents read",
    description: "aria-labels, data-attributes, SiteNavigationElement Schema.org.",
  },
  {
    icon: "chevrons-right",
    title: "Breadcrumbs for humans and crawlers",
    description: "BreadcrumbList JSON-LD, translated labels.",
  },
  {
    icon: "layers",
    title: "Strict semantic HTML",
    description: "H1\u2192H2\u2192H3 hierarchy, one H1 per page, content in text not images.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What's the difference between an 'agentic-first' site and a site with good SEO?",
    answer:
      "Good SEO optimizes for Google's traditional crawlers. An agentic-first site goes further: it's also structured so AI agents (ChatGPT, Claude, Perplexity) can navigate, understand and recommend your content. This includes llms.txt, complete JSON-LD schemas, semantic HTML hierarchy and bilingual URL architecture that LLMs can parse natively.",
  },
  {
    question: "How long until my site appears in ChatGPT or Claude answers?",
    answer:
      "Once the site is live with all agentic standards, LLMs typically begin indexing and referencing the content within 2 to 6 weeks. The timeline depends on the LLM's crawl frequency and domain authority, but the correct technical foundation is what makes it possible in the first place.",
  },
  {
    question: "Can I update content without knowing code?",
    answer:
      "Yes. We integrate a headless CMS (like Sanity, Contentful or Strapi) so your team can edit text, images and metadata without touching code. The structured data, schemas and performance optimizations remain intact regardless of content changes.",
  },
  {
    question: "What happens with multi-language if I add new content?",
    answer:
      "The i18n architecture is built from day one. When you add a new page or blog post in one language, the system creates the corresponding route in the other language, generates the hreflang tags automatically, and updates the sitemap and llms.txt with both URL versions.",
  },
  {
    question: "How much does an agentic-first site cost?",
    answer:
      "Pricing depends on the number of pages, integrations and whether you need a CMS. A typical project with 15-30 pages, two languages, CMS and all agentic standards starts around USD $15,000-25,000. We provide a detailed quote after a free discovery call.",
  },
  {
    question: "Can you build it in English from the start for US markets?",
    answer:
      "Absolutely. While the architecture supports both ES and EN from the start, the primary language can be English with Spanish as secondary. We adapt the URL structure, hreflang tags and llms.txt to reflect the market priority you need.",
  },
];

export function AgenticContentEn() {
  const serviceSchema = getServiceSchema({
    name: "Agentic-First Web Development",
    description:
      "We build websites navigable by AI agents and LLMs. Multilingual, complete Schema.org, llms.txt, Core Web Vitals \u226595. Indexed by Google SGE, ChatGPT, Claude and Perplexity.",
    url: "/servicios/desarrollo-digital/sitios-web-agentic",
    serviceType: "Web Development",
  });

  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/servicios" },
    { name: "Digital Development", url: "/servicios/desarrollo-digital" },
    {
      name: "Agentic-First Websites",
      url: "/servicios/desarrollo-digital/sitios-web-agentic",
    },
  ]);

  const faqSchema = getFAQSchema(FAQ_ITEMS);

  return (
    <PageWrapper>
      <SiblingServicesNav
        parentService={{
          name: "Desarrollo Digital",
          nameEn: "Digital Development",
          accentColor: "#06B6D4",
        }}
        siblings={[
          {
            name: "Sitios Agentic-First",
            nameEn: "Agentic-First Websites",
            url: "/servicios/desarrollo-digital/sitios-web-agentic",
            urlEn: "/en/services/digital-development/agentic-web",
          },
          {
            name: "Apps Móviles",
            nameEn: "Mobile Apps",
            url: "/servicios/desarrollo-digital/apps-moviles",
            urlEn: "/en/services/digital-development/mobile-apps",
          },
          {
            name: "E-commerce",
            nameEn: "E-commerce",
            url: "/servicios/desarrollo-digital/ecommerce",
            urlEn: "/en/services/digital-development/ecommerce",
          },
          {
            name: "Plataformas Web",
            nameEn: "Web Platforms",
            url: "/servicios/desarrollo-digital/plataformas-web",
            urlEn: "/en/services/digital-development/web-platforms",
          },
        ]}
      />
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* SECTION 1 — HERO */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-dev/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant="dev">Digital Development &middot; New</ServiceBadge>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            Websites that humans{" "}
            <span className="bg-gradient-to-r from-dev to-primary bg-clip-text text-transparent">
              AND AI
            </span>{" "}
            understand
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-text-70">
            In 2026, your website has two types of visitors: people and AI agents. Most websites are
            optimized for just one. We build for both.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="glass rounded-xl p-6 text-center">
              <div className="font-mono text-3xl font-bold text-primary">&ge;95</div>
              <p className="mt-1 text-sm font-semibold text-text-100">PageSpeed Score</p>
              <p className="mt-1 text-xs text-text-70">mobile and desktop</p>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <div className="font-mono text-3xl font-bold text-primary">100%</div>
              <p className="mt-1 text-sm font-semibold text-text-100">LLM Crawlable</p>
              <p className="mt-1 text-xs text-text-70">GPT, Claude, Perplexity, Gemini</p>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <div className="font-mono text-3xl font-bold text-primary">2</div>
              <p className="mt-1 text-sm font-semibold text-text-100">Languages from day one</p>
              <p className="mt-1 text-xs text-text-70">ES + EN with semantic URLs</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Schedule a free diagnosis &rarr;
            </Link>
            <a
              href="#caso"
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-100 transition hover:bg-bg-surface"
            >
              See how we built this site &darr;
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2 — THE PROBLEM */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            Why does it matter if AI understands your site?
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="glass glow-hover rounded-xl p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-dev/10">
                <Search size={24} className="text-dev" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-text-100">
                Google no longer shows just links
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-70">
                Google&apos;s AI Overviews answer questions directly in search results. If your site
                doesn&apos;t have correct Schema.org, readable text content and semantic structure,
                you don&apos;t appear in those answers. Organic traffic goes to whoever built
                correctly.
              </p>
            </div>

            <div className="glass glow-hover rounded-xl p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-dev/10">
                <Bot size={24} className="text-dev" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-text-100">
                AI agents are already making decisions
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-70">
                Tools like ChatGPT Operator, Claude Computer Use and Perplexity browse websites
                autonomously to compare services, extract prices and make recommendations. If your
                site isn&apos;t navigable by agents, you don&apos;t exist in that decision layer.
              </p>
            </div>

            <div className="glass glow-hover rounded-xl p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-dev/10">
                <Brain size={24} className="text-dev" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-text-100">
                ChatGPT and Claude recommend companies
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-70">
                When someone asks an LLM &ldquo;who does Staff Augmentation in Colombia?&rdquo; or
                &ldquo;best FinOps company in LATAM&rdquo;, the LLM responds with companies it
                indexed correctly. Appearing in those answers requires a site built with this
                standard.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-dev/20 bg-dev/5 p-6">
            <p className="text-sm leading-relaxed text-text-70">
              <strong className="text-text-100">This site</strong> &mdash; nivelics.com &mdash; was
              built with all these standards. What you see here is exactly what we build for you.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHAT'S INCLUDED */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            Everything that makes a site agentic-first
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED_ITEMS.map((item) => {
              const iconName = item.icon;
              return (
                <div key={item.title} className="glass glow-hover rounded-xl p-6">
                  <GeoIconBox name={iconName} size={20} color="amber" />
                  <h3 className="text-lg font-semibold text-text-100">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 — PROCESS */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            Our process for an agentic-first site
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-5">
            {[
              {
                phase: "Architecture",
                weeks: "Week 1-2",
                description:
                  "URL map, i18n strategy, Schema.org plan, performance budget and tech stack selection.",
              },
              {
                phase: "Technical Setup",
                weeks: "Week 2-4",
                description:
                  "Project scaffold, i18n routing, JSON-LD generators, llms.txt, robots.txt, sitemap config.",
              },
              {
                phase: "Pages",
                weeks: "Week 3-6",
                description:
                  "Component-driven page development, semantic HTML, breadcrumbs, CMS integration.",
              },
              {
                phase: "Performance",
                weeks: "Week 5-7",
                description:
                  "Core Web Vitals optimization, image pipeline, font strategy, bundle analysis.",
              },
              {
                phase: "Audit & Launch",
                weeks: "Week 6-8",
                description:
                  "Automated technical audit, cross-browser testing, staging review, production deploy.",
              },
            ].map((step) => (
              <div
                key={step.phase}
                className="glass glow-hover rounded-xl p-6 border-t-2 border-dev"
              >
                <span className="font-mono text-sm font-bold text-dev">{step.weeks}</span>
                <h3 className="mt-2 text-lg font-semibold text-text-100">{step.phase}</h3>
                <p className="mt-2 text-sm text-text-70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — CASE STUDY */}
      <section id="caso" className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            What you see here is what we build for you
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Open /llms.txt",
                description:
                  "Visit nivelics.com/llms.txt and see the structured file that LLMs use to understand this site.",
              },
              {
                label: "Check the sitemap",
                description:
                  "Inspect sitemap.xml with all bilingual URLs, canonical tags and lastmod dates.",
              },
              {
                label: "Inspect the JSON-LD",
                description:
                  "View page source on any page and find Organization, Service, BreadcrumbList and FAQPage schemas.",
              },
              {
                label: "Switch the language",
                description:
                  "Toggle between /es and /en and verify semantic URLs, hreflang and content parity.",
              },
            ].map((v) => (
              <div key={v.label} className="glass glow-hover rounded-xl p-6">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-dev/10">
                  <Check size={16} className="text-dev" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-text-100">{v.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-70">{v.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "\u226595", label: "PageSpeed Score" },
              { value: "122", label: "pages" },
              { value: "6", label: "schemas" },
              { value: "2", label: "languages" },
            ].map((m) => (
              <div key={m.label} className="glass rounded-xl p-6 text-center">
                <div className="font-mono text-3xl font-bold text-primary">{m.value}</div>
                <p className="mt-2 text-sm text-text-70">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — COMPARISON TABLE */}
      <ComparisonTable
        title="Why an agentic-first site vs. a traditional one?"
        alternativeLabel="WordPress / Traditional agency"
        nivelicsLabel="Agentic-First Site \u2014 Nivelics"
        rows={[
          {
            criterion: "LLM indexing",
            alternative: "Not considered",
            nivelics: "Designed from the start",
          },
          {
            criterion: "llms.txt",
            alternative: "Doesn\u2019t exist",
            nivelics: "Implemented and bilingual",
          },
          {
            criterion: "Schema.org",
            alternative: "Generic plugins, incomplete",
            nivelics: "Complete JSON-LD server-side",
          },
          {
            criterion: "Multi-language",
            alternative: "i18n plugin with /es/ and /en/ URLs",
            nivelics: "Native architecture, ES at root",
          },
          {
            criterion: "hreflang",
            alternative: "Frequently incorrect",
            nivelics: "Automatically verified",
          },
          {
            criterion: "Core Web Vitals",
            alternative: "60-75 due to plugins and themes",
            nivelics: "\u226595 by architecture design",
          },
          {
            criterion: "SEO Breadcrumbs",
            alternative: "Plugin that fails on subpages",
            nivelics: "SSR BreadcrumbList on all pages",
          },
          {
            criterion: "Semantic URLs",
            alternative: "CMS-dependent",
            nivelics: "Defined before writing code",
          },
          {
            criterion: "Technical audit",
            alternative: "Manual or nonexistent",
            nivelics: "Automated script on every deploy",
          },
          {
            criterion: "Canonical tags",
            alternative: "Auto-generated, sometimes wrong",
            nivelics: "Verified page by page",
          },
          {
            criterion: "Time to SEO results",
            alternative: "3-6 months",
            nivelics: "30-60 days (correct technical base)",
          },
          {
            criterion: "Correction costs",
            alternative: "High \u2014 undo what was done wrong",
            nivelics: "Low \u2014 architecture is the foundation",
          },
        ]}
      />

      {/* SECTION 7 — FAQ */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Frequently Asked Questions</h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {FAQ_ITEMS.map((faq) => (
              <div key={faq.question} className="glass rounded-xl p-6">
                <h3 className="text-base font-semibold text-text-100">{faq.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — CTA */}
      <CTABanner
        title="Is your current site ready for 2026?"
        description="In 30 minutes we analyze your current site and tell you exactly what it needs to be indexed by LLMs and AI agents."
        buttonText="Schedule your free diagnosis"
        buttonHref="/contacto"
      />

      <StickyMobileCta text="Diagnóstico gratuito →" url="/contacto" accentColor="#06B6D4" />
    </PageWrapper>
  );
}
