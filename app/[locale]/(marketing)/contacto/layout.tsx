import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Agenda tu diagnóstico gratuito",
  description:
    "Cuéntanos sobre tu proyecto o desafío tecnológico. Te contactamos en menos de 24 horas.",
  alternates: {
    canonical: "https://www.nivelics.com/contacto",
    languages: {
      es: "https://www.nivelics.com/contacto",
      en: "https://www.nivelics.com/en/contact",
      "x-default": "https://www.nivelics.com/contacto",
    },
  },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
