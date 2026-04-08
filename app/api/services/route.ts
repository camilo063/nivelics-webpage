import { NextResponse } from "next/server";

const SERVICES = [
  {
    slug: "inteligencia-artificial",
    name: "Inteligencia Artificial Aplicada",
    shortName: "IA",
    description:
      "Agentes de IA, automatización de procesos, RAG, analítica avanzada, agentes comerciales, marketing con IA.",
    url: "/servicios/inteligencia-artificial",
    subservices: [
      "Agentes de IA",
      "IA Generativa",
      "RAG",
      "Analítica Avanzada",
      "Computer Vision",
      "NLP & NLU",
      "MLOps",
      "Consultoría en IA",
    ],
  },
  {
    slug: "cloud",
    name: "Cloud (AWS · GCP · Azure)",
    shortName: "Cloud",
    description: "Migración, arquitectura, FinOps, infraestructura, serverless, seguridad cloud.",
    url: "/servicios/cloud",
    subservices: [
      "Arquitectura Multi-Cloud",
      "Migración Cloud",
      "DevOps & SRE",
      "Cloud Security",
      "Serverless",
      "Kubernetes & Containers",
    ],
  },
  {
    slug: "finops",
    name: "FinOps",
    shortName: "FinOps",
    description: "Optimización y gobierno de costos cloud. Ahorro típico 30-40%.",
    url: "/servicios/cloud/finops",
    subservices: [
      "Visibilidad",
      "Optimización",
      "Asignación de Costos",
      "Forecasting",
      "Gobernanza",
      "Cultura FinOps",
    ],
  },
  {
    slug: "staff-augmentation",
    name: "Staff Augmentation Premium",
    shortName: "Staffing",
    description:
      "Talento colombiano bilingüe senior. Integración en 6 días hábiles. Ahorro hasta 40% vs. USA/Europa.",
    url: "/servicios/staff-augmentation",
    subservices: [
      "Frontend Engineers",
      "Backend Engineers",
      "Mobile Developers",
      "DevOps & Cloud Engineers",
      "Data Engineers & ML Engineers",
      "QA Engineers & SDET",
      "Tech Leads & Architects",
      "Product Managers & Scrum Masters",
    ],
  },
  {
    slug: "desarrollo-digital",
    name: "Desarrollo Digital",
    shortName: "Dev",
    description: "Apps móviles, plataformas web, e-commerce, APIs y microservicios.",
    url: "/servicios/desarrollo-digital",
    subservices: [
      "Aplicaciones Web",
      "Apps Móviles",
      "APIs & Microservicios",
      "Plataformas a Medida",
      "QA & Testing",
      "MVP & Product Discovery",
    ],
  },
];

export async function GET() {
  return NextResponse.json({
    company: "Nivelics SAS",
    framework: "I+C+S (Inteligencia Artificial + Cloud + Staffing)",
    services: SERVICES,
  });
}
