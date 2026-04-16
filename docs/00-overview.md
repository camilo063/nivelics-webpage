# 00 — Site overview

## What Nivelics is

Nivelics is a **Colombian B2B digital-transformation company** founded in 2012,
based in Bogotá + Miami, with projects in 7+ countries across LATAM and USA.

Three integrated service lines:

1. **Inteligencia Artificial aplicada** — agents, automation, RAG
2. **Cloud con gobierno real** — AWS, GCP, Azure, FinOps
3. **Staff Augmentation premium** — bilingual tech talent integrated in 5 days

Plus **3 proprietary SaaS products** that Nivelics built and sells:

- **PAYWL** — paywall engine for LATAM media
- **Niveleads** — B2B lead scoring with AI
- **Hirely** — intelligent recruitment with AI

## What this site does

`nivelics.com` is the **marketing + lead-capture site** for the consulting
business and the front door for the three SaaS products. It is not an app
users log into (except the admin CMS at `/admin/*`).

Primary goals, roughly in order:

1. Generate qualified leads for consulting services (contact form, diagnóstico)
2. Rank for service + industry queries in LATAM (`IA Colombia`, `cloud LATAM`, etc.)
3. Surface the SaaS products to outbound-eligible prospects
4. **Be readable by AI agents / LLM crawlers** — this is a first-class goal, not an afterthought

## Audience & languages

- **Primary**: Spanish-speaking B2B decision-makers in LATAM (C-level, VP of Tech,
  directors of digital transformation).
- **Secondary**: English-speaking buyers in USA (especially Miami, Texas) and
  at LATAM subsidiaries of US multinationals.

The site is **bilingual** with Spanish as the canonical language. Every URL has
an ES and EN variant (see [02-routes.md](./02-routes.md)).

## What lives on the site

| Area                                       | What it holds                                                                                                              |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Home                                       | Hero + three pillars (I+C+S) + metrics + case carousel + SaaS strip + LATAM map + industries + differentiators + FAQ + CTA |
| `/servicios/*`                             | 4 hub pages + 18 sub-service pages (AI, Cloud, Staffing, Dev)                                                              |
| `/industrias/*`                            | 6 industry verticals (fintech, media, healthcare, retail, logistics, manufacturing)                                        |
| `/productos/*`                             | SaaS hub + 3 detail pages with Schema.org SoftwareApplication                                                              |
| `/nosotros/*`                              | About, history, team, methodology, certifications                                                                          |
| `/casos-de-exito/*`                        | 7 client case studies (Televisa, Grupo Bolívar, Two Maids, AB InBev, Crónica, Pulzo, Univision)                            |
| `/blog`                                    | Blog (CMS-driven)                                                                                                          |
| `/lp/[slug]`                               | Ad landing pages (CMS-driven, lead-capture focused)                                                                        |
| `/admin/*`                                 | Session-based CMS for all content above                                                                                    |
| `/llms.txt`, `/sitemap.xml`, `/robots.txt` | Machine-readable surfaces — see [05-seo-agentic.md](./05-seo-agentic.md)                                                   |

## What the site is NOT

- Not an e-commerce site (no checkout, no cart)
- Not a marketplace (no multi-tenant vendors)
- Not a product app (login is admin-only)
- Not static-only — content is DB-driven with CMS overrides and hardcoded
  fallbacks. See [03-cms-data-model.md](./03-cms-data-model.md).
