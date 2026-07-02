import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MappedProductoCard } from "@/lib/cms/productos";
import { accentHex } from "@/lib/cms/productos";

interface Props {
  productos: MappedProductoCard[];
  locale: "es" | "en";
  title?: string;
  cta?: string;
}

export function ProductosHomeStrip({ productos, locale, title, cta }: Props) {
  const isEn = locale === "en";
  if (!productos.length) return null;

  const heading = title || (isEn ? "Our own software" : "Software propio");
  const headline = isEn
    ? "What we built for ourselves. Available for you."
    : "Lo que construimos para nosotros. Disponible para ti.";
  const ctaLabel = cta || (isEn ? "See all products" : "Ver todos los productos");

  return (
    <section
      className="border-y border-white/[0.06] py-12 md:py-16"
      style={{ background: "rgba(255,255,255,0.01)" }}
      data-section="productos-home-strip"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-3">
              {heading}
            </p>
            <h2 className="text-2xl font-bold text-white md:text-3xl leading-tight">{headline}</h2>
            <Link
              href="/productos"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:brightness-125"
            >
              {ctaLabel}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {productos.map((p) => {
              const accent = accentHex(p.accentColor);
              return (
                <Link
                  key={p.id}
                  href={`/productos/${p.slug}`}
                  className="group rounded-xl p-4 transition-transform hover:-translate-y-1 block"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderLeft: `3px solid ${accent}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-[11px] uppercase tracking-wider font-semibold"
                      style={{ color: accent }}
                    >
                      {p.category}
                    </span>
                    <ArrowRight size={12} className="text-text-40 group-hover:text-text-70" />
                  </div>
                  <div className="text-sm font-semibold text-white">{p.name}</div>
                  <div className="mt-1 text-xs text-text-55 line-clamp-2">{p.tagline}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
