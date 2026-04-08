import { NextResponse } from "next/server";

const TEAM = [
  {
    name: "Camilo Andrés Villanueva Niño",
    role: "CEO & Co-Fundador",
    description:
      "Lidera la visión estratégica y el crecimiento de Nivelics desde su fundación en 2012.",
  },
  {
    name: "Jonathan Olarte",
    role: "CTO / Chief Technology Strategist",
    description:
      "Responsable de la estrategia tecnológica, arquitectura de soluciones y liderazgo del equipo de ingeniería.",
  },
  {
    name: "Omar Neira",
    role: "CSO (Chief Sales Officer)",
    description: "Lidera la estrategia comercial y desarrollo de nuevos mercados.",
  },
  {
    name: "Fernanda Soto",
    role: "CD / DMM (Directora de Marketing y Mercadeo)",
    description:
      "Responsable de posicionamiento de marca, generación de demanda y estrategia digital.",
  },
  {
    name: "Hernando Villanueva",
    role: "Director Administrativo",
    description: "Gestión administrativa, financiera y operativa de la compañía.",
  },
];

export async function GET() {
  return NextResponse.json({
    company: "Nivelics SAS",
    team: TEAM,
  });
}
