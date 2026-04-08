interface PersonInput {
  name: string;
  jobTitle: string;
  description: string;
}

export function getPersonSchema({ name, jobTitle, description }: PersonInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description,
    worksFor: {
      "@type": "Organization",
      "@id": "https://www.nivelics.com/#organization",
      name: "Nivelics SAS",
    },
  };
}

export const TEAM_MEMBERS: PersonInput[] = [
  {
    name: "Camilo Andrés Villanueva Niño",
    jobTitle: "CEO & Co-Fundador",
    description:
      "Lidera la visión estratégica y el crecimiento de Nivelics desde su fundación en 2012. Experiencia en desarrollo de negocios tecnológicos B2B en LATAM y USA.",
  },
  {
    name: "Jonathan Olarte",
    jobTitle: "CTO / Chief Technology Strategist",
    description:
      "Responsable de la estrategia tecnológica, arquitectura de soluciones y liderazgo del equipo de ingeniería.",
  },
  {
    name: "Omar Neira",
    jobTitle: "CSO (Chief Sales Officer)",
    description:
      "Lidera la estrategia comercial y desarrollo de nuevos mercados. Foco en expansión regional y partnerships estratégicos.",
  },
  {
    name: "Fernanda Soto",
    jobTitle: "CD / DMM (Directora de Marketing y Mercadeo)",
    description:
      "Responsable de posicionamiento de marca, generación de demanda y estrategia digital de Nivelics.",
  },
  {
    name: "Hernando Villanueva",
    jobTitle: "Director Administrativo",
    description: "Gestión administrativa, financiera y operativa de la compañía.",
  },
];
