import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { MappedProductoCard } from "@/lib/cms/productos";
import { accentHex } from "@/lib/cms/productos";

interface Props {
  productos: MappedProductoCard[];
  locale: "es" | "en";
  title?: string;
  cta?: string;
}

/**
 * Screenshots reales de los productos (Fase 1.5 — public/products/*.png,
 * capturados de los sitios en producción). Whitelist por slug: si un producto
 * nuevo no tiene captura, la card se renderiza sin imagen.
 */
const PRODUCT_SHOTS: Record<string, string> = {
  paywl: "/products/paywl.png",
  niveleads: "/products/niveleads.png",
  hirely: "/products/hirely.png",
};

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
      className="border-y border-border-subtle py-12 md:py-16"
      style={{ background: "rgba(255,255,255,0.01)" }}
      data-section="productos-home-strip"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-200 mb-3">
              {heading}
            </p>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white md:text-3xl leading-tight">
              {headline}
            </h2>
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
              const shot = PRODUCT_SHOTS[p.slug];
              return (
                <Link
                  key={p.id}
                  href={`/productos/${p.slug}`}
                  className="group glass-elevated card-lift block overflow-hidden rounded-xl"
                  style={{ borderLeft: `3px solid ${accent}` }}
                >
                  {shot ? (
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-border-subtle bg-bg-surface">
                      {/* Mini browser chrome — producto real, no mockup */}
                      <div className="absolute left-0 right-0 top-0 z-10 flex h-5 items-center gap-1 bg-[#0a0a0f]/80 px-2 backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                      </div>
                      <Image
                        src={shot}
                        alt={`${p.name} — interfaz real del producto`}
                        fill
                        sizes="(max-width: 640px) 100vw, 260px"
                        className="object-cover object-top pt-5 transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                  ) : null}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-[11px] uppercase tracking-[0.12em] font-semibold"
                        style={{ color: accent }}
                      >
                        {p.category}
                      </span>
                      <ArrowRight size={12} className="text-text-40 group-hover:text-text-70" />
                    </div>
                    <div className="text-sm font-semibold text-white">{p.name}</div>
                    <div className="mt-1 text-xs text-text-55 line-clamp-2">{p.tagline}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
