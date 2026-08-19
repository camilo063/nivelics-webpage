interface ReviewSchemaOptions {
  /** Real client testimonial text, as stored in the CMS (never invented). */
  quote: string;
  /** Person who gave the testimonial. */
  author: string;
  /** Author's job title. Omitted from the schema when absent. */
  role?: string | null;
  /** Name of the case study the review appears on (emitted as `about`). */
  aboutName?: string;
  /** Site-relative path of the case study page, e.g. "/casos-de-exito/televisa". */
  aboutUrl?: string;
  locale: "es" | "en";
}

/**
 * schema.org Review for a client testimonial.
 *
 * Deliberately emits NO numeric rating fields (reviewRating / aggregate
 * ratings): no real scores exist for these testimonials and data must not
 * be fabricated.
 */
export function getReviewSchema({
  quote,
  author,
  role,
  aboutName,
  aboutUrl,
  locale,
}: ReviewSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    reviewBody: quote,
    author: {
      "@type": "Person",
      name: author,
      ...(role ? { jobTitle: role } : {}),
    },
    itemReviewed: {
      "@type": "ProfessionalService",
      "@id": "https://www.nivelics.com/#organization",
      name: "Nivelics",
    },
    ...(aboutName && aboutUrl
      ? {
          about: {
            "@type": "CreativeWork",
            name: aboutName,
            url: `https://www.nivelics.com${aboutUrl}`,
          },
        }
      : {}),
    inLanguage: locale === "es" ? "es-CO" : "en-US",
  };
}
