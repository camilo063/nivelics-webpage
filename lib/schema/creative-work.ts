interface CaseStudy {
  name: string;
  description: string;
  url: string;
}

export function getCreativeWorkSchema(cases: CaseStudy[]) {
  return cases.map((c) => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: c.name,
    description: c.description,
    url: `https://www.nivelics.com${c.url}`,
    author: {
      "@type": "Organization",
      "@id": "https://www.nivelics.com/#organization",
      name: "Nivelics SAS",
    },
  }));
}
