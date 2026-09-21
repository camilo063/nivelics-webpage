import { ORGANIZATION_ID, SCHEMA_BASE } from "./webpage";

interface PersonInput {
  name: string;
  jobTitle: string;
  description: string;
}

/** Slug estable a partir del nombre, para que /nosotros y /nosotros/equipo
 *  describan a la misma persona y no dos entidades sueltas. */
function personId(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${SCHEMA_BASE}/#person-${slug}`;
}

export function getPersonSchema({ name, jobTitle, description }: PersonInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(name),
    name,
    jobTitle,
    description,
    worksFor: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
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
