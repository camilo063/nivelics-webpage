# Auditoría de contenido hardcodeado vs CMS

**Fecha:** 2026-05-07
**Total páginas:** 54

- 🟢 Conectadas: 50
- 🟡 Parciales: 3
- 🔴 Hardcodeadas: 1

---

## HOME (1)

| Estado | Archivo        | Imports CMS                                                                                             | Campos faltantes | Arrays hardcoded |
| ------ | -------------- | ------------------------------------------------------------------------------------------------------- | ---------------- | ---------------- |
| 🟢     | `.../page.tsx` | getHubServicios, getAllIndustrias, getAllCasosExito, getHomeContent, getAllProductosHub, getAllUiLabels | —                | —                |

## SUBSERVICIOS (24)

| Estado | Archivo                                                                  | Imports CMS                                          | Campos faltantes                                                                                                  | Arrays hardcoded                                                                               |
| ------ | ------------------------------------------------------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 🟢     | `.../servicios/cloud/finops/page.tsx`                                    | getServicioData                                      | description, faqs                                                                                                 | PILLARS_ES, PILLARS_EN                                                                         |
| 🟢     | `.../servicios/cloud/infraestructura/page.tsx`                           | getServicioData                                      | description, faqs                                                                                                 | BENEFITS                                                                                       |
| 🟢     | `.../servicios/cloud/migracion-aws/page.tsx`                             | getServicioData                                      | description, faqs                                                                                                 | BENEFITS                                                                                       |
| 🟢     | `.../servicios/cloud/page.tsx`                                           | getServicioData, getSubserviciosData, getAllUiLabels | description                                                                                                       | SUB_SERVICES                                                                                   |
| 🟢     | `.../servicios/cloud/seguridad/page.tsx`                                 | getServicioData                                      | description, faqs                                                                                                 | BENEFITS                                                                                       |
| 🟢     | `.../servicios/cloud/serverless/page.tsx`                                | getServicioData                                      | description, faqs                                                                                                 | BENEFITS                                                                                       |
| 🟢     | `.../servicios/desarrollo-digital/apps-moviles/page.tsx`                 | getServicioData                                      | description, faqs                                                                                                 | BENEFITS                                                                                       |
| 🟢     | `.../servicios/desarrollo-digital/ecommerce/page.tsx`                    | getServicioData                                      | description, faqs                                                                                                 | BENEFITS                                                                                       |
| 🟢     | `.../servicios/desarrollo-digital/page.tsx`                              | getServicioData, getSubserviciosData, getAllUiLabels | description                                                                                                       | SUB_SERVICES                                                                                   |
| 🟢     | `.../servicios/desarrollo-digital/plataformas-web/page.tsx`              | getServicioData                                      | description, faqs                                                                                                 | BENEFITS                                                                                       |
| 🟡     | `.../servicios/desarrollo-digital/sitios-web-agentic/page.tsx`           | getServicioData                                      | description, metrics, faqs                                                                                        | PAIN_CARDS_ES, PAIN_CARDS_EN, PROCESS_PHASES_ES, PROCESS_PHASES_EN, FAQ_ITEMS_ES, FAQ_ITEMS_EN |
| 🟢     | `.../servicios/inteligencia-artificial/agentes-comerciales/page.tsx`     | getServicioData                                      | description                                                                                                       | —                                                                                              |
| 🟢     | `.../servicios/inteligencia-artificial/agentes-ia/page.tsx`              | getServicioData                                      | description                                                                                                       | —                                                                                              |
| 🟢     | `.../servicios/inteligencia-artificial/automatizacion-procesos/page.tsx` | getServicioData                                      | description                                                                                                       | —                                                                                              |
| 🟢     | `.../servicios/inteligencia-artificial/gestion-contenido/page.tsx`       | getServicioData                                      | description                                                                                                       | —                                                                                              |
| 🟢     | `.../servicios/inteligencia-artificial/marketing-crm/page.tsx`           | getServicioData                                      | description                                                                                                       | —                                                                                              |
| 🟢     | `.../servicios/inteligencia-artificial/page.tsx`                         | getServicioData, getSubserviciosData, getAllUiLabels | description                                                                                                       | SUB_SERVICES                                                                                   |
| 🟡     | `.../servicios/page.tsx`                                                 | getServicioData                                      | subtitle, benefits, processSteps, metrics, faqs, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl | —                                                                                              |
| 🟢     | `.../servicios/staff-augmentation/datos-ia/page.tsx`                     | getServicioData                                      | description, faqs                                                                                                 | BENEFITS, DATA_ROLES                                                                           |
| 🟢     | `.../servicios/staff-augmentation/desarrollo-software/page.tsx`          | getServicioData                                      | description, faqs                                                                                                 | BENEFITS                                                                                       |
| 🟢     | `.../servicios/staff-augmentation/devops-cloud/page.tsx`                 | getServicioData                                      | description, faqs                                                                                                 | BENEFITS, DEVOPS_ROLES                                                                         |
| 🟢     | `.../servicios/staff-augmentation/diseno-ux-ui/page.tsx`                 | getServicioData                                      | description, faqs                                                                                                 | BENEFITS, DESIGN_ROLES                                                                         |
| 🟢     | `.../servicios/staff-augmentation/page.tsx`                              | getServicioData, getSubserviciosData, getAllUiLabels | description                                                                                                       | SUB_SERVICES                                                                                   |
| 🟢     | `.../servicios/staff-augmentation/qa-seguridad/page.tsx`                 | getServicioData                                      | description, faqs                                                                                                 | BENEFITS, QA_ROLES                                                                             |

## INDUSTRIAS (7)

| Estado | Archivo                                          | Imports CMS                      | Campos faltantes                                                                                     | Arrays hardcoded      |
| ------ | ------------------------------------------------ | -------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------- |
| 🟢     | `.../industrias/fintech/page.tsx`                | getIndustria                     | differentiators, metrics, useCases, playbook, industryFaqs                                           | CHALLENGES, SOLUTIONS |
| 🟢     | `.../industrias/logistica/page.tsx`              | getIndustria                     | differentiators, metrics, useCases, playbook, industryFaqs                                           | CHALLENGES, SOLUTIONS |
| 🟢     | `.../industrias/manufactura/page.tsx`            | getIndustria                     | differentiators, metrics, useCases, playbook, industryFaqs                                           | CHALLENGES, SOLUTIONS |
| 🟢     | `.../industrias/medios-entretenimiento/page.tsx` | getIndustria                     | differentiators, metrics, useCases, playbook, industryFaqs                                           | CHALLENGES, SOLUTIONS |
| 🟡     | `.../industrias/page.tsx`                        | getAllIndustrias, getHomeContent | painPoints, solutions, differentiators, metrics, useCases, playbook, industryFaqs, ctaTitle, ctaText | —                     |
| 🟢     | `.../industrias/retail-ecommerce/page.tsx`       | getIndustria                     | differentiators, metrics, useCases, playbook, industryFaqs                                           | CHALLENGES, SOLUTIONS |
| 🟢     | `.../industrias/salud/page.tsx`                  | getIndustria                     | differentiators, metrics, useCases, playbook, industryFaqs                                           | CHALLENGES, SOLUTIONS |

## CASOS (8)

| Estado | Archivo                                     | Imports CMS                      | Campos faltantes | Arrays hardcoded |
| ------ | ------------------------------------------- | -------------------------------- | ---------------- | ---------------- |
| 🟢     | `.../casos-de-exito/ab-inbev/page.tsx`      | getCasoExito, getAllUiLabels     | —                | RESULTS          |
| 🟢     | `.../casos-de-exito/cronica/page.tsx`       | getCasoExito, getAllUiLabels     | —                | RESULTS          |
| 🟢     | `.../casos-de-exito/grupo-bolivar/page.tsx` | getCasoExito, getAllUiLabels     | —                | RESULTS          |
| 🟢     | `.../casos-de-exito/page.tsx`               | getAllCasosExito, getAllUiLabels | —                | CASES            |
| 🟢     | `.../casos-de-exito/pulzo/page.tsx`         | getCasoExito, getAllUiLabels     | —                | RESULTS          |
| 🟢     | `.../casos-de-exito/televisa/page.tsx`      | getCasoExito, getAllUiLabels     | —                | RESULTS          |
| 🟢     | `.../casos-de-exito/two-maids/page.tsx`     | getCasoExito, getAllUiLabels     | —                | RESULTS          |
| 🟢     | `.../casos-de-exito/univision/page.tsx`     | getCasoExito, getAllUiLabels     | —                | RESULTS          |

## NOSOTROS (5)

| Estado | Archivo                                 | Imports CMS              | Campos faltantes | Arrays hardcoded                |
| ------ | --------------------------------------- | ------------------------ | ---------------- | ------------------------------- |
| 🟢     | `.../nosotros/certificaciones/page.tsx` | getCertificacionesPublic | —                | CERTIFICATIONS                  |
| 🟢     | `.../nosotros/equipo/page.tsx`          | getTeamMembers           | —                | —                               |
| 🟢     | `.../nosotros/historia/page.tsx`        | getHistoriaItems         | —                | TIMELINE                        |
| 🔴     | `.../nosotros/metodologia/page.tsx`     | _none_                   | —                | FALLBACK_ROLES, FALLBACK_EVENTS |
| 🟢     | `.../nosotros/page.tsx`                 | getTeamMembers           | —                | VALUES                          |

## GENERAL (4)

| Estado | Archivo                             | Imports CMS    | Campos faltantes | Arrays hardcoded    |
| ------ | ----------------------------------- | -------------- | ---------------- | ------------------- |
| 🟢     | `.../contacto/page.tsx`             | getPageGeneral | —                | —                   |
| 🟢     | `.../privacidad/page.tsx`           | getPageGeneral | —                | —                   |
| 🟢     | `.../soporte/page.tsx`              | getPageGeneral | —                | FAQ_ITEMS, CHANNELS |
| 🟢     | `.../trabaja-con-nosotros/page.tsx` | getPageGeneral | —                | CULTURE_VALUES      |

## PRODUCTOS (2)

| Estado | Archivo                         | Imports CMS                        | Campos faltantes | Arrays hardcoded |
| ------ | ------------------------------- | ---------------------------------- | ---------------- | ---------------- |
| 🟢     | `.../productos/[slug]/page.tsx` | getAllProductos, getProductoBySlug | —                | —                |
| 🟢     | `.../productos/page.tsx`        | getAllProductosHub                 | —                | —                |

## BLOG (3)

| Estado | Archivo                                  | Imports CMS                                                                                                                            | Campos faltantes | Arrays hardcoded   |
| ------ | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------ |
| 🟢     | `.../blog/[slug]/page.tsx`               | getBlogPost, getAllBlogPostsLight, getBlogCategoriesPublic                                                                             | —                | —                  |
| 🟢     | `.../blog/categoria/[category]/page.tsx` | getBlogPostsByCategory, getBlogCategoryBySlug                                                                                          | —                | FALLBACK_ALL_POSTS |
| 🟢     | `.../blog/page.tsx`                      | getAllBlogPostsLight, getFeaturedBlogPost, getActiveBlogCategories, getBlogPostsByCategory, getBlogCategoryBySlug, getPopularBlogPosts | —                | —                  |

---

## Detalle por archivo

### 🟢 `app/[locale]/(marketing)/blog/[slug]/page.tsx`

- **CMS imports**: getBlogPost, getAllBlogPostsLight, getBlogCategoriesPublic

### 🟢 `app/[locale]/(marketing)/blog/categoria/[category]/page.tsx`

- **CMS imports**: getBlogPostsByCategory, getBlogCategoryBySlug
- **Arrays hardcoded**: FALLBACK_ALL_POSTS

### 🟢 `app/[locale]/(marketing)/blog/page.tsx`

- **CMS imports**: getAllBlogPostsLight, getFeaturedBlogPost, getActiveBlogCategories, getBlogPostsByCategory, getBlogCategoryBySlug, getPopularBlogPosts

### 🟢 `app/[locale]/(marketing)/casos-de-exito/ab-inbev/page.tsx`

- **CMS imports**: getCasoExito, getAllUiLabels
- **Arrays hardcoded**: RESULTS

### 🟢 `app/[locale]/(marketing)/casos-de-exito/cronica/page.tsx`

- **CMS imports**: getCasoExito, getAllUiLabels
- **Arrays hardcoded**: RESULTS

### 🟢 `app/[locale]/(marketing)/casos-de-exito/grupo-bolivar/page.tsx`

- **CMS imports**: getCasoExito, getAllUiLabels
- **Arrays hardcoded**: RESULTS

### 🟢 `app/[locale]/(marketing)/casos-de-exito/page.tsx`

- **CMS imports**: getAllCasosExito, getAllUiLabels
- **Arrays hardcoded**: CASES

### 🟢 `app/[locale]/(marketing)/casos-de-exito/pulzo/page.tsx`

- **CMS imports**: getCasoExito, getAllUiLabels
- **Arrays hardcoded**: RESULTS

### 🟢 `app/[locale]/(marketing)/casos-de-exito/televisa/page.tsx`

- **CMS imports**: getCasoExito, getAllUiLabels
- **Arrays hardcoded**: RESULTS

### 🟢 `app/[locale]/(marketing)/casos-de-exito/two-maids/page.tsx`

- **CMS imports**: getCasoExito, getAllUiLabels
- **Arrays hardcoded**: RESULTS

### 🟢 `app/[locale]/(marketing)/casos-de-exito/univision/page.tsx`

- **CMS imports**: getCasoExito, getAllUiLabels
- **Arrays hardcoded**: RESULTS

### 🟢 `app/[locale]/(marketing)/contacto/page.tsx`

- **CMS imports**: getPageGeneral

### 🟢 `app/[locale]/(marketing)/industrias/fintech/page.tsx`

- **CMS imports**: getIndustria
- **Campos usados**: name, heroTitle, heroSubtitle, painPoints, solutions, ctaTitle, ctaText
- **Campos faltantes**: differentiators, metrics, useCases, playbook, industryFaqs
- **Arrays hardcoded**: CHALLENGES, SOLUTIONS

### 🟢 `app/[locale]/(marketing)/industrias/logistica/page.tsx`

- **CMS imports**: getIndustria
- **Campos usados**: name, heroTitle, heroSubtitle, painPoints, solutions, ctaTitle, ctaText
- **Campos faltantes**: differentiators, metrics, useCases, playbook, industryFaqs
- **Arrays hardcoded**: CHALLENGES, SOLUTIONS

### 🟢 `app/[locale]/(marketing)/industrias/manufactura/page.tsx`

- **CMS imports**: getIndustria
- **Campos usados**: name, heroTitle, heroSubtitle, painPoints, solutions, ctaTitle, ctaText
- **Campos faltantes**: differentiators, metrics, useCases, playbook, industryFaqs
- **Arrays hardcoded**: CHALLENGES, SOLUTIONS

### 🟢 `app/[locale]/(marketing)/industrias/medios-entretenimiento/page.tsx`

- **CMS imports**: getIndustria
- **Campos usados**: name, heroTitle, heroSubtitle, painPoints, solutions, ctaTitle, ctaText
- **Campos faltantes**: differentiators, metrics, useCases, playbook, industryFaqs
- **Arrays hardcoded**: CHALLENGES, SOLUTIONS

### 🟡 `app/[locale]/(marketing)/industrias/page.tsx`

- **CMS imports**: getAllIndustrias, getHomeContent
- **Campos usados**: name, heroTitle, heroSubtitle
- **Campos faltantes**: painPoints, solutions, differentiators, metrics, useCases, playbook, industryFaqs, ctaTitle, ctaText
- **Notas**: Missing 9/12 expected fields

### 🟢 `app/[locale]/(marketing)/industrias/retail-ecommerce/page.tsx`

- **CMS imports**: getIndustria
- **Campos usados**: name, heroTitle, heroSubtitle, painPoints, solutions, ctaTitle, ctaText
- **Campos faltantes**: differentiators, metrics, useCases, playbook, industryFaqs
- **Arrays hardcoded**: CHALLENGES, SOLUTIONS

### 🟢 `app/[locale]/(marketing)/industrias/salud/page.tsx`

- **CMS imports**: getIndustria
- **Campos usados**: name, heroTitle, heroSubtitle, painPoints, solutions, ctaTitle, ctaText
- **Campos faltantes**: differentiators, metrics, useCases, playbook, industryFaqs
- **Arrays hardcoded**: CHALLENGES, SOLUTIONS

### 🟢 `app/[locale]/(marketing)/nosotros/certificaciones/page.tsx`

- **CMS imports**: getCertificacionesPublic
- **Arrays hardcoded**: CERTIFICATIONS

### 🟢 `app/[locale]/(marketing)/nosotros/equipo/page.tsx`

- **CMS imports**: getTeamMembers

### 🟢 `app/[locale]/(marketing)/nosotros/historia/page.tsx`

- **CMS imports**: getHistoriaItems
- **Arrays hardcoded**: TIMELINE

### 🔴 `app/[locale]/(marketing)/nosotros/metodologia/page.tsx`

- **CMS imports**: _none_
- **Arrays hardcoded**: FALLBACK_ROLES, FALLBACK_EVENTS
- **Notas**: No CMS query imports detected

### 🟢 `app/[locale]/(marketing)/nosotros/page.tsx`

- **CMS imports**: getTeamMembers
- **Arrays hardcoded**: VALUES

### 🟢 `app/[locale]/(marketing)/page.tsx`

- **CMS imports**: getHubServicios, getAllIndustrias, getAllCasosExito, getHomeContent, getAllProductosHub, getAllUiLabels
- **Campos usados**: heroTitle, heroSubtitle, heroBadge, metrics, trustBarTitle, servicesSectionTitle, casesSectionTitle, mapTitle, whyUsTitle, whyUsItems, faqs, finalCtaTitle, industriasSectionTitle, processSteps

### 🟢 `app/[locale]/(marketing)/privacidad/page.tsx`

- **CMS imports**: getPageGeneral

### 🟢 `app/[locale]/(marketing)/productos/[slug]/page.tsx`

- **CMS imports**: getAllProductos, getProductoBySlug

### 🟢 `app/[locale]/(marketing)/productos/page.tsx`

- **CMS imports**: getAllProductosHub

### 🟢 `app/[locale]/(marketing)/servicios/cloud/finops/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: PILLARS_ES, PILLARS_EN

### 🟢 `app/[locale]/(marketing)/servicios/cloud/infraestructura/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: BENEFITS

### 🟢 `app/[locale]/(marketing)/servicios/cloud/migracion-aws/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: BENEFITS

### 🟢 `app/[locale]/(marketing)/servicios/cloud/page.tsx`

- **CMS imports**: getServicioData, getSubserviciosData, getAllUiLabels
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, faqs, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description
- **Arrays hardcoded**: SUB_SERVICES

### 🟢 `app/[locale]/(marketing)/servicios/cloud/seguridad/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: BENEFITS

### 🟢 `app/[locale]/(marketing)/servicios/cloud/serverless/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: BENEFITS

### 🟢 `app/[locale]/(marketing)/servicios/desarrollo-digital/apps-moviles/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: BENEFITS

### 🟢 `app/[locale]/(marketing)/servicios/desarrollo-digital/ecommerce/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: BENEFITS

### 🟢 `app/[locale]/(marketing)/servicios/desarrollo-digital/page.tsx`

- **CMS imports**: getServicioData, getSubserviciosData, getAllUiLabels
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, faqs, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description
- **Arrays hardcoded**: SUB_SERVICES

### 🟢 `app/[locale]/(marketing)/servicios/desarrollo-digital/plataformas-web/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: BENEFITS

### 🟡 `app/[locale]/(marketing)/servicios/desarrollo-digital/sitios-web-agentic/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, metrics, faqs
- **Arrays hardcoded**: PAIN_CARDS_ES, PAIN_CARDS_EN, PROCESS_PHASES_ES, PROCESS_PHASES_EN, FAQ_ITEMS_ES, FAQ_ITEMS_EN
- **Notas**: 6 hardcoded array(s) detected

### 🟢 `app/[locale]/(marketing)/servicios/inteligencia-artificial/agentes-comerciales/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, faqs, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description

### 🟢 `app/[locale]/(marketing)/servicios/inteligencia-artificial/agentes-ia/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, faqs, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description

### 🟢 `app/[locale]/(marketing)/servicios/inteligencia-artificial/automatizacion-procesos/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, faqs, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description

### 🟢 `app/[locale]/(marketing)/servicios/inteligencia-artificial/gestion-contenido/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, faqs, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description

### 🟢 `app/[locale]/(marketing)/servicios/inteligencia-artificial/marketing-crm/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, faqs, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description

### 🟢 `app/[locale]/(marketing)/servicios/inteligencia-artificial/page.tsx`

- **CMS imports**: getServicioData, getSubserviciosData, getAllUiLabels
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, faqs, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description
- **Arrays hardcoded**: SUB_SERVICES

### 🟡 `app/[locale]/(marketing)/servicios/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, description
- **Campos faltantes**: subtitle, benefits, processSteps, metrics, faqs, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Notas**: Missing 9/11 expected fields

### 🟢 `app/[locale]/(marketing)/servicios/staff-augmentation/datos-ia/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: BENEFITS, DATA_ROLES

### 🟢 `app/[locale]/(marketing)/servicios/staff-augmentation/desarrollo-software/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: BENEFITS

### 🟢 `app/[locale]/(marketing)/servicios/staff-augmentation/devops-cloud/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: BENEFITS, DEVOPS_ROLES

### 🟢 `app/[locale]/(marketing)/servicios/staff-augmentation/diseno-ux-ui/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: BENEFITS, DESIGN_ROLES

### 🟢 `app/[locale]/(marketing)/servicios/staff-augmentation/page.tsx`

- **CMS imports**: getServicioData, getSubserviciosData, getAllUiLabels
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, faqs, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description
- **Arrays hardcoded**: SUB_SERVICES

### 🟢 `app/[locale]/(marketing)/servicios/staff-augmentation/qa-seguridad/page.tsx`

- **CMS imports**: getServicioData
- **Campos usados**: title, subtitle, benefits, processSteps, metrics, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl
- **Campos faltantes**: description, faqs
- **Arrays hardcoded**: BENEFITS, QA_ROLES

### 🟢 `app/[locale]/(marketing)/soporte/page.tsx`

- **CMS imports**: getPageGeneral
- **Arrays hardcoded**: FAQ_ITEMS, CHANNELS

### 🟢 `app/[locale]/(marketing)/trabaja-con-nosotros/page.tsx`

- **CMS imports**: getPageGeneral
- **Arrays hardcoded**: CULTURE_VALUES
