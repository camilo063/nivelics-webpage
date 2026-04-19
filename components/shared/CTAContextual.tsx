import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/cms";

interface Props {
  categorySlug: string | null;
  locale: Locale;
}

interface Copy {
  title: string;
  subtitle: string;
  cta: string;
}

const COPY: Record<string, { es: Copy; en: Copy }> = {
  "inteligencia-artificial": {
    es: {
      title: "¿Quieres implementar IA en tu empresa?",
      subtitle: "Agenda un diagnóstico gratuito con nuestro equipo.",
      cta: "Hablar con un experto",
    },
    en: {
      title: "Want to implement AI in your company?",
      subtitle: "Schedule a free assessment with our team.",
      cta: "Talk to an expert",
    },
  },
  cloud: {
    es: {
      title: "¿Necesitas optimizar tu infraestructura cloud?",
      subtitle: "Agenda un diagnóstico gratuito con nuestro equipo.",
      cta: "Hablar con un experto",
    },
    en: {
      title: "Need to optimize your cloud infrastructure?",
      subtitle: "Schedule a free assessment with our team.",
      cta: "Talk to an expert",
    },
  },
  "staff-augmentation": {
    es: {
      title: "¿Buscas talento tech para tu equipo?",
      subtitle: "Agenda un diagnóstico gratuito con nuestro equipo.",
      cta: "Hablar con un experto",
    },
    en: {
      title: "Looking for tech talent for your team?",
      subtitle: "Schedule a free assessment with our team.",
      cta: "Talk to an expert",
    },
  },
  ciberseguridad: {
    es: {
      title: "¿Necesitas reforzar la seguridad de tu plataforma?",
      subtitle: "Agenda un diagnóstico gratuito con nuestro equipo.",
      cta: "Hablar con un experto",
    },
    en: {
      title: "Need to strengthen your platform security?",
      subtitle: "Schedule a free assessment with our team.",
      cta: "Talk to an expert",
    },
  },
  desarrollo: {
    es: {
      title: "¿Tienes un producto digital por construir?",
      subtitle: "Agenda un diagnóstico gratuito con nuestro equipo.",
      cta: "Hablar con un experto",
    },
    en: {
      title: "Have a digital product to build?",
      subtitle: "Schedule a free assessment with our team.",
      cta: "Talk to an expert",
    },
  },
};

const DEFAULT_COPY: { es: Copy; en: Copy } = {
  es: {
    title: "¿Te interesa este tema?",
    subtitle: "Agenda un diagnóstico gratuito con nuestro equipo.",
    cta: "Hablar con un experto",
  },
  en: {
    title: "Interested in this topic?",
    subtitle: "Schedule a free assessment with our team.",
    cta: "Talk to an expert",
  },
};

export function CTAContextual({ categorySlug, locale }: Props) {
  const bundle = (categorySlug && COPY[categorySlug]) || DEFAULT_COPY;
  const copy = bundle[locale];
  const href = locale === "en" ? "/en/contact" : "/contacto";

  return (
    <div className="mt-14 mb-14 rounded-xl border border-white/10 bg-gradient-to-br from-[var(--primary)]/10 via-[var(--primary)]/5 to-transparent p-8 md:p-10">
      <h3 className="text-xl md:text-2xl font-medium text-white max-w-xl">{copy.title}</h3>
      <p className="mt-3 text-white/60">{copy.subtitle}</p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-6 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-primary/25 transition-transform duration-300 hover:scale-[1.02]"
      >
        {copy.cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
