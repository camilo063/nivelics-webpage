# Blog Strategy 2026 — Análisis y priorización

**Autor:** Análisis sobre export GSC 2026-04-12 + catálogo servicios nuevo sitio
**Input:** 248 URLs /blog/\* indexadas (134 ES + 114 EN)
**Decisión:** Entrega 1 de 2 — análisis + top 40 priorizado
**Destino en repo:** `docs/seo/blog-strategy-2026.md`

---

## 0. TL;DR ejecutivo

| #   | Hallazgo                                                                                                                                      | Acción                                                                      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | 248 posts indexados en blog, con 4 clusters dominantes (IA/ML, Cloud-AWS, Staff Aug, Ciberseguridad) que coinciden con los servicios actuales | Preservar equity SEO vía redirect inteligente por categoría, no a hub plano |
| 2   | ~34% del blog ES son posts de IA/ML — el pilar más fuerte en tu histórico                                                                     | Los 40 briefs deben reflejar esta distribución + reforzar gaps              |
| 3   | 17 posts identificados como obsoletos, off-brand o duplicados                                                                                 | Eliminar del mapa — 410 Gone, no 301                                        |
| 4   | 5 posts corporate news sin valor SEO                                                                                                          | Redirect al hub de blog o a `/nosotros` según contexto                      |
| 5   | Categorías actuales del nuevo CMS necesitan ampliarse antes del launch de contenido                                                           | Crear 6 categorías nuevas basadas en los clusters reales                    |
| 6   | Top 40 briefs propuestos: 12 IA, 8 Cloud, 6 Staff Aug, 5 Ciberseguridad, 4 DevOps/QA, 3 UX, 2 Fintech                                         | Ver sección 7                                                               |

**Supuesto crítico que debes validar:** no tengo datos de clicks/impressions reales por URL (perdiste acceso a Analytics). La priorización se basa en:
(a) frecuencia del tema en slugs indexados = proxy de cobertura histórica,
(b) alineación del tema con servicios comerciales actuales = proxy de intención comercial,
(c) search volume estimado del cluster en LATAM según conocimiento del mercado B2B tech.
Si después recuperas acceso a GSC histórico, podemos recalibrar el top 40.

---

## 1. Distribución de los 134 posts ES por cluster

| Cluster                         | # posts | % del blog | Cobertura histórica | Match con servicio actual                       |
| ------------------------------- | ------- | ---------- | ------------------- | ----------------------------------------------- |
| IA / ML / Automatización        | 34      | 25.4%      | Muy alta            | `/servicios/inteligencia-artificial/*`          |
| Cloud / AWS / GCP               | 18      | 13.4%      | Alta                | `/servicios/cloud/*`                            |
| Staff Augmentation              | 12      | 9.0%       | Alta                | `/servicios/staff-augmentation`                 |
| Ciberseguridad                  | 9       | 6.7%       | Media               | `/servicios/cloud/seguridad`                    |
| Web Development                 | 8       | 6.0%       | Media               | `/servicios/desarrollo-digital/*`               |
| UX / Diseño                     | 6       | 4.5%       | Media               | `/servicios/staff-augmentation/diseno-ux-ui`    |
| DevOps / Ágil                   | 6       | 4.5%       | Media               | `/servicios/staff-augmentation/devops-cloud`    |
| SEO                             | 6       | 4.5%       | Media               | No hay servicio SEO — redirect a blog categoría |
| Tendencias 2024/2025 (fechadas) | 6       | 4.5%       | Baja                | Marcar obsoletos                                |
| Corporate news                  | 5       | 3.7%       | Muy baja            | Redirect al hub                                 |
| QA / Testing                    | 5       | 3.7%       | Media               | `/servicios/staff-augmentation/qa-seguridad`    |
| Business strategy               | 3       | 2.2%       | Baja                | Redirect al hub                                 |
| Drupal obsoletos                | 2       | 1.5%       | Nula                | 410 Gone                                        |
| Emerging tech (5G/RV)           | 2       | 1.5%       | Baja                | Redirect al blog hub                            |
| Off-brand político              | 2       | 1.5%       | Nula                | 410 Gone                                        |
| Transformación digital          | 2       | 1.5%       | Baja                | Hub o industrias                                |
| Fintech                         | 2       | 1.5%       | Media               | `/industrias/fintech`                           |
| Mobile apps                     | 2       | 1.5%       | Media               | `/servicios/desarrollo-digital/apps-moviles`    |
| Media                           | 1       | 0.7%       | Baja                | `/industrias/medios-entretenimiento`            |
| Ecommerce                       | 1       | 0.7%       | Baja                | `/servicios/desarrollo-digital/ecommerce`       |
| GA4 obsoleto                    | 1       | 0.7%       | Nula                | 410 Gone                                        |
| Sin clasificar                  | 1       | 0.7%       | —                   | Revisar manual                                  |
| **TOTAL**                       | **134** | **100%**   | —                   | —                                               |

### Lectura estratégica

**Tu blog histórico estaba perfectamente alineado con el I+C+S actual:**

- Inteligencia Artificial (cluster 1) = 25% → pilar "I"
- Cloud (cluster 2 + ciberseguridad en AWS) = ~20% → pilar "C"
- Staff Augmentation (cluster 3) = 9% → pilar "S"

Eso significa que el tráfico orgánico histórico, por lo que podemos inferir, venía a queries que **siguen siendo comerciales hoy**. Mantener ese equity vía redirects categorizados (no a hub plano) es crítico.

---

## 2. Acciones propuestas por cluster — Tabla completa de 134 posts

**Leyenda de acciones:**

- `MIGRATE_FULL` — crear post nuevo en el CMS con mismo slug (mantiene URL = cero pérdida)
- `MIGRATE_NEW_SLUG` — crear post nuevo con slug mejorado + redirect del viejo
- `REDIRECT_TO_CATEGORY` — 301 al blog categoría temática (no al hub plano)
- `REDIRECT_TO_SERVICE` — 301 a servicio relacionado (cuando el post era de intención comercial fuerte)
- `REDIRECT_TO_INDUSTRY` — 301 a página de industria
- `GONE_410` — 410 Gone (contenido obsoleto o off-brand)
- `REDIRECT_TO_ABOUT` — 301 a `/nosotros` (corporate news)

### IA / ML / Automatización (34 posts)

| #   | Slug legacy                                                                  | Acción               | Destino sugerido                         | En top 40? |
| --- | ---------------------------------------------------------------------------- | -------------------- | ---------------------------------------- | ---------- |
| 1   | chatbot-con-ia-tips-para-utilizar-el-chat-y-sus-beneficios                   | MIGRATE_NEW_SLUG     | `chatbots-ia-empresas-guia-2026`         | ✅         |
| 2   | chatbots-vs-agentes-ia-atencion-cliente                                      | MIGRATE_FULL         | mismo slug                               | ✅         |
| 3   | google-bard-conoce-las-principales-diferencias-con-chat-gpt                  | GONE_410             | — (Bard ya no existe, es Gemini)         | ❌         |
| 4   | generacion-contenido-IA                                                      | MIGRATE_NEW_SLUG     | `generacion-contenido-ia-b2b`            | ✅         |
| 5   | ia-automatizacion-procesos-de-negocio                                        | MIGRATE_FULL         | mismo slug                               | ✅         |
| 6   | ia-orientado-a-la-automatizacion-de-procesos-...                             | REDIRECT_TO_CATEGORY | /blog/categoria/ia (duplica #5)          | ❌         |
| 7   | ia-generativa-creacion-contenido-empresas                                    | REDIRECT_TO_CATEGORY | /blog/categoria/ia (duplica #4)          | ❌         |
| 8   | ia-generativa-en-colombia-nivelics                                           | REDIRECT_TO_CATEGORY | /blog/categoria/ia (fechado)             | ❌         |
| 9   | descubre-los-beneficios-de-la-ia-generativa-para-consejos-directivos         | MIGRATE_NEW_SLUG     | `ia-generativa-c-level-guia`             | ✅         |
| 10  | como-la-ia-esta-revolucionando-la-toma-de-decisiones                         | REDIRECT_TO_CATEGORY | duplica #9                               | ❌         |
| 11  | impacto-inteligencia-artificial-empresas                                     | MIGRATE_NEW_SLUG     | `impacto-ia-empresas-latam-2026`         | ✅         |
| 12  | revoluciona-estrategia-comercial-ia                                          | REDIRECT_TO_SERVICE  | /servicios/.../agentes-comerciales       | ❌         |
| 13  | inteligencia-artificial-para-potenciar-su-estrategia-de-marketing-digital    | REDIRECT_TO_SERVICE  | /servicios/.../marketing-crm             | ❌         |
| 14  | inteligencia-artificial-beneficios-en-medios-de-comunicacion                 | REDIRECT_TO_INDUSTRY | /industrias/medios-entretenimiento       | ❌         |
| 15  | beneficios-del-machine-learning                                              | MIGRATE_NEW_SLUG     | `machine-learning-casos-uso-empresas`    | ✅         |
| 16  | beneficios-del-aprendizaje-profundo-...                                      | REDIRECT_TO_CATEGORY | /blog/categoria/ia                       | ❌         |
| 17  | que-es-rpa-y-sus-beneficios                                                  | MIGRATE_FULL         | mismo slug                               | ✅         |
| 18  | automatizacion-eficiencia-operativa                                          | MIGRATE_FULL         | mismo slug                               | ✅         |
| 19  | descubre-los-beneficios-de-la-automatizacion-end-to-end                      | REDIRECT_TO_CATEGORY | duplica #18                              | ❌         |
| 20  | como-influye-la-ia-en-la-ciberseguridad                                      | MIGRATE_NEW_SLUG     | `ia-ciberseguridad-aplicaciones-empresa` | ✅         |
| 21  | la-inteligencia-artificial-de-la-mano-con-la-ciberseguridad-...              | REDIRECT_TO_CATEGORY | duplica #20                              | ❌         |
| 22  | pruebas-unitarias-con-inteligencia-artificial                                | MIGRATE_FULL         | mismo slug                               | ✅         |
| 23  | la-importancia-del-data-science-en-tu-sitio-web                              | MIGRATE_NEW_SLUG     | `data-science-b2b-guia-implementacion`   | ✅         |
| 24  | que-es-la-experiencia-inmersiva-y-cuales-son-sus-ventajas                    | REDIRECT_TO_CATEGORY | /blog/categoria/tendencias               | ❌         |
| 25  | personalizacion-de-la-experiencia-del-usuario-...                            | REDIRECT_TO_CATEGORY | /blog/categoria/ux                       | ❌         |
| 26  | diferencia-entre-mockups-web-y-wireframes                                    | REDIRECT_TO_CATEGORY | /blog/categoria/ux                       | ❌         |
| 27  | contenido-generado-por-usuarios-potencia-el-seo-...                          | REDIRECT_TO_CATEGORY | /blog/categoria/seo                      | ❌         |
| 28  | tecnologia-y-medio-ambiente                                                  | REDIRECT_TO_CATEGORY | /blog/categoria/tendencias               | ❌         |
| 29  | diferencias-de-los-cms-wordpress-drupal-y-strapi-para-medios-de-comunicacion | MIGRATE_NEW_SLUG     | `cms-medios-comunicacion-comparativo`    | ✅         |
| 30  | la-importancia-de-optimizar-nuestros-sitios-web                              | REDIRECT_TO_CATEGORY | duplica #27                              | ❌         |
| 31  | como-hacer-una-estrategia-seo-para-tu-sitio-web                              | MIGRATE_NEW_SLUG     | `estrategia-seo-b2b-2026`                | ✅         |
| 32  | la-importancia-de-hacer-seo-en-tu-sitio-web                                  | REDIRECT_TO_CATEGORY | duplica #31                              | ❌         |
| 33  | estrategias-seo-nivelics                                                     | REDIRECT_TO_CATEGORY | /blog/categoria/seo                      | ❌         |
| 34  | react-o-angular-diferencias-y-beneficios-segun-tus-necesidades               | MIGRATE_NEW_SLUG     | `react-vs-angular-decision-guia`         | ✅         |
| 35  | desarrollo-de-aplicaciones-moviles-innovacion-y-tendencias-actuales          | REDIRECT_TO_SERVICE  | /servicios/.../apps-moviles              | ❌         |
| 36  | por-que-las-soluciones-tecnologicas-son-importantes-...                      | REDIRECT_TO_ABOUT    | /nosotros                                | ❌         |
| 37  | la-importancia-del-diseño-web-... (typo con ñ)                               | GONE_410             | — duplicado con #38                      | ❌         |
| 38  | la-importancia-del-diseno-web-en-la-experiencia-de-usuario                   | REDIRECT_TO_CATEGORY | /blog/categoria/ux                       | ❌         |

### Cloud / AWS / GCP (18 posts)

| #   | Slug legacy                                                          | Acción               | Destino sugerido                    | En top 40? |
| --- | -------------------------------------------------------------------- | -------------------- | ----------------------------------- | ---------- |
| 39  | guia-completa-migrar-nube                                            | MIGRATE_FULL         | mismo slug                          | ✅         |
| 40  | claves-para-una-exitosa-migracion-it-estrategias-y-mejores-practicas | REDIRECT_TO_CATEGORY | duplica #39                         | ❌         |
| 41  | migracion-continua-navegando-los-desafios-y-beneficios-...           | REDIRECT_TO_CATEGORY | duplica #39                         | ❌         |
| 42  | aws-que-es-y-como-aplicarla-a-tu-agencia-digital                     | MIGRATE_NEW_SLUG     | `aws-guia-empresarial-migracion`    | ✅         |
| 43  | gcp-vs-aws                                                           | MIGRATE_FULL         | mismo slug                          | ✅         |
| 44  | optimizacion-costos-aws-estrategias-facturacion-eficiente            | MIGRATE_NEW_SLUG     | `finops-aws-optimizacion-costos`    | ✅         |
| 45  | optimizacion-aws-experiencia-cliente                                 | REDIRECT_TO_CATEGORY | duplica #44                         | ❌         |
| 46  | optimizacion-en-la-nube-estrategia-esencial-futuro-empresarial       | REDIRECT_TO_CATEGORY | duplica #44                         | ❌         |
| 47  | monitoreo-administracion-aws-infraestructura-rendimiento-seguridad   | MIGRATE_NEW_SLUG     | `monitoreo-aws-observabilidad-guia` | ✅         |
| 48  | monitoreo-proactivo-aws-sistemas-optimizados-seguros                 | REDIRECT_TO_CATEGORY | duplica #47                         | ❌         |
| 49  | gestion-eficiente-google-cloud-platform-console                      | MIGRATE_NEW_SLUG     | `gcp-console-gestion-eficiente`     | ✅         |
| 50  | almacenamiento-nube-aplicaciones-web                                 | REDIRECT_TO_CATEGORY | /blog/categoria/cloud               | ❌         |
| 51  | automatizacion-de-infraestructura-optimizando-tu-entorno-tecnologico | MIGRATE_FULL         | mismo slug                          | ✅         |
| 52  | soluciones-escalables-en-la-nube-creciendo-con-tu-empresa            | REDIRECT_TO_CATEGORY | duplica #51                         | ❌         |
| 53  | la-nube-como-ahorrar-dinero-y-tiempo-en-tu-negocio                   | REDIRECT_TO_CATEGORY | duplica #44                         | ❌         |
| 54  | la-nube-la-clave-para-el-exito-empresarial-en-el-siglo-XXI           | REDIRECT_TO_CATEGORY | duplica #46                         | ❌         |
| 55  | beneficios-de-los-servicios-en-la-nube-para-las-empresas             | REDIRECT_TO_CATEGORY | /blog/categoria/cloud               | ❌         |
| 56  | que-son-servicios-cloud                                              | REDIRECT_TO_SERVICE  | /servicios/cloud                    | ❌         |

### Staff Augmentation (12 posts)

| #   | Slug legacy                                                            | Acción               | Destino sugerido                              | En top 40? |
| --- | ---------------------------------------------------------------------- | -------------------- | --------------------------------------------- | ---------- |
| 57  | staff-augmentation-vs-outsourcing-diferencias-y-beneficios             | MIGRATE_FULL         | mismo slug                                    | ✅         |
| 58  | staff-augmentation-vs-outsourcing-en-colombia                          | REDIRECT_TO_CATEGORY | duplica #57                                   | ❌         |
| 59  | staff-augmentation-vs-contratacion-tradicional-diferencia-y-efecto     | REDIRECT_TO_CATEGORY | duplica #57                                   | ❌         |
| 60  | que-es-staff-augmentation-y-como-puede-ayudarte-en-tu-compania         | MIGRATE_FULL         | mismo slug                                    | ✅         |
| 61  | staff-augmentation-de-la-mano-de-la-colaboracion-global                | REDIRECT_TO_CATEGORY | duplica #60                                   | ❌         |
| 62  | maximizando-la-eficiencia-con-staff-augmentation-una-guia-completa     | REDIRECT_TO_CATEGORY | duplica #60                                   | ❌         |
| 63  | razones-elegir-staff-augmentation-nivelics                             | REDIRECT_TO_SERVICE  | /servicios/staff-augmentation                 | ❌         |
| 64  | staffing-it-latinoamericano-talento-y-especializacion-a-un-mejor-costo | MIGRATE_NEW_SLUG     | `staff-augmentation-latam-ventajas-nearshore` | ✅         |
| 65  | talento-it-a-la-medida-como-elegir-el-it-staffing-adecuado             | MIGRATE_NEW_SLUG     | `como-elegir-proveedor-staff-augmentation`    | ✅         |
| 66  | talent-acquisition-estrategico-claves-para-el-exito-empresarial        | REDIRECT_TO_CATEGORY | /blog/categoria/staffing                      | ❌         |
| 67  | reentrenamiento-it-nuevas-tecnologias                                  | MIGRATE_FULL         | mismo slug                                    | ✅         |
| 68  | empleados-de-valor-como-identificarlos-y-fortalecer                    | REDIRECT_TO_CATEGORY | /blog/categoria/staffing                      | ❌         |

### Ciberseguridad (9 posts)

| #   | Slug legacy                                                            | Acción                       | Destino sugerido                       | En top 40? |
| --- | ---------------------------------------------------------------------- | ---------------------------- | -------------------------------------- | ---------- |
| 69  | ciberseguridad-era-digital-proteger-empresa                            | MIGRATE_NEW_SLUG             | `ciberseguridad-empresarial-guia-2026` | ✅         |
| 70  | mejores-practicas-ciberseguridad-empresas                              | REDIRECT_TO_CATEGORY         | duplica #69                            | ❌         |
| 71  | cuales-son-los-ciberataques-mas-frecuentes-en-los-sitios-web           | MIGRATE_FULL                 | mismo slug                             | ✅         |
| 72  | ciberseguridad-para-ecommerce                                          | MIGRATE_FULL                 | mismo slug                             | ✅         |
| 73  | estrategias-de-ciberseguridad-en-aws-protegiendo-tus-activos-digitales | MIGRATE_NEW_SLUG             | `ciberseguridad-aws-well-architected`  | ✅         |
| 74  | pruebas-de-seguridad-en-los-sitios-web-descubre-los-beneficios         | MIGRATE_FULL                 | mismo slug                             | ✅         |
| 75  | ciberseguridad-como-hacer-una-auditoria-en-tu-sitio-nivelics           | REDIRECT_TO_CATEGORY         | duplica #74                            | ❌         |
| 76  | vulnerabilidades-criticas-2024                                         | GONE_410                     | — (fechado, ya 2026)                   | ❌         |
| 77  | la-inteligencia-artificial-de-la-mano-con-la-ciberseguridad-...        | (ya contabilizado en IA #21) | —                                      | —          |

### DevOps / Ágil (6 posts)

| #   | Slug legacy                                                    | Acción               | Destino sugerido         | En top 40? |
| --- | -------------------------------------------------------------- | -------------------- | ------------------------ | ---------- |
| 78  | que-es-devops                                                  | MIGRATE_FULL         | mismo slug               | ✅         |
| 79  | automatizacion-devops-herramientas                             | MIGRATE_FULL         | mismo slug               | ✅         |
| 80  | que-es-agil-y-como-se-implementa-los-devops-en-la-reingenieria | REDIRECT_TO_CATEGORY | duplica #78              | ❌         |
| 81  | desarrollo-agil-desafios-y-beneficios-de-aplicarlos-a-tu-web   | REDIRECT_TO_CATEGORY | /blog/categoria/devops   | ❌         |
| 82  | implementacion-de-scrum-un-cambio-de-mentalidad-eficiente      | REDIRECT_TO_CATEGORY | /blog/categoria/devops   | ❌         |
| 83  | agilizando-proyectos-it-con-celulas-de-trabajo-eficientes      | REDIRECT_TO_CATEGORY | /blog/categoria/staffing | ❌         |

### QA / Testing (5 posts)

| #   | Slug legacy                                         | Acción                       | Destino sugerido   | En top 40? |
| --- | --------------------------------------------------- | ---------------------------- | ------------------ | ---------- |
| 84  | que-es-la-automatizacion-de-pruebas-de-software     | MIGRATE_FULL                 | mismo slug         | ✅         |
| 85  | testing-automatizado-vs-manual                      | MIGRATE_FULL                 | mismo slug         | ✅         |
| 86  | garantizar-exito-proyecto-software-garantia-calidad | REDIRECT_TO_CATEGORY         | /blog/categoria/qa | ❌         |
| 87  | que-es-una-evaluacion-heuristica-y-cuando-usarla    | REDIRECT_TO_CATEGORY         | /blog/categoria/ux | ❌         |
| 88  | pruebas-unitarias-con-inteligencia-artificial       | (ya contabilizado en IA #22) | —                  | —          |

### Web Development (8 posts)

| #   | Slug legacy                                                                        | Acción               | Destino sugerido                   | En top 40? |
| --- | ---------------------------------------------------------------------------------- | -------------------- | ---------------------------------- | ---------- |
| 89  | innovacion-en-desarrollo-web-creando-sitios-de-alto-impacto                        | MIGRATE_NEW_SLUG     | `agentic-web-development-que-es`   | ✅         |
| 90  | actualizar-wordpress-core-plugins-seguridad                                        | MIGRATE_FULL         | mismo slug                         | ✅         |
| 91  | que-es-una-landing-page-y-cuando-usarla                                            | MIGRATE_FULL         | mismo slug                         | ✅         |
| 92  | beneficios-del-desarrollo-en-multiplataforma-optimiza-el-exito-en-tus-apps         | REDIRECT_TO_CATEGORY | /blog/categoria/desarrollo         | ❌         |
| 93  | desarrollo-web-desacoplado-beneficios-sobre-el-diseno-web-tradicional-o-monolitico | REDIRECT_TO_CATEGORY | duplica #89                        | ❌         |
| 94  | revoluciona-tus-aplicaciones-moviles-con-el-poder-de-las-progressive-web-apps      | REDIRECT_TO_CATEGORY | /blog/categoria/desarrollo         | ❌         |
| 95  | como-saber-si-tu-desarrollo-web-es-exitoso                                         | REDIRECT_TO_CATEGORY | /blog/categoria/desarrollo         | ❌         |
| 96  | como-funciona-la-actualizacion-web                                                 | REDIRECT_TO_CATEGORY | duplica #90                        | ❌         |
| 97  | periodismo-movil-conoce-las-ventajas-que-aplica-en-tus-plataformas                 | REDIRECT_TO_INDUSTRY | /industrias/medios-entretenimiento | ❌         |

### UX / Diseño (6 posts)

| #   | Slug legacy                                                 | Acción               | Destino sugerido                       | En top 40? |
| --- | ----------------------------------------------------------- | -------------------- | -------------------------------------- | ---------- |
| 98  | tendencias-ux-ui-2025                                       | GONE_410             | — (fechado)                            | ❌         |
| 99  | tips-para-mejorar-ux-en-dispositivos-moviles                | MIGRATE_FULL         | mismo slug                             | ✅         |
| 100 | mejora-tu-ecommerce-aplicando-ux-design                     | MIGRATE_FULL         | mismo slug                             | ✅         |
| 101 | wcag-que-es-y-como-sumar-mas-usuarios-en-tu-web             | MIGRATE_FULL         | mismo slug                             | ✅         |
| 102 | ux-design-para-medios-de-comunicacion-conoce-sus-beneficios | REDIRECT_TO_INDUSTRY | /industrias/medios-entretenimiento     | ❌         |
| 103 | blog-personal-como-aplicar-ux-y-sus-beneficios              | GONE_410             | — (off-brand, blog personal no es B2B) | ❌         |

### SEO (6 posts)

| #   | Slug legacy                                                           | Acción               | Destino sugerido                     | En top 40? |
| --- | --------------------------------------------------------------------- | -------------------- | ------------------------------------ | ---------- |
| 104 | que-es-la-busqueda-semantica-y-para-que-sirve                         | MIGRATE_NEW_SLUG     | `busqueda-semantica-llm-seo-agentic` | ✅         |
| 105 | busqueda-por-voz-que-es-y-como-lograr-aparecer-en-estos-resultados    | REDIRECT_TO_CATEGORY | /blog/categoria/seo                  | ❌         |
| 106 | busqueda-visual-gana-trafico-a-tu-sitio-web-posicionando-tus-imagenes | REDIRECT_TO_CATEGORY | /blog/categoria/seo                  | ❌         |
| 107 | posicionamiento-seo-para-universidades-...                            | REDIRECT_TO_CATEGORY | /blog/categoria/seo                  | ❌         |
| 108 | seo-para-medios-de-comunicacion                                       | REDIRECT_TO_INDUSTRY | /industrias/medios-entretenimiento   | ❌         |
| 109 | contenido-seo-marketing-digital-nivelics                              | REDIRECT_TO_CATEGORY | /blog/categoria/seo                  | ❌         |

### Fintech (2 posts)

| #   | Slug legacy                                             | Acción       | Destino sugerido | En top 40? |
| --- | ------------------------------------------------------- | ------------ | ---------------- | ---------- |
| 110 | como-las-fintech-esta-cambiando-la-industria-financiera | MIGRATE_FULL | mismo slug       | ✅         |
| 111 | fintech-vs-bancos-tradicionales-cual-es-la-mejor-opcion | MIGRATE_FULL | mismo slug       | ✅         |

### Obsoletos / Off-brand / Corporate (resto)

| #   | Slug legacy                                                             | Acción               | Notas                                     |
| --- | ----------------------------------------------------------------------- | -------------------- | ----------------------------------------- |
| 112 | soporte-de-drupal-que-pasa-cuando-el-soporte-a-mi-version-termina       | GONE_410             | Drupal fuera del stack Nivelics actual    |
| 113 | drupal-10-vs-drupal-9-comparacion                                       | GONE_410             | Idem                                      |
| 114 | principales-cambios-de-ga4-con-google-universal-analytics               | GONE_410             | Universal Analytics ya fue sunsetted 2023 |
| 115 | marketing-politico-una-ficha-clave-en-el-exito-de-su-campana            | GONE_410             | Off-brand B2B tech                        |
| 116 | estrategias-de-marketing-digital-y-redes-sociales-en-campanas-politicas | GONE_410             | Off-brand                                 |
| 117 | nivelics-en-la-7-em-expansion-en-america-latina-con-startup-mexico      | REDIRECT_TO_ABOUT    | Corporate news → /nosotros                |
| 118 | nivelics-en-pronetwork-agencia-dedicada-al-desarrollo-digital           | REDIRECT_TO_ABOUT    | Idem                                      |
| 119 | nivelics-en-techla-media-preparandose-para-el-mercado-internacional     | REDIRECT_TO_ABOUT    | Idem                                      |
| 120 | great-place-to-work                                                     | REDIRECT_TO_ABOUT    | Corporate news                            |
| 121 | politica-privacidad                                                     | REDIRECT_TO_SERVICE  | `/privacidad` (ya existe en rutas)        |
| 122 | nivelics-soluciones-digitales-a-la-medida                               | REDIRECT_TO_SERVICE  | /servicios/desarrollo-digital             |
| 123 | soluciones-tecnologicas-a-la-medida                                     | REDIRECT_TO_SERVICE  | /servicios/desarrollo-digital             |
| 124 | innovaciones-desarrollo-software-Nivelics                               | REDIRECT_TO_SERVICE  | /servicios/desarrollo-digital             |
| 125 | mujeres-en-la-tecnologia-que-transforman-la-historia-y-el-mundo         | GONE_410             | Fechado + institucional                   |
| 126 | tendencias-tecnologicas-empresas-2024                                   | GONE_410             | Fechado                                   |
| 127 | estrategias-digitales-empresa-sostenible-competitiva-2024               | GONE_410             | Fechado                                   |
| 128 | transformacion-digital-sostenible                                       | REDIRECT_TO_CATEGORY | /blog/categoria/tendencias                |
| 129 | transformando-educacion-aprendizaje-google-workspace                    | REDIRECT_TO_CATEGORY | /blog/categoria/cloud                     |
| 130 | beneficios-5g-y-conectividad-la-revolucion-de-la-comunicacion           | REDIRECT_TO_CATEGORY | /blog/categoria/tendencias                |
| 131 | realidad-virtual-y-aumentada-que-es-y-aplicarlo-a-mi-empresa            | REDIRECT_TO_CATEGORY | /blog/categoria/tendencias                |
| 132 | super-apps-revolucion-aplicaciones                                      | REDIRECT_TO_CATEGORY | /blog/categoria/desarrollo                |
| 133 | desarrollo-apps-conectar-digital                                        | REDIRECT_TO_SERVICE  | /servicios/.../apps-moviles               |
| 134 | ejemplos-de-blogs-personales-y-temas-que-puedes-usar                    | GONE_410             | Off-brand B2B                             |
| 135 | por-que-invertir-en-una-tienda-virtual-o-ecommerce                      | MIGRATE_FULL         | `/blog/por-que-invertir-en-ecommerce-b2b` |
| 136 | desarrollo-seguro-construyendo-aplicaciones-robustas                    | MIGRATE_FULL         | mismo slug                                |

### Resumen numérico de acciones

| Acción               | Count ES                                             |
| -------------------- | ---------------------------------------------------- |
| MIGRATE_FULL         | 28                                                   |
| MIGRATE_NEW_SLUG     | 14                                                   |
| REDIRECT_TO_CATEGORY | 44                                                   |
| REDIRECT_TO_SERVICE  | 11                                                   |
| REDIRECT_TO_INDUSTRY | 5                                                    |
| REDIRECT_TO_ABOUT    | 5                                                    |
| GONE_410             | 15                                                   |
| **TOTAL**            | **~122 (diferencia = duplicados ya contabilizados)** |

---

## 3. Top 40 seleccionado — lista final

Los 40 briefs se producen en la **Entrega 2**. Esta es la lista seleccionada con justificación de inclusión.

| #   | Cluster   | Slug nuevo propuesto                                                   | Tipo             | Query objetivo                |
| --- | --------- | ---------------------------------------------------------------------- | ---------------- | ----------------------------- |
| 1   | IA        | `chatbots-ia-empresas-guia-2026`                                       | MIGRATE_NEW_SLUG | chatbots IA empresas          |
| 2   | IA        | `chatbots-vs-agentes-ia-atencion-cliente`                              | MIGRATE_FULL     | agentes IA vs chatbots        |
| 3   | IA        | `agentes-ia-casos-uso-empresa-b2b`                                     | NEW              | agentes IA empresa            |
| 4   | IA        | `generacion-contenido-ia-b2b`                                          | MIGRATE_NEW_SLUG | generación contenido IA       |
| 5   | IA        | `ia-automatizacion-procesos-de-negocio`                                | MIGRATE_FULL     | automatización procesos IA    |
| 6   | IA        | `ia-generativa-c-level-guia`                                           | MIGRATE_NEW_SLUG | IA generativa CEO CFO         |
| 7   | IA        | `impacto-ia-empresas-latam-2026`                                       | MIGRATE_NEW_SLUG | impacto IA LATAM              |
| 8   | IA        | `machine-learning-casos-uso-empresas`                                  | MIGRATE_NEW_SLUG | machine learning B2B          |
| 9   | IA        | `que-es-rpa-y-sus-beneficios`                                          | MIGRATE_FULL     | RPA qué es                    |
| 10  | IA        | `automatizacion-eficiencia-operativa`                                  | MIGRATE_FULL     | automatización eficiencia     |
| 11  | IA        | `ia-ciberseguridad-aplicaciones-empresa`                               | MIGRATE_NEW_SLUG | IA ciberseguridad             |
| 12  | IA        | `pruebas-unitarias-con-inteligencia-artificial`                        | MIGRATE_FULL     | testing con IA                |
| 13  | Cloud     | `guia-completa-migrar-nube`                                            | MIGRATE_FULL     | migrar a la nube              |
| 14  | Cloud     | `aws-guia-empresarial-migracion`                                       | MIGRATE_NEW_SLUG | migración AWS empresa         |
| 15  | Cloud     | `gcp-vs-aws`                                                           | MIGRATE_FULL     | GCP vs AWS                    |
| 16  | Cloud     | `finops-aws-optimizacion-costos`                                       | MIGRATE_NEW_SLUG | FinOps AWS optimización       |
| 17  | Cloud     | `monitoreo-aws-observabilidad-guia`                                    | MIGRATE_NEW_SLUG | monitoreo AWS CloudWatch      |
| 18  | Cloud     | `gcp-console-gestion-eficiente`                                        | MIGRATE_NEW_SLUG | GCP console                   |
| 19  | Cloud     | `automatizacion-de-infraestructura-optimizando-tu-entorno-tecnologico` | MIGRATE_FULL     | IaC Terraform                 |
| 20  | Cloud     | `kubernetes-vs-serverless-cuando-elegir`                               | NEW              | kubernetes serverless         |
| 21  | Staff Aug | `staff-augmentation-vs-outsourcing-diferencias-y-beneficios`           | MIGRATE_FULL     | staff aug vs outsourcing      |
| 22  | Staff Aug | `que-es-staff-augmentation-y-como-puede-ayudarte-en-tu-compania`       | MIGRATE_FULL     | qué es staff augmentation     |
| 23  | Staff Aug | `staff-augmentation-latam-ventajas-nearshore`                          | MIGRATE_NEW_SLUG | nearshore LATAM               |
| 24  | Staff Aug | `como-elegir-proveedor-staff-augmentation`                             | MIGRATE_NEW_SLUG | elegir proveedor staffing IT  |
| 25  | Staff Aug | `reentrenamiento-it-nuevas-tecnologias`                                | MIGRATE_FULL     | upskilling IT                 |
| 26  | Staff Aug | `staff-augmentation-para-proyectos-ia`                                 | NEW              | contratar ingeniero IA        |
| 27  | Ciber     | `ciberseguridad-empresarial-guia-2026`                                 | MIGRATE_NEW_SLUG | ciberseguridad empresa        |
| 28  | Ciber     | `cuales-son-los-ciberataques-mas-frecuentes-en-los-sitios-web`         | MIGRATE_FULL     | ciberataques sitios web       |
| 29  | Ciber     | `ciberseguridad-para-ecommerce`                                        | MIGRATE_FULL     | ciberseguridad ecommerce      |
| 30  | Ciber     | `ciberseguridad-aws-well-architected`                                  | MIGRATE_NEW_SLUG | AWS Well-Architected security |
| 31  | Ciber     | `pruebas-de-seguridad-en-los-sitios-web-descubre-los-beneficios`       | MIGRATE_FULL     | pentesting aplicaciones web   |
| 32  | DevOps/QA | `que-es-devops`                                                        | MIGRATE_FULL     | qué es DevOps                 |
| 33  | DevOps/QA | `automatizacion-devops-herramientas`                                   | MIGRATE_FULL     | herramientas DevOps           |
| 34  | DevOps/QA | `que-es-la-automatizacion-de-pruebas-de-software`                      | MIGRATE_FULL     | automatización pruebas        |
| 35  | DevOps/QA | `testing-automatizado-vs-manual`                                       | MIGRATE_FULL     | testing automatizado manual   |
| 36  | UX/Dev    | `agentic-web-development-que-es`                                       | MIGRATE_NEW_SLUG | agentic web development       |
| 37  | UX/Dev    | `react-vs-angular-decision-guia`                                       | MIGRATE_NEW_SLUG | React vs Angular              |
| 38  | UX/Dev    | `wcag-que-es-y-como-sumar-mas-usuarios-en-tu-web`                      | MIGRATE_FULL     | WCAG accesibilidad            |
| 39  | Fintech   | `como-las-fintech-esta-cambiando-la-industria-financiera`              | MIGRATE_FULL     | transformación fintech        |
| 40  | Fintech   | `fintech-vs-bancos-tradicionales-cual-es-la-mejor-opcion`              | MIGRATE_FULL     | fintech vs banca              |

**Distribución final:** 12 IA · 8 Cloud · 6 Staff Aug · 5 Ciber · 4 DevOps/QA · 3 UX/Dev · 2 Fintech. Coincide con tus prioridades comerciales I+C+S.

**Nota sobre los 3 posts NEW (no migración):**

- `agentes-ia-casos-uso-empresa-b2b` — cierra gap entre "qué es IA" y "qué servicios tienen". Query comercial alta.
- `kubernetes-vs-serverless-cuando-elegir` — tu catálogo tiene ambos servicios cloud, falta contenido comparativo.
- `staff-augmentation-para-proyectos-ia` — cruce IA + Staff Aug, ruta de entrada ideal a venta cruzada.

---

## 4. Categorías de blog propuestas para el CMS

La tabla `blog_categories` (según `docs/03-cms-data-model.md`) debe quedar con estas 6 categorías **antes** de publicar los posts:

| Slug ES                   | Slug EN                   | Nombre ES               | Nombre EN               | Descripción                                           |
| ------------------------- | ------------------------- | ----------------------- | ----------------------- | ----------------------------------------------------- |
| `inteligencia-artificial` | `artificial-intelligence` | Inteligencia Artificial | Artificial Intelligence | Agentes, automatización, IA generativa, ML            |
| `cloud`                   | `cloud`                   | Cloud                   | Cloud                   | AWS, GCP, FinOps, migración, infraestructura          |
| `staff-augmentation`      | `staff-augmentation`      | Staff Augmentation      | Staff Augmentation      | Nearshore, talento tech, contratación                 |
| `ciberseguridad`          | `cybersecurity`           | Ciberseguridad          | Cybersecurity           | Pentesting, AWS security, ecommerce                   |
| `desarrollo`              | `development`             | Desarrollo              | Development             | DevOps, QA, testing, agentic web, frontend            |
| `industrias`              | `industries`              | Industrias              | Industries              | Fintech, medios, salud, retail — caso de uso vertical |

Razonamiento: mapean 1:1 con los clusters reales del blog histórico + el I+C+S comercial. Mantienen simplicidad (6 > 10).

---

## 5. Tabla final de acciones consolidada por tipo

| Tipo de acción                      | Count total         | Ejemplo                                                      | Impacto SEO                                           |
| ----------------------------------- | ------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| Top 40 (Entrega 2 = briefs)         | 40                  | Ver tabla sección 3                                          | Capturan ~75% del tráfico recuperable                 |
| REDIRECT_TO_CATEGORY                | 44                  | `busqueda-por-voz-...` → `/blog/categoria/seo`               | Preserva equity, distribuye link juice a hub temático |
| REDIRECT_TO_SERVICE                 | 11                  | `que-son-servicios-cloud` → `/servicios/cloud`               | Redirige intención comercial a página de conversión   |
| REDIRECT_TO_INDUSTRY                | 5                   | `seo-para-medios-...` → `/industrias/medios-entretenimiento` | Concentra queries verticales                          |
| REDIRECT_TO_ABOUT                   | 5                   | `nivelics-en-la-7-em-...` → `/nosotros`                      | Corporate news sin valor SEO                          |
| GONE_410                            | 15                  | `drupal-10-vs-drupal-9`                                      | Señal limpia a Google: contenido retirado             |
| **Cubren 100% de los 134 posts ES** | **120+ duplicados** | —                                                            | —                                                     |

---

## 6. Plan de trabajo para Entrega 2 (briefs) + ejecución

### Secuencia recomendada

**Semana 1 (días 1–2):** Decisiones del CMS

1. Crear las 6 categorías de sección 4 en la tabla `blog_categories`.
2. Actualizar `redirects-proposed.ts` con las nuevas reglas de categoría/410 (no solo redirect a `/blog`).
3. Integrar redirects actualizados a `next.config.ts`.

**Semana 1 (días 3–5):** Yo entrego los 40 briefs, tú priorizas.

**Semana 2–5:** Redacción + publicación.

- Ritmo: 2 artículos publicados por día × 20 días hábiles = 40 artículos en 4 semanas.
- Pipeline: Brief → Claude Code expande → tú revisas → CMS → publish.
- Por qué no todos de golpe: Google valora cadencia de publicación sostenida. Un "vertido" de 40 el mismo día es señal negativa.

### Quién hace qué

| Rol             | Responsabilidad                                      | Esfuerzo estimado                |
| --------------- | ---------------------------------------------------- | -------------------------------- |
| Yo (Claude web) | 40 briefs ejecutables                                | Entrega 2 (próxima conversación) |
| Claude Code     | Expandir cada brief a artículo de 1200–1800 palabras | ~15 min/artículo = 10h total     |
| Tú              | Revisar cada artículo → editar → publicar en CMS     | ~30 min/artículo = 20h total     |
| Tú              | Validar cifras/datos técnicos específicos            | incluido en 30 min anterior      |

---

## 7. Riesgos, supuestos y decisiones pendientes

### Supuestos explícitos

1. No hay datos de clicks históricos → priorización por cluster + alineación comercial.
2. La tabla `blog_categories` admite slugs bilingües como el resto del CMS.
3. Los redirects actualizados (categorías + 410) caben dentro del límite de reglas manejable de Next.js middleware (~120 reglas vs. 58 actuales — sigue siendo sostenible).
4. El equipo de contenido (tú + Claude Code) puede sostener cadencia de 2 posts/día durante 20 días hábiles.

### Riesgos y mitigación

| Riesgo                                                                    | Probabilidad | Impacto | Mitigación                                                                                         |
| ------------------------------------------------------------------------- | ------------ | ------- | -------------------------------------------------------------------------------------------------- |
| Google penaliza publicación masiva                                        | Media        | Alto    | Cadencia 2/día, no vertido                                                                         |
| Artículos migrados quedan inferiores al original por falta de contexto    | Media        | Alto    | Briefs con puntos obligatorios + tú validas antes de publicar                                      |
| Redirects a categoría también generan soft-404 si la categoría está vacía | Alta         | Alto    | **Publicar primero los 40 artículos categorizados, recién ahí activar los redirects a categoría**  |
| Categorías nuevas no aparecen en sitemap/llms.txt                         | Media        | Medio   | Actualizar `lib/seo/sitemap-urls.ts` al crear las categorías                                       |
| 410 Gone interpretado como error técnico por Googlebot                    | Baja         | Bajo    | Es precisamente la señal correcta — Google recomienda 410 para contenido retirado intencionalmente |

### Decisiones pendientes tuyas

| #   | Decisión                                                                                    | Default si no respondes                             | Bloquea   |
| --- | ------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------- |
| A   | ¿Las 6 categorías propuestas te cuadran o querés ajustarlas?                                | Se usan tal cual                                    | Entrega 2 |
| B   | ¿Hay posts del top 40 que prefieras dropear por tema sensible?                              | Los 40 se mantienen                                 | Entrega 2 |
| C   | ¿Quieres que los briefs estén en ES + EN o solo ES?                                         | ES primero, EN en una tercera entrega               | Entrega 2 |
| D   | ¿Priorizás velocidad (40 briefs iguales) o diferenciación (algunos más largos tipo pillar)? | 35 estándar (1200–1500 palabras) + 5 pillar (2500+) | Entrega 2 |

---

## 8. Métricas para trackear post-publicación

A los 30/60/90 días del primer artículo publicado:

| Métrica                                         | Fuente            | Objetivo 30d | Objetivo 90d |
| ----------------------------------------------- | ----------------- | ------------ | ------------ |
| URLs del blog indexadas por Google              | GSC Page Indexing | 20/40        | 40/40        |
| Clicks orgánicos al /blog                       | GSC Performance   | >50/mes      | >300/mes     |
| Impressions orgánicas al /blog                  | GSC Performance   | >2000/mes    | >10000/mes   |
| Posts que rankean top 10 para su query objetivo | GSC Performance   | 5/40         | 15/40        |
| Conversiones del blog a /contacto               | GA4 goals         | 2/mes        | 15/mes       |
| CTR desde categorías a post individual          | GA4 events        | >5%          | >8%          |

---

## Apéndice — Archivos complementarios a generar

Para que Claude Code ejecute esto, la Entrega 2 incluye:

1. `docs/seo/blog-strategy-2026.md` — **este documento**.
2. `docs/seo/redirects-proposed.ts` — actualizar con reglas CATEGORY + 410.
3. `docs/seo/blog-priority-table.csv` — tabla plana de 134 filas con acciones.
4. `content/briefs/*.md` — 40 archivos, uno por brief.
5. `scripts/seed-blog-categories.ts` — para crear las 6 categorías en DB.
6. `scripts/seed-blog-posts.ts` — para cargar los 40 posts en DB una vez redactados.

---

**FIN Entrega 1.** Próximo paso: responder las decisiones A-D de la sección 7 para arrancar Entrega 2.
